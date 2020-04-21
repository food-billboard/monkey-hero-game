var instance;
export default class Degree {
    constructor() {
        if(instance) return instance;
        instance = this;
        this.init();
    }
    init() {
        this.rub = {
            maxSpeed: 0.52,
            minSpeed: 0.48,
            width: 35,
            height:35,
            time: 1000      
        }
        this.twig = {
            number: 2,           
            canExtend: false,
            maxHeight: 52,
            minHeight: 22
        }
        this.buff = {
            maxSpeed: 0.72,
            minSpeed: 0.68,
            width: 40,
            height:40,
            time: 800,  
            delayTime: {
                monkey:3000,
                rub: 3000,
                twig: 3000,
                background: 10000
            }
        }
    }
}