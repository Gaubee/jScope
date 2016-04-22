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
		return $IsOwn(this.V, key)
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