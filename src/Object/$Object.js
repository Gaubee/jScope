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
	return $IsOwn(self.V, key) || $IsOwn(self.G, key) || $IsOwn(self.S, key);
};

function _$$Object_Mix_GetProp(key) {
	var self = this;
	var getter = self.G;
	var value = self.V;
	if ($IsOwn(getter, key)) {
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
	if ($IsOwn(setter, key)) {
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
	return $IsOwn(this.C, key)
};
function assignPropConfig(old_config, new_config) {
	new_config || (new_config = {});
	var res_config = {};
	$ForEach([
		"enumerable",
		"configurable",
		"writable"
	], function (key) {
		res_config[key] = !!($IsOwn(new_config, key) ? new_config : old_config)[key]
	});
	return res_config;
};
//get Property
__$$ObjectProperty.get = function (key, unpack) {
	var self = this;
	if (self.has(key)) {
		var res = self.G && $IsOwn(self.G, key) ? self.G[key].call(self.V) : self.V[key];
	} else {
		res = $undefined
	}
	return unpack ? (res ? res.valueOf() : res) : $Base(res)
};
//set Property
__$$ObjectProperty.set = function (key, value) {
	var self = this;
	/*TODO:根据config判断对象是否可被重写*/
	var old_config = self.C[key];
	if (old_config && ((!old_config.writable && $IsOwn(self.V, key)) || !old_config.configurable)) {
		return
	}
	// 普通的变量定义，初始化默认的config
	$IsOwn(self.C, key) || (self.C[key] = assignPropConfig({
		writable: TRUE,
		enumerable: TRUE,
		configurable: TRUE
	}));
	var V = $Base(value);
	self.S && $IsOwn(self.S, key) ? self.S[key].call(self.V, value) : (self.V[key] = value);

	return V;
};
//define getter
__$$ObjectProperty.defGet = function (key, handle, new_config) {
	var self = this;
	var getter = self.G || (self.G = {});
	var old_config = self.C;
	if (!(handle instanceof Function)) {
		throw TypeError("getter must be an function.")
	}
	/*判断对象是否可被重写*/
	var old_config = config[key];
	if (old_config && !old_config.configurable) {
		return;
	}
	config[key] = assignPropConfig(old_config, new_config);

	getter[key] = handle;
	delete self.V[key];
	self.get = _$$Object_Mix_GetProp;
	self.has = _$$Object_Mix_HasProp;
};
//define setter
__$$ObjectProperty.defSet = function (key, handle, new_config) {
	var self = this;
	var setter = self.S || (self.S = {});
	var config = self.C;
	if (!(handle instanceof Function)) {
		throw TypeError("setter must be an function.")
	}
	/*判断对象是否可被重写*/
	var old_config = config[key];
	if (old_config && !old_config.configurable) {
		return;
	}
	config[key] = assignPropConfig(old_config, new_config);

	setter[key] = handle;
	delete self.V[key];
	self.set = _$$Object_Mix_SetProp;
	self.has = _$$Object_Mix_HasProp;
};
__$$ObjectProperty.def = function (key, config) {
	var self = this;
	var value = self.V;
	var config = self.C || {};

	/*判断对象是否可被重写*/
	var old_config = config[key];
	if (old_config && !old_config.configurable) {
		return;
	}
	config[key] = assignPropConfig(old_config, config);

	if ($IsOwn(value, key) && old_config.writable) {
		if ($IsOwn(config, value)) {
			value[key] = config.value
		}
		self.C = assignPropConfig(config)
	} else if (old_config.configurable) {
		if ($IsOwn(config.get)) {
			var setter = self.S || (self.S = {});
			getter[key] = config.get;
		}
		if ($IsOwn(config.set)) {
			var getter = self.G || (self.G = {});
			setter[key] = config.set;
		}
		self.C = assignPropConfig(config)
	}
	return self;
};
__$$ObjectProperty.Del = function (key) {
	var self = this;
	var config = self.C;
	var value = self.V;
	var getter = self.G;
	var setter = self.S;
	var res = TRUE;
	if ($IsOwn(config, key)) {
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