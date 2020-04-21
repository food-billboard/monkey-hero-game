//旋转角度max120 最大高度82 最小高度22
import DataBus from '../databus'
import Animate from '../base/animation'
import OBB from '../libs/OBB/obb'
import Vector2 from '../libs/OBB/vector2'
import CollisionDetector from '../libs/OBB/collisionDetector'
var databus = new DataBus();
const MAX_DEG = 140;
const MIN_DEG = 120;
const BUFF = 'images/twig/god.png';
export default class Twig extends Animate{
    constructor() {
        super();
        this.img.src = BUFF;
        this.collideCheck = new CollisionDetector().detectorOBBvsOBB.bind(this);
        this.delayArea = 10;
    }
    /**
     * 初始化;
     */
    init() {
        this.height = this.getHeight(databus.degree.twig.maxHeight, databus.degree.twig.minHeight);
        this.getType();
        this.isGetBuff = false;
        this.buffList = {
            big: false,
            small: false,
            fat: true,
            thin: true,
            long: true,
            short: true,
            god: false,
        }
        this.direct = 1;
        this.delayTime = 0;
        this.destroyInit();
        this.extendChange();
    }
    /**
     * 重写相关信息初始化;
     */
    initDetail(x, y) {
        var area = 0,
            pos = x;
        this.posX = x;
        this.posY = y;
        this.getIndex();
        if(!this.vector) {
            this.vector = new Vector2(this.posX + this.width / 2, this.posY + this.height / 2);
        }else {
            this.vector.setX(this.posX + this.width / 2);
            this.vector.setY(this.posY + this.height / 2);
        }
        if(!this.obb) {
            this.obb = new OBB(this.vector, this.width, this.height, this.deg * Math.PI / 180);
        }else {
            this.obb.setCenter(this.vector);
            this.obb.setExtends(this.width, this.height);
            this.obb.setPos(this.deg * Math.PI / 180);
            this.obb.setAxes(this.obb.vectorX, this.obb.vectorY);
        }
    }
    /**
     * 长度延展;
     */
    extendChange() {
        this.extend = databus.degree.twig.canExtend ? (Math.random() * (databus.degree.twig.maxExtend - databus.degree.twig.minExtend + 1) + databus.degree.twig.minExtend): 0;
        if(this.extend > 0) {
            this.nowExtend = 0;
            this.isExtend = true;
        }
    }
    /**
     * 初始化分支类型;
     */
    getType() {
        const random = Math.floor(Math.random() * 6),
              url = `images/twig/`;
        let list,
            width;
        switch(random) {
            case 0: 
                list = this.initList(url + 'twig1_', 1);
                width = 10;
                break;
            case 1: 
                list = this.initList(url + 'twig2_', 1);
                width = 10;
                break;
            case 2: 
                list = this.initList(url + 'twig3_', 9);
                width = 12;
                break;
            case 3: 
                list = this.initList(url + 'twig4_', 9);
                width = 15;
                break;
            case 4: 
                list = this.initList(url + 'twig5_', 9);
                width = 15;
                break;
            default: 
                list = this.initList(url + 'twig5_', 9);
                width = 15;
                break;
        }
        this.changeList(list);
        this.width = width;
    }
    /**
     * 获取分支所在的位置;
     */
    getIndex() {
        var index = 0;
        if(this.posX >= databus.gameinfo.poleLeft && this.posX < databus.gameinfo.poleLeft + databus.gameinfo.poleWidth / 2) {
            index = 0;
        }else if(this.posX >= databus.gameinfo.poleLeft + databus.gameinfo.poleWidth / 2 && this.posX <= databus.gameinfo.innerWidth / 2) {    
            index = 1;
        }else if(this.posX >= databus.gameinfo.innerWidth / 2 && this.posX < databus.gameinfo.poleRight + databus.gameinfo.poleWidth / 2) {
            index = 2;
        }else {
            index = 3;
        }
        this.pos = index;
        this.deg = this.getDeg();
    }
    /**
     * 角度获取;
     */
    getDeg() {
        return this.pos % 2 == 0 ? (Math.random() * (MAX_DEG - MIN_DEG + 1) + MIN_DEG) : (Math.random() * (- MIN_DEG + MAX_DEG + 1) - MAX_DEG);
    }
    /**
     * 位置刷新
     */
    resetPos() {
        this.vector.setY(this.posY + this.height / 2);
        this.obb.setCenter(this.vector);
    }
    /**
     * 重写常规位置刷新;
     */
    normalResetPos() {
        this.vector.setY(this.posY + this.height / 2);
        this.obb.setCenter(this.vector);
    }
    /**
     * 碰撞检测
     */
    collide(obj) {
        obj.normalResetPos();
        this.normalResetPos();
        return this.collideCheck(obj.obb, this.obb);
    }
    /**
     * 绘制
     */
    drawImg(ctx) {
        var posX = this.posX,
            posY = this.posY,
            _x = Math.cos(Math.PI / 180 * (Math.abs(this.deg) - 90)) * this.height / 2,
            area = this.pos % 2 == 0 ? 1 : - 1;
        if(this.isGetBuff) {
            ctx.drawImage(
                this.img, 
                (posX + this.width / 2 - area) - area * Math.sin(Math.PI / 180 * (Math.abs(this.deg) - 90)) * this.height / 2, 
                (posY + this.height / 2) - Math.cos(Math.PI / 180 * (Math.abs(this.deg) - 90)) * this.height / 2, 
                10, 
                5
            );
        }
        ctx.translate(posX + this.width / 2 - _x * area, posY + this.height / 2);
        ctx.rotate(Math.PI / 180 * this.deg);
        this.loopPlay();
        this.render(ctx);
        ctx.rotate(- Math.PI / 180 * this.deg);
        ctx.translate( - posX - this.width / 2 + _x * area, - posY - this.height / 2);
        if(this.extend > 0 && !this.destroyed && this.change) {
            if(this.isExtend) {
                this.nowExtend += 2;
                this.height += 2;
                if(this.nowExtend >= this.extend) {
                    this.isExtend = false;
                }
            }else {
                this.nowExtend -= 2;
                this.height -= 2;
                if(this.nowExtend <= 0) {
                    this.isExtend = true;
                }
            }
        }
    }
    /**
     * 重写动画方法;
     */
    loopPlay() {
        if(this.delayTime % this.delayArea == 0 && databus.degree.twig.canExtend) {
            this.change = true;
            this.index += this.direct;
            if((this.index >= this.count && this.direct > 0) || (this.index <= 0 && this.direct < 0)) {
                if(!this.loop) {
                    this.stop();
                }
                this.index -= this.direct;
                this.direct = - this.direct;
            }
        }else {
            this.change = false;
        }
        this.delayTime ++;
    }
    /**
     * 重写绘制方法
     */
    render(ctx) {
        ctx.drawImage(this.imgList[this.index], - this.width / 2, - this.height / 2, this.width, this.height);
    }
    /**
     * 纵向位置更新
     */
    verticalUpdate(speed) {
        this.posY += speed;
        if(this.posY >= databus.gameinfo.innerHeight) {
            databus.removeTwig(this);
        }
    }
    /**
     * 横向更新;
     */
    horizontalUpdate(speed) {
        this.posX += speed;
        if(this.posX <= 0 || this.posX >= databus.gameinfo.innerWidth) {
            databus.removeTwig(this);
        }
    }
}





