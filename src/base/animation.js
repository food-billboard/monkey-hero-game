import Sprite from './sprite' 
import DataBus from '../databus';
const __ = {
    timer: Symbol('timer')
}
const databus = new DataBus();
export default class Animation extends Sprite{
    constructor(width, height) {
        super(width, height);
        this[__.timer] = null;
        this.interval = 1000 / 60;
        this.count = 0;
        this.imgList = [];
        this.index = 0;
        this.loop = false;
        this.isPlaying = false;
    }
    /**
     * 初始化;
     */
    initList(url, len) {
        let list = [];
        for(let i = 0; i < len; i ++) {
            let img = new Image();
            img.src = url + (i + 1) + '.png';
            list.push(img);
        }
        return list;
    }
    /**
     * 绘制;
     */
    render(ctx) {
        var x = this.posX;
        if(this.left != 'undefined') {
            if(this.left) {
                x += 8;
            }else {
                x -= 8;
            }
        }
        ctx.drawImage(this.imgList[this.index], x, this.posY, this.width, this.height);
    }
    /**
     * 播放;
     */
    play(index = 0, loop = false) {
        this.index = index;
        this.loop = loop;
        if(this.interval > 0 && this.count) {
            this[__.timer] = setInterval(
                this.loopPlay.bind(this),
                this.interval
            );
        }
    }
    /**
     * 停止;
     */
    stop() {
        this.isPlaying = false;
        if(this[__.timer]) clearInterval(this[__.timer]); 
    }
    /**
     * 遍历;
     */
    loopPlay() {
        this.index ++;
        if(this.index >= this.count) {
            if(!this.loop) {
                this.stop();
                this.index = 0;
            }else {
                this.index = 0;
            }
        }
    }
    /**
     * 动画切换;
     */
    changeList(list) {
        this.imgList = [];
        this.imgList = list;
        this.index = 0;
        this.count = list.length;
    }
}