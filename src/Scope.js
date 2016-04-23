global.jScope = Scope;

function Scope(ref_obj, options) {
	options || (options = {});
	var self = this;
	self.id = $UID("SC");
	self.E = {}; // events
	self.C = []; // children local scope 子集
	self.R = ref_obj || {}; // reference objects 参考对象
	var store = options.store;
	self.O = $InsOf(store, $Object) ? store : $Object($InsOf(store, Object) ? store : {}); // object 作用域的变量集合
	self.setParent(options.parent); // pare scope 父级
	self.returner = null; // 这个作用域最后的返回值

	self.B = null; // block 块作用域，默认不激活，交给插件处理

	var onerror = options.onerror;
	if ($InsOf(onerror, _GlobalFunction)) {
		self.on("error", onerror);
	}
};

var __ScopePrototype = Scope.prototype = {};
__ScopePrototype.on = function (eventName, eventHandle) {
	var self = this;
	var events = self.E;
	$Push(events[eventName] || (events[eventName] = []), eventHandle);
	return self;
};
__ScopePrototype.off = function (eventName, eventHandle) {
	var self = this;
	var events = self.E;
	$Remove(events[eventName] || (events[eventName] = []), eventHandle);
	return self;
};
__ScopePrototype.emit = function (eventName) {
	var self = this;
	var eventList = $HasAndGet(self.E, eventName);
	if (eventList) {
		var args = arguments.length > 1 && $Slice(arguments, 1);
		$ForEach(eventList, function (handle) {
			args ? handle.apply(self, args) : handle.call(this);
		});
	}
	return self;
};
__ScopePrototype.getTopScope = function () {
	var res = this;
	while (res.P) {
		res = res.P
	}
	return res;
}

__ScopePrototype.push = function (scope_name) {
	var self = this;
	var child_scope = new Scope({}, {
		parent: self
	});
	$Push(self.C, child_scope);

	C_SP = child_scope;
	return child_scope;
};
__ScopePrototype.pop = function (returner) {
	var self = this;
	var csp = $LastItem(self.C);
	return csp && csp.destroy(returner);
};

__ScopePrototype.setParent = function (parent) {
	var self = this;
	if (self.P = parent || null) {
		self.get = _ScopeNormalGet;
		self.set = _ScopeNormalSet;
		self.TypeOf = _ScopeNormalTypeOf;
		self.Del = _ScopeNormalDel;
	} else {
		self.get = _ScopeTopGet;
		self.set = _ScopeTopSet;
		self.TypeOf = _ScopeTopTypeOf;
		self.Del = _ScopeTopDel;
	}
};
__ScopePrototype.get = _ScopeNormalGet;

/*
 * unpack: 是否解包，如果解包取出的对象默认是原生的JS对象，如果封包取出，则是内部存储的对象
 */
/*GET*/
function _ScopeNormalGet(key, unpack) {
	var self = this;
	var res = (self.O.has(key) ? self.O : self.P).get(key, unpack);
	if ($InsOf(res, $$Function) && res.T === self.O && !res.S) {// 修正函数对象的this指向
		res.T = self.getTopScope().O
	}
	return res;
};

function _ScopeTopGet(key, unpack) { // 没有Parent对象的Get方法 no parent get 
	return this.O.get(key, unpack);
};
__ScopePrototype.set = _ScopeNormalSet;
/*SET*/
function _ScopeNormalSet(key, value) {
	var self = this;
	return (self.O.has(key) ? self.O : self.P).set(key, value);
};

function _ScopeTopSet(key, value) { // 没有Parent对象的Get方法 no parent get 
	return this.O.set(key, value);
};
__ScopePrototype.Var = _ScopeTopSet;
/*TYPEOF*/
function _ScopeNormalTypeOf(key) {
	var self = this;
	return (self.O.has(key) ? self.O : self.P).TypeOf(key);
};

function _ScopeTopTypeOf(key) { // 没有Parent对象的Get方法 no parent get 
	return this.O.TypeOf(key);
};
__ScopePrototype.TypeOf = _ScopeTopTypeOf;
/*DELETE*/
function _ScopeNormalDel(key) {
	var self = this;
	return (self.O.has(key) ? self.O : self.P).Del(key);
};

function _ScopeTopDel(key) { // 没有Parent对象的Get方法 no parent get 
	return this.O.Del(key);
};
__ScopePrototype.Del = _ScopeTopDel;

// destroy 销毁作用域
__ScopePrototype.destroy = function (returner) {
	var self = this;
	// 注销事件监听
	self.E = null;
	// 销毁子集作用域
	$ForEach(self.C, function (csp) {
		csp.destroy()
	});
	self.C = null;
	// 移除参考对象
	self.R = null;
	// 断开对象的引用，由系统垃圾回收器来进行回收
	self.O = null;
	// 断开与父级的关联
	if (self.P) {
		C_SP = self.P;
		$Remove(C_SP.C, self);
		self.P = null;
	}

	// 禁用这个作用域对象的所有方法。
	for (var funName in __ScopePrototype) {
		self[funName] = _DestroyedHandle;
	}

	self.returner = returner;
	return returner; // 直接返回返回值而不是被销毁的作用域。让作用域被CG直接回收
};

function _DestroyedHandle() {
	throw ReferenceError("Scope objects has been destroyed.");
};


var C_SP = Scope.global = new Scope(global); //current Scope

Scope.current = function () {
	return C_SP
};