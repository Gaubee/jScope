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