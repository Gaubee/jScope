
__ScopePrototype.pushBlock = function() {
	var self = this;
	self.B = [];
	AOP_ScopeBlock_Get_And_Set(self);
	return (self.pushBlock = _ScopePushBlock).call(self);
};

__ScopePrototype.popBlock = function() {
	var self = this;
	var block_scope = self.B.pop();
	block_scope.destroy();
	if (!self.B.length) {
		self.B = null;
		self.setParent(self.P); //重新设定Getter、Setter
	}
	return block_scope.returner;
};

function _ScopePushBlock() {
	var self = this;
	var block_scope = $Push(this.B, new $Object({})); // I个局限的局部作用域
	// TODO: change get set ， AOP with block Getter Setter
	return block_scope
};
// 将局部作用域改装成
function AOP_ScopeBlock_Get_And_Set(sp) {
	var source_get = sp.get;
	var source_set = sp.set;
	sp.get = function(key) {
		var res;
		var has_res;
		var block_scope
		$ForEach(sp.B, function(bsp) {
			if (has_res = bsp.has(key)) {
				res = bsp.get(key)
			}
		});
		return has_res ? res : source_get.call(sp, key);
	};
	sp.set = function(key) {
		
	};
};