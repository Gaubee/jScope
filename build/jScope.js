(function(root, factory) {
		if (typeof define === 'function' && define.amd) {
			define([], function() {
				return factory(root);
			});
		} else if (typeof exports === 'object') {
			factory(module.exports);
		} else {
			factory(root);
		}
	}(typeof global != 'undefined' ? global : typeof window != 'undefined' ? window : this, function(global) {
/*
 * 更好的压缩率
 */
var __PROTOTYPE = "prototype";
var __VALUEOF = "valueOf";
var __TOSTRING = "toString";
var void_0;
var _GlobalFunction = Function;

var TRUE = true;
var FALSE = false;
var NULL = null;
var UNDEFINED;
// var NAN = NaN;
// var INFINITY = Infinity;

function $Push(arr, item) {
	arr[arr.length] = item;
	return arr
}

function $ForEach(arr, cb) {
	for (var i = 0, len = arr.length; i < len; i += 1) {
		cb(arr[i], i)
	}
}

function $Map(arr, cb) {
	for (var i = 0, len = arr.length, res = []; i < len; i += 1) {
		$Push(res, cb(arr[i], i))
	}
	return res
}

var _slice = Array[__PROTOTYPE].slice;
var __StringProto__ = String[__PROTOTYPE];

function $Slice(arr, start_index, end_index) {
	return _slice.call(arr, start_index, end_index);
};

function $Remove(arr, item) {
	var index = arr.indexOf(item);
	index !== -1 && arr.splice(index, 1);
};

function $HasAndGet(obj, key) {
	return obj.hasOwnProperty(key) && obj[key];
};

var _hasOwnPro = global.hasOwnProperty;

function $IsOwnPro(obj, key) {
	return _hasOwnPro.call(obj, key);
};

function $InsOf(obj, Con) {
	return obj instanceof Con
};

function $UID(prefix) {
	return (prefix || "") + Math.random().toString(36).substr(2);
};

var PROTO = _GlobalFunction();

function $Create(proto) {
	PROTO[__PROTOTYPE] = proto;
	return new PROTO;
};

function $LastItem(arr) {
	return arr[arr.length - 1]
};

function noop() {}

//将字符串反转义,同JSON.stringify(string)
var charIndexBuggy = "a" [0] != "a";
var Escapes = {
	92: "\\\\",
	34: '\\"',
	8: "\\b",
	12: "\\f",
	10: "\\n",
	13: "\\r",
	9: "\\t"
};

function strStringify(value) {
	var result = '"',
		index = 0,
		length = value.length,
		useCharIndex = !charIndexBuggy || length > 10;
	var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
	for (; index < length; index++) {
		var charCode = value.charCodeAt(index);
		// If the character is a control character, append its Unicode or
		// shorthand escape sequence; otherwise, append the character as-is.
		switch (charCode) {
			case 8:
			case 9:
			case 10:
			case 12:
			case 13:
			case 34:
			case 92:
				result += Escapes[charCode];
				break;
			default:
				if (charCode < 32) {
					result += unicodePrefix + toPaddedString(2, charCode.toString(16));
					break;
				}
				result += useCharIndex ? symbols[index] : value.charAt(index);
		}
	}
	return result + '"';
};
function _ReturnThisV() {
	return this.V && this.V.valueOf();
};

function _ReturnThisVString() {
	return this.V + "";
};

Scope.Base = $Base;

function $Base(obj) {
	return $InsOf(obj, $Base) ? obj : _BaseTypeCusMap[typeof obj](obj)
};
var _BaseTypeCusMap = {
	"string": $String,
	"boolean": $Boolean,
	"number": $Number,
	"function": $Function,
	"undefined": $Undefined,
	"object": function (v) {
		return (v /*!== null */ ? $Object : $Null)(v)
	}
};

var _$BaseProto = $Base[__PROTOTYPE] = {
	has: function (key) {
		return $IsOwnPro(this.V, key)
	},
	//get Property
	get: function (key, unpack) {
		var res = this.V[key];
		$InsOf(res, $Base) || (res = $undefined);// if false then
		return unpack ? res.valueOf() : res
	},
	//set Property
	set: function (key, value) {
		return this.V[key] = $Base(value);
	},
	TypeOf: function () {
		return this.constructor.TypeofValue;
	},
	destory: function () {
		delete this.V;
	},
	// ===
	equal: function (obj) {
		return this.V === ($InsOf(obj, $Base) ? obj.V : obj)
	},
	like: function (obj) {
		return this.V == ($InsOf(obj, $Base) ? obj.V : obj)
	}
};
_$BaseProto[__VALUEOF] = _ReturnThisV;
_$BaseProto[__TOSTRING] = _ReturnThisVString;


function _Undefined_AND_Null_TypeError() {
	throw TypeError("Cannot convert undefined or null to object");
};
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
	return (self.O.has(key) ? self.O : self.P).get(key, unpack);
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
Scope.Boolean = $Boolean;
function $$Boolean(v) {
	this.V = v;
};

$$Boolean.TypeofValue = "string"

var __$$BooleanProperty = $$Boolean[__PROTOTYPE] = $Create(_$BaseProto);

/*
 * true false 是系统常量
 */
$true = new $$Boolean(TRUE);
$false = new $$Boolean(FALSE);

function $Boolean(v) {
	return v ? $true : $false
};
Scope.Function = $Function;

function $$Function(fun, args) {
	this.V = fun;
	this.A = args;
};

$$Function.TypeofValue = "function"

var __$$FunctionProperty = $$Function[__PROTOTYPE] = $Create(_$BaseProto);
__$$FunctionProperty.run = function (ctx, args) {
	var self = this;
	self.V.apply(ctx, args);
};

function $Function(fun, args) {
	return $$Function(fun, args)
};
Scope.Null = $Null;
function $$Null(v) {
	this.V = v;
};

$$Null.TypeofValue = "object";

var __$$NullProperty = $$Null[__PROTOTYPE] = $Create(_$BaseProto);

__$$NullProperty[__VALUEOF] = _Undefined_AND_Null_TypeError;
__$$NullProperty[__TOSTRING] = _Undefined_AND_Null_TypeError;
/*
 * null是一个系统常量
 */
var $null = new $$Null(null);

function $Null() {
	return $null
};
Scope.Number = $Number;

function $$Number(v) {
	this.V = v;
};

$$Number.TypeofValue = "number"

var __$$NumberProperty = $$Number[__PROTOTYPE] = $Create(_$BaseProto);
/*
 * 系统常量
 */
var $NaN = new $$Number(NaN);
$NaN.equal = function () { // any value including NaN, 所以直接返回false
	return FALSE
};
var $Infinity = new $$Number(Infinity);
var $_Infinity = new $$Number(-Infinity);

function $Number(v) {
	var self;
	if (isNaN(v)) {
		self = $NaN;
	} else if (v === Infinity) {
		self = $Infinity
	} else if (v === -Infinity) {
		self = $_Infinity
	} else {
		self = new $$Number(v);
	}
	return self
};
Scope.Object = $Object;

function $$Object(v) {
	this.V = v;
	this.G = null; //getter
	this.S = null; //setter
	this.C = {}; //config
};
$$Object.getProp = function (obj, key) {
	if ($InsOf(obj, $$Object) || $InsOf(obj, $String) || $InsOf(obj, $Number)) { //可用属性名进行优化
		var res = obj.get(key)
	} else if (obj) {
		res = obj[key]
	}
	return res;
};

$$Object.TypeofValue = "object"

function _$$Object_Mix_HasProp(key) {
	var self = this;
	return $IsOwnPro(self.V, key) || $IsOwnPro(self.G, key) || $IsOwnPro(self.S, key);
};

function _$$Object_Mix_GetProp(key) {
	var self = this;
	var getter = self.G;
	var value = self.V;
	if ($IsOwnPro(getter, key)) {
		var res = getter[key].call(value, key)
	} else {
		res = value[key]
	}
	return res
};

function _$$Object_Mix_SetProp(key, data, config) {
	var self = this;
	var setter = self.S;
	var value = self.V;
	if ($IsOwnPro(setter, key)) {
		setter[key].call(value, key, data)
	} else {
		var config = self.C;
		/*TODO:根据config判断对象是否可被重写*/
		config[key] = config;
		value[key] = data
	}
	return data
};

var __$$ObjectProperty = $$Object[__PROTOTYPE] = $Create(_$BaseProto);
__$$ObjectProperty.has = function (key) {
	return $IsOwnPro(this.C, key)
};
//get Property
__$$ObjectProperty.get = function (key, unpack) {
	var self = this;
	if (self.has(key)) {
		var res = self.G && $IsOwnPro(self.G, key) ? self.G[key].call(self.V) : self.V[key];
	} else {
		res = $undefined
	}
	return unpack ? (res ? res.valueOf() : res) : $Base(res)
};
//set Property
__$$ObjectProperty.set = function (key, value, config) {
	var self = this;
	/*TODO:根据config判断对象是否可被重写*/
	self.C[key] = config;
	value = $Base(value);
	self.S && $IsOwnPro(self.S, key) ? self.S[key].call(self.V, value) : (self.V[key] = value);
	return value;
};
//define getter
__$$ObjectProperty.defGet = function (key, handle, config) {
	var self = this;
	var getter = self.G || (self.G = {});
	var config = self.C;
	if (!(handle instanceof Function)) {
		throw TypeError("getter must be an function.")
	}
	/*TODO:根据config判断对象是否可被重写*/
	config[key] = config;
	getter[key] = handle;
	self.get = _$$Object_Mix_GetProp;
	self.has = _$$Object_Mix_HasProp;
};
//define setter
__$$ObjectProperty.defSet = function (key, handle, config) {
	var self = this;
	var setter = self.S || (self.S = {});
	var config = self.C;
	if (!(handle instanceof Function)) {
		throw TypeError("setter must be an function.")
	}
	/*TODO:根据config判断对象是否可被重写*/
	config[key] = config;
	setter[key] = handle;
	self.set = _$$Object_Mix_SetProp;
	self.has = _$$Object_Mix_HasProp;
};
__$$ObjectProperty.Del = function (key) {
	var self = this;
	var config = self.C;
	var value = self.V;
	var getter = self.G;
	var setter = self.S;
	var res = TRUE;
	if ($IsOwnPro(config, key)) {
		/*TODO:根据config判断对象是否可被删除*/
		// res = config[key]
		getter && delete getter[key];
		setter && delete setter[key];
		delete value[key];
		delete config[key];
	}
	return res
};

function $Object(v) {
	return v === null ? $null : new $$Object(v);
};
Scope.String = $String;

function $$String(v) {
	this.V = v;
};

$$String.TypeofValue = "string"

var __$$StringPrototype = $$String[__PROTOTYPE] = $Create(_$BaseProto);

__$$StringPrototype.get = function (key) {
	var self = this;
	var value = self.V;
	if (isFinite(key) && key % 1 === 0) {
		var res = value.charAt(key)
	} else {
		res = value[key]
	}
	return res
};
__$$StringPrototype.set = function (key, obj) {
	var self = this;
	var value = self.V;
	if (!(isFinite(key) && key % 1 === 0)) {
		value[key] = obj
	}
	return obj
};

function $String(v) {
	return new $$String(v)
};
Scope.Undefined = $Undefined;
function $$Undefined(v) {
	this.V = v;
};
$$Undefined.TypeofValue = "undefined";

var __$$UndefinedProperty = $$Undefined[__PROTOTYPE] = $Create(_$BaseProto);

__$$UndefinedProperty[__VALUEOF] = _Undefined_AND_Null_TypeError;
__$$UndefinedProperty[__TOSTRING] = _Undefined_AND_Null_TypeError;

/*
 * undefined是一个系统常量
 */
var $undefined = new $$Undefined();

function $Undefined() {
	return $undefined
};
}));