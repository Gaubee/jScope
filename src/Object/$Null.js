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