// 作者：若川
// 链接：https://zhuanlan.zhihu.com/p/50719681
// 来源：知乎
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

// 去除了注释
function newOperator(ctor){
    if(typeof ctor !== 'function'){
      throw 'newOperator function the first param must be a function';
    }
    newOperator.target = ctor;
    var newObj = Object.create(ctor.prototype);
    var argsArr = [].slice.call(arguments, 1);
    var ctorReturnResult = ctor.apply(newObj, argsArr);
    var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
    var isFunction = typeof ctorReturnResult === 'function';
    if(isObject || isFunction){
        return ctorReturnResult;
    }
    return newObj;
}

function Person(name, age) {
  this.name = name
  this.age = age
  this.speak = () => {
    console.log(this.name + ' is speaking');
  }
}

const  p1 = newOperator(Person, 'zyf', '31')
p1.speak()
const p2 = new Person('test', 18)
p2.speak()