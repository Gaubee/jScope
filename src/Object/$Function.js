Scope.Function = $Function;

function $$Function(fun, args) {
	this.V = fun;
	this.T = null; // 临时的this对象
	this.S = null; // bind函数所绑定的super this对象 
};

$$Function.TypeofValue = "function"

var __$$FunctionProperty = $$Function[__PROTOTYPE] = $Create(_$BaseProto);
__$$FunctionProperty.run = function () {
	var self = this;
	var args = $Slice(arguments);
	self.V.apply(self.S || self.T, args);
};

function $Function(fun, args) {
	return new $$Function(fun, args)
};