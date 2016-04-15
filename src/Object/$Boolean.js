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