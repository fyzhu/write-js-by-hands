// 状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        // 捕获执行器的代码错误
        try{
            // executor执行器，进入会立即执行
            executor(this.resolve, this.reject)
        } catch(err) {
            this.reject(err);
        }
    }
    // 初始状态
    state = PENDING;
    // 存储异步回调
    fulfilledCallBacks = [];
    rejectedCallBacks = [];

    // 成功之后的值
    value = null;
    // 失败的原因
    reason = null;

    // 成功回调
    resolve = (value) => {
        if(this.state === PENDING) {
            this.state = FULFILLED;
            this.value = value;
            // 是否有回调可执行
            while(this.fulfilledCallBacks.length) this.fulfilledCallBacks.shift()();
        }
    }
    // 拒绝回调
    reject = (reason) => {
        if(this.state === PENDING) {
            this.state = REJECTED;
            this.reason = reason;
            while(this.rejectedCallBacks.length) this.rejectedCallBacks.shift()(); 
        }
    }
    then(onFulfilled, onRejected) {
        // 如果不传，就使用默认函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

        const promise2 = new MyPromise((resolve, reject) => {
            // 成功
            const resolveMicrotask = () => {
                queueMicrotask(() => {
                    // then执行阶段错误捕获
                    try{
                        const x = onFulfilled(this.value);
                        this.resolvePromise(x, promise2, resolve, reject);
                    }catch(err) {
                        reject(err);
                    }
                })
            }
            // 失败
            const rejectMicrotask = () => {
                queueMicrotask(() => {
                    try{
                        const x = onRejected(this.reason);
                        this.resolvePromise(x, promise2, resolve, reject);
                    }catch(err) {
                        reject(err);
                    }
                })
            }

            if(this.state === FULFILLED) resolveMicrotask();
            else if(this.state === REJECTED) rejectMicrotask();
            else if(this.state === PENDING) {
                // 存储回调
                this.fulfilledCallBacks.push(resolveMicrotask);
                this.rejectedCallBacks.push(rejectMicrotask);
            }
        })
        return promise2;
    }
    resolvePromise(x, promise, resolve, reject) {
        if(x === promise) {
            return reject(new TypeError('The promise and the return value are the same'));
        }
        if(typeof x === 'object' || typeof x === 'function') {
            if(x === null) {
                return resolve(x);
            }
            let then;
            try{
                then = x.then;
            }catch(err) {
                return reject(err);
            }

            if(typeof then === 'function') {
                let called = false;
                try{
                    then.call(x, y => {
                        if(called) return;
                        called = true;
                        this.resolvePromise(y, promise, resolve, reject);
                    }, r => {
                        if(called) return;
                        called = true;
                        reject(r);
                    })
                }catch(err) {
                    if(called) return;
                    reject(err);
                }
            }else{
                resolve(x);
            }
        }
        else {
            resolve(x);
        }
    }
    // 静态resolve方法
    static resolve = (value) => {
        if(value instanceof MyPromise) {
            return value;
        }
        // 常规resolve处理
        return new MyPromise((resolve, reject) => {
            resolve(value);
        })
    }
    // 静态reject方法
    static reject = (reason) => {
        return new MyPromise((resolve, reject) => {
            reject(reason);
        })
    }
}
MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}
module.exports = MyPromise;

// 作者：前端superman
// 链接：https://juejin.cn/post/7069783225635176455
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。