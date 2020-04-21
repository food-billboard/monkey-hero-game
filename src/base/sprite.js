import DataBus from '../databus'
import Vector2 from '../libs/OBB/vector2';
import OBB from '../libs/OBB/obb'
const databus = new DataBus();
export default class Sprite {
    constructor(width, height, src = '', x = 0, y = 0) {
        this.img = new Image();
        this.img.src = src;
        this.width = width;
        this.height = height;
        this.posX = x;
        this.posY = y;
        this.visible = true;
        this.destroyed = false;
        this.buffList = {
            big: false,     //变大;
            small: false,   //变小;
            fat: false,     //变粗
            thin: false,    //变细;
            long: false,    //变长;
            short: false,   //变短;
            god: false,     //无敌;
            shade: false    //背景虚化;
        }
        this.isAnimate = false;
    }
    /**
     * 相关信息初始化;
     */
    initDetail() {
        if(!this.vector) {
            this.vector = new Vector2(this.posX + this.width / 2, this.posY + this.height / 2);
        }else {
            this.vector.setX(this.posX + this.width / 2);
            this.vector.setY(this.posY + this.height / 2);
        }
        if(!this.obb) {
            this.obb = new OBB(this.vector, this.width, this.height, 0);
        }else {
            var deg = this.deg ? this.deg : 0;
            this.obb.setCenter(this.vector);
            this.obb.setExtends(this.width, this.height);
            this.obb.setPos(Math.PI / 180 * deg);
            this.obb.setAxes(this.obb.vectorX, this.obb.vectorY);
        }
    }
    /**
     * 常规位置刷新
     */
    normalResetPos() {
        this.vector.setX(this.posX + this.width / 2);
        this.vector.setY(this.posY + this.height / 2);
        this.obb.setCenter(this.vector);
    }
    /**
     * 绘制; 
     */
    drawImg(ctx) {
        ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
    }
    /**
     * 碰撞检测;
     */
    collide(obj) {
        return this.posX <= obj.posX + obj.width 
               &&
               this.posX + this.width >= obj.posX 
               &&
               this.posY <= obj.posY + obj.height
               &&
               this.posY + this.height >= obj.posY;
    }
    /**
     * 获取高度
     */
    getHeight(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    /**
     * 元素被破坏;
     */
    destroy(speed, removeBack) {
        if(this.posY >= databus.gameinfo.innerHeight) {
            removeBack();
        }else {
            if(Math.abs(this.destroySpeedX) >= 0.3) {
                this.destroySpeedX *= 0.95;
            }
            this.destroySpeedY *= 1.05;
            this.posX += this.destroySpeedX;
            this.posY += (this.destroySpeedY + speed);
        }
    }
    /**
     * 元素破坏初始化;
     */
    destroyInit() {
        this.destroyed = false;
        this.destroySpeedX = Math.floor(Math.random() * 17 - 8);
        this.destroySpeedY = Math.ceil(Math.random() * 3 + 3);
    }
}