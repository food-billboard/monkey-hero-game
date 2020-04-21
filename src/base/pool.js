const __ = {
    dic: Symbol('pool')
}
export default class Pool{
    constructor() {
        this.init();
    }
    init() {
        this[__.dic] = {}  
    }
    getPool(name) {
        return (this[__.dic][name] || (this[__.dic][name] = []));
    }
    getItem(name, className, ...arg) {
        let pool = this.getPool(name);
        let result = pool.length ? pool.shift() : new className(...arg);
        result.name = name;
        return result;
    }
    recover(name, className) {
        this.getPool(name).push(className);
    }
}