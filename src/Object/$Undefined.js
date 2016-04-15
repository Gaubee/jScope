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