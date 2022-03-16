# deep clone
## stringify 版本
```js
let obj1 = { a:1, b:[1,2,3] }

let str = JSON.stringify(obj1)；

let obj2 = JSON.parse(str)；

console.log(obj2);   //{a:1,b:[1,2,3]} 

obj1.a = 2；

obj1.b.push(4);

console.log(obj1);   //{a:2,b:[1,2,3,4]}

console.log(obj2);   //{a:1,b:[1,2,3]}

```
1. 拷贝的对象的值中如果有函数、undefined、symbol 这几种类型，经过 JSON.stringify 序列化之后的字符串中这个键值对会消失；

2. 拷贝 Date 引用类型会变成字符串；

3. 无法拷贝不可枚举的属性；

4. 无法拷贝对象的原型链；

5. 拷贝 RegExp 引用类型会变成空对象；

6. 对象中含有 NaN、Infinity 以及 -Infinity，JSON 序列化的结果会变成 null；

7. 无法拷贝对象的循环应用，即对象成环 (obj[key] = obj)。


## 递归版本
```js
let obj1 = {
  a:{
    b:1
  }
}

function deepClone(obj) { 
  let cloneObj = {}
  for(let key in obj) {                 //遍历
    if(typeof obj[key] ==='object') { 
      cloneObj[key] = deepClone(obj[key])  //是对象就再次调用该函数递归
    } else {
      cloneObj[key] = obj[key]  //基本类型的话直接复制值
    }
  }
  return cloneObj
}

let obj2 = deepClone(obj1);
obj1.a.b = 2;
console.log(obj2);   //  {a:{b:1}}

```
## 完善版本
```js
const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)

const deepClone = function (obj, hash = new WeakMap()) {
  if (obj.constructor === Date) 
  return new Date(obj)       // 日期对象直接返回一个新的日期对象

  if (obj.constructor === RegExp)
  return new RegExp(obj)     //正则对象直接返回一个新的正则对象

  //如果循环引用了就用 weakMap 来解决

  if (hash.has(obj)) return hash.get(obj)

  let allDesc = Object.getOwnPropertyDescriptors(obj)

  //遍历传入参数所有键的特性

  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)

  //继承原型链

  hash.set(obj, cloneObj)

  for (let key of Reflect.ownKeys(obj)) { 
    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]
  }

  return cloneObj
}

// 下面是验证代码

let obj = {
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: { name: '我是一个对象', id: 1 },
  arr: [0, 1, 2],
  func: function () { console.log('我是一个函数') },
  date: new Date(0),
  reg: new RegExp('/我是一个正则/ig'),
  [Symbol('1')]: 1,
};

Object.defineProperty(obj, 'innumerable', {
  enumerable: false, value: '不可枚举属性' }
);

obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
obj.loop = obj    // 设置loop成循环引用的属性
let cloneObj = deepClone(obj)
cloneObj.arr.push(4)
console.log('obj', obj)
console.log('cloneObj', cloneObj)

```