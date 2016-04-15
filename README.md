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
// 关闭局部变量，返回数据，否则会被清空
sp.pop(sp.get("a"));
```
>注意的是，使用Var的时候，需要使用者手动执行“变量提升”，就是将一个局部作用域里面需要用到的Var声明的对象前置声明

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

## 关于内存管理

框架会在作用域关闭的时候(`.pop(returner)`)释放内存，所以要注意的是闭包的使用。
因为全权交托给使用者操作，所以闭包内的变量也需要手动声明缓存（使用者务必需要有对JS作用域明确的了解）：

_错误的示例_
```js
var csp = sp.push();
csp.Var("a"); // 同sp.Var("a")，但是fun被pop所return后是可以执行在pop之外的，所以到时候sp.get("a")是访问不到这个对象的
var fun = sp.Var("fun",function(){
    console.log(csp.get("a")); // ! Error
});
var returner = sp.pop(fun);

//...
returner.run();// throw no defined
```
> 上面代码中要注意的问题有：sp返回了一个child-sp(csp)，而csp在一个fun函数中调用，这样会引起闭包导致csp这个作用域对象无法被回收，即便a是被释放了。但是根据需求来说，我们要的不是这个作用域对象，而是a对象

_正确写法_
```js
sp.push()
var a = sp.Var("a",1);// 将a变量的引用取出来，才能在闭包中使用
var fun = sp.Var("fun",function(){
    console.log(a.valueOf()); // 1
});
sp.pop(fun);//释放作用域对象csp

//...
returner.run();// ok
```
>这里在csp被释放后，由于a对象被fun闭包所引用，所以是不会被系统内存回收的。

## 块级作用域（插件）（时间关系暂未实现）

ES6中块级作用域有一个特性：“暂时性死区（TDZ）”。
由于jScope无法预见AST，所以是无法检测TDZ的（特别是typeof、delete关键字会引发错误，所以如果要完全模拟，就需要求使用者前置声明这个块作用域中有哪些变量将被定义）。比如下面代码：
```js
/* 源码意图
{
    a = 1;
    let a = 2
}
*/
sp.set("a",1)
sp.Let("a",2)
/* 实际效果
a = 1
{
    let a = 2
}
*/

// typeof、delete 会引发异常
typeof a
let a = 0
// 不会引发异常
typeof b
delete b
let a = 0
```

需要理解的是jScope的实现方式：块级作用域的使用就意味着在使用的时候会增加判断量，需要判断变量是否在块级作用域中，是否重复声明等等。
所以jScope做了按需加载：使用者通过第一次使用Let、Const、pushBlock、Lock的时候，或者手动在声明使用严格模式，会初始化块级作用域功能。

这里要说的是pushBlock这个接口。如果要启用TDZ，那么就要手动使用Lock接口将要使用到的块级作用域变量前置声明：
```js
// 情景0
var sp = new Scope(global,{
    strict: true
}) 
// 等效运行了：
var sp = new Scope(global); sp.pushBlock();
// 不同的是：strict会参数会导致子作用域继承这个特性

// 情景1
sp.Lock("a","b");// 有a、b两个参数将作为块级作用域的值
sp.TypeOf("a");// ReferenceError，TDZ特性引发错误
sp.Del("a");// ReferenceError，TDZ特性引发错误

// 情景2
sp.TypeOf("a");// undefined ，以为a是普通的变量
sp.Let("a", 1)

sp.destroy();// 自动销毁子集作用域以及块级作用域。等同于调用了sp.popBlock(),sp.destory()
```