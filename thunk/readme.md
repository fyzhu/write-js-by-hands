# Thunk 函数

[Thunk 函数](https://es6.ruanyifeng.com/#docs/generator-async#Thunk-%E5%87%BD%E6%95%B0)是自动执行 Generator 函数的一种方法。

```js
function f(m) {
  return m * 2;
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}
```
它是“传名调用”的一种实现策略，用来替换某个表达式。

# 作用
Thunk 函数可以用于Generator 函数的流程管理