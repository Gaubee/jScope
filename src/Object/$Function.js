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