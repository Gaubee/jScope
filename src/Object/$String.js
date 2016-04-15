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