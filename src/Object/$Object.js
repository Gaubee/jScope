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