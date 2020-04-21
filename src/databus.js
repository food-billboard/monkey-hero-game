import Pool from './base/pool'
import Degree from './runtime/degree'
import GameInfo from './runtime/gameinfo'
var instance;
export default class DataBus{
    constructor() {
        if(instance) {
            return instance;
        }
        instance = this;
        this.pool = new Pool();
        this.gameinfo = new GameInfo();
        this.degree = new Degree();
        this.init();
    }
    init() {
        this.pool.init();
        this.gameinfo.init();
        this.degree.init();
        this.twigArr = [];
        this.poleArr = [];
        this.buffArr = [];
        this.rubArr = [];
        this.rainArr = [];
        this.animate = [];
        //是否处于更新视图状态;
        this.isUpdate = false; 
        //是否第一次加载;
        this.gameOver = false;
        this.isShde = false;
        this.shade = false;
        this.dark = false;
        this.disabled = false;
    }
    /**
     * 分支回收;
     */
    removeTwig(twig) {
        const index = this.twigArr.indexOf(twig);
        let temp = this.twigArr.splice(index, 1);
        temp.visible = false;
        this.pool.recover('twig', twig);
    }
    /**
     * 杆子回收;
     */
    removePole(pole) {
        const index = this.poleArr.indexOf(pole);
        let temp = this.poleArr.splice(index, 1);
        temp.visible = false;
        this.pool.recover('pole', pole);
    }
    /**
     * buff回收;
     */
    removeBuff(buff) {
        const index = this.buffArr.indexOf(buff);
        let temp = this.buffArr.splice(index, 1);
        temp.visible = false;
        this.pool.recover('buff', buff);
    }
    /**
     * 障碍回收;
     */
    removeRub(rub) {
        const index = this.rubArr.indexOf(rub);
        let temp = this.rubArr.splice(index, 1);
        temp.visible = false;
        this.pool.recover('rub', rub);
    }
    /**
     * 雨点回收;
     */
    removeRain(rain) {
        const index = this.rainArr.indexOf(rain);
        let temp = this.rainArr.splice(index, 1);
        temp.visible = false;
        this.pool.recover('rain', rain);
    }
}