# jScope

模拟JavaScript作用域的数据缓存库。可以用于JS-VM中实现Javascript数据对象的存储。

JavaScript 有两个范围：全局和局部，还有let、const关键字所带来的块作用域的支持。

# API

## 作用域的使用方式

```js
var sp = new jScope(this/* window or global*/,{
    /*
     * e.target 指向报错的作用域
     * e.target.name 作用域名
     */
    onerror:function(e){
        console.log(e.message);
        // throw e 如果在这里抛出异常，会直接终止执行中的语句。
    }
});

// 开启一级新的作用域，给予一个名字，可空
sp.push("test")

sp.set("b", 2);// 因为没有提前声明b变量，所以b被定义到全局作用域中
// 定义局部变量
sp.Var("a", 1);// 定义并初始化a变量
sp.set("a", 3);// 赋值a变量

console.log(sp.get("a") + sp.get("b"))// 5： 取得局部a变量与全局b变量，执行valueOf

// 开启块作用域
sp.pushBlock("zz");
sp.Var("a", 4);
sp.Let("c", 5);
sp.Const("d", 6);

console.log(sp.get("c").valueOf()); // c
sp.Const("d", 6);
// 关闭快作用域
sp.popBlock();

//var声明的对象是没有块作用域概念的，所以Var a等同于Set a
console.log(sp.get("a").valueOf()); // 4
console.log(sp.get("c").valueOf()); // 退出了快作用域，没有声明c变量，触发onerror
// 关闭局部变量
sp.pop();
```

## JS对象的属性的相关操作

```js
var source_obj = {a:"a"}
var obj = sp.Var("obj", source_obj); // 传入一个参考对象，这个参考对象不会发生任何改变
console.log(obj === sp.get("obj")); // 都是这个obj变量的“引用”
console.log(obj.valueOf()); // 参考对象被按需浅复制(1) {a: "a"} !== source_obj

var obj_a = obj.dot("a"); // 取属性
console.log(obj_a.valueOf("")); //属性取值

obj_a.set(1)//重新赋值 等同于obj.set("a", 1)

obj2 = sp.Var("obj2", source_obj);//参考对象仅仅用于参考，而不作为真正的操作对象。所以同个参考对象所创建出来的变量时不一样的
console.log(obj2.equal(obj));// false: obj2.valueOf() === obj.valueOf() 

var obj3 = sp.Var("obj3");
console.log(obj3.like(null));// true： obj3.valueOf() /*undefined*/ == null 
```

(1). 按需浅复制： 在参考变量传入的时候，会被先浅复制一层。而当在执行深处数据操作的时候，jScope是以不改变参考对象的原则来进行操作。所以jScope会一层层地执行浅复制到指定层。因为是按层次需要，所以也不会造成死循环。
> PS:如果使用深复制，会造成性能问题，特别是初始化的时候使用global对象来进行深复制。所以按需浅复制是一个处于浅复制与深复制的折衷方案。
> 注意：因为Function对象自带着作用域对象，所以如果有属性的操作Function对象么，那么是会反应到参考对象中的。
