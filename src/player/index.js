import Animation from '../base/animation'
import DataBus from '../databus';
import Music from '../runtime/music'
import OBB from '../libs/OBB/obb'
import Vector2 from '../libs/OBB/vector2'
const ROYAL_WIDTH = 12;
const ROYAL_HEIGHT = 8;
const __ = {
    size: Symbol('size')
}
const databus = new DataBus();
const music = new Music();
export default class Monkey extends Animation{
    constructor(){   
        super();
        this.name = 'monkey';
        this.initPicList();
        this.init();
    }
    init() {
        this.rate = 1;
        this.changeList(this.list.start);
        this.type = 'START';
        this.setSize('START');
        this.areaY = 0;
        this.moveCount = 3;
        this.prevLeft = 0;
        this.prevTop = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.iSpeedX = 0;    
        this.iSpeedY = 0;     
        this.lastX = 0;    
        this.lastY = 0; 
        this.straight = false;  
        this.horizontal = false;
        this.buffStatus = false; 
        this.time = 0;
        this.start = true;
        this.isTouchend = true; 
        this.completeMove = true;
        this.god = true;
        this.left = false;
        this.correct = false;
        this.animateData = {
            delayDownTime: 15,
            delayArea: 0,
            delayUpTime:45,
            delayNormalNowTime: 25,
            delayNormalTime:[25, 5],
            normalTime: 1,
            normalChange: 1000,    
            normalMotion: false,
            normalLoop: 3
        }
        this.initPos();
        this.initTouch();
        this.buffList = {
            big: true,
            small: true,
            fat: false,
            thin: false,
            long: false,
            short: false,
            god: true,
        }
        this.vector = new Vector2(this.posX + this.width / 2, this.posY + this.height / 2);
        this.obb = new OBB(this.vector, this.width, this.height, 0);
    }
    /**
     * 初始化主体大小;
     */
    initSize() {
        this[__.size] = {
            START: {
                WIDTH:54.6,
                HEIGHT:82.5
            },
            NORMAL:{
                WIDTH: 47.6, 
                HEIGHT:54.6
            },
            UP:{
                WIDTH: 58.5,
                HEIGHT:82.5
            },
            DOWN: {
                WIDTH: 47.6,
                HEIGHT:58.8
            },  
            BUFF: {
                WIDTH: 46.2,
                HEIGHT: 58.8
            },
            MOTION_SHEARS: {
                WIDTH: 51.8,
                HEIGHT:64.4
            },
            MOTION_SWIM: {
                WIDTH: 36.4,
                HEIGHT: 77
            },
            JUMP: {
                WIDTH: 63,
                HEIGHT:44.8
            },
            CORRECT: {
                WIDTH:54.6,
                HEIGHT:70
            }
        }
    }   
    /**
     * 运动图片列表初始化;
     */
    initPicList() {
        this.initSize();
        var url = 'images/monkey/';
        this.royal = new Image();
        this.royal.src = url + 'royal.png'
        this.list = {
            upLeft: [],
            upRight: [],
            downLeft: [],
            downRight: [],
            left2Right: [],
            right2Left:[],
            buffLeft: [],
            buffRight: [],
            normalLeft: [],
            normalRight: [],
            correct: [],
            normalLeftMotion: [[], []],
            normalRightMotion: [[], []],
            start: []
        }
        this.list.start = this.list.start.concat(this.initList(url + 'start_', 1));
        this.list.left2Right = this.list.left2Right.concat(this.initList(url + 'right_left_', 1));
        this.list.right2Left = this.list.right2Left.concat(this.initList(url + 'left_right_', 1));
        this.list.buffLeft = this.list.buffLeft.concat(this.initList(url + 'monkey_buff_left_', 1));
        this.list.buffRight = this.list.buffRight.concat(this.initList(url + 'monkey_buff_right_', 1));
        this.list.normalLeft = this.list.normalLeft.concat(this.initList(url + 'stand_left_', 1));
        this.list.normalRight = this.list.normalRight.concat(this.initList(url + 'stand_right_', 1));
        this.list.correct = this.list.correct.concat(this.initList(url + 'correct_', 1));
        this.list.downLeft = this.list.downLeft.concat(this.initList(url + 'down_right_', 6));
        this.list.downRight = this.list.downRight.concat(this.initList(url + 'down_left_', 6));
        this.list.upLeft = this.list.upLeft.concat(this.initList(url + 'up_right_', 3));
        this.list.upRight = this.list.upRight.concat(this.initList(url + 'up_left_', 3));
        this.list.normalLeftMotion[0] = this.list.normalLeftMotion[0].concat(this.initList(url + 'normal_right_1_', 2));
        this.list.normalRightMotion[0] = this.list.normalRightMotion[0].concat(this.initList(url + 'normal_left_1_', 2));
        this.list.normalLeftMotion[1] = this.list.normalLeftMotion[1].concat(this.initList(url + 'normal_right_2_', 6));
        this.list.normalRightMotion[1] = this.list.normalRightMotion[1].concat(this.initList(url + 'normal_left_2_', 6));
    }
    /**
     * 设置猴子的位置;
     */
    setPos() {
        if(this.left) {
            if(this.posX > databus.gameinfo.innerWidth / 2) {
                this.posX = databus.gameinfo.poleRight - this.width;
            }else {
                this.posX = databus.gameinfo.poleLeft - this.width;
            }
        }else {
            if(this.posX > databus.gameinfo.innerWidth / 2) {
                this.posX = databus.gameinfo.poleLeft + databus.gameinfo.poleWidth;
            }else {
                this.posX = databus.gameinfo.poleRight + databus.gameinfo.poleWidth;
            }
        }
    }
    /**
     * 设置猴子尺寸变化的比率;
     */
    setRate(rate) {
        this.rate = rate;
    }
    /**
     * 宽高设置;
     */
    setSize(type) {
        var _width = this.width - this[__.size][type]['WIDTH'] * this.rate;
        this.width = this[__.size][type]['WIDTH'] * this.rate;
        this.height = this[__.size][type]['HEIGHT'] * this.rate;
        if(this.left) this.posX += _width;
    }
    /**
     * 宽高获取;
     */
    getSize(type) {
        return {
            width: this[__.size][type]['WIDTH'],
            height: this[__.size][type]['HEIGHT']
        }
    }
    /**
     * 重置宽高;
     */
    resetSize(width, height) {
        var size = this.getSize(this.type);
        if(size.width != width || size.height != height) {
            this.setSize(this.type);   
        }
        this.setRate(1);
    }
    /**
     * 位置初始化
     */
    initPos() {
        this.posX = databus.gameinfo.innerWidth / 2 - this.width / 2;
        this.posY = databus.gameinfo.innerHeight - this.height - 50;
    }
    /**
     * 事件初始化
     */
    initTouch() {
        let that = this;
        canvas.addEventListener('touchstart', this.touchstart.bind(that));
        canvas.addEventListener('touchmove', this.touchmove.bind(that));
        canvas.addEventListener('touchend', this.touchend.bind(that));
        canvas.addEventListener('touchcancel', this.touchcancel.bind(that));
    }
    /**
     * 手指按下;
     */
    touchstart(e) {  
        if(databus.disabled) return; 
        e.preventDefault(); 
        this.prevLeft = e.changedTouches[0].clientX;
        this.prevTop = e.changedTouches[0].clientY;
        if(!this.isTouchend 
            || 
            !(
                this.prevLeft >= this.posX 
                && 
                this.prevLeft <= this.posX + this.width 
                && 
                this.prevTop >= this.posY 
                && 
                this.prevTop <= this.posY + this.height
            )
        ) return;
        this.click = true;
        this.moveCount = 5;
        this.horizontal = false;
        this.straight = false; 
        this.time = new Date().getTime();
        this.isTouchend = false;                 
    }   
    /**
     * 获取手指滑动角度;
     */
    getAngle(angx, angy) {
        return Math.atan2(angy, angx) * 180 / Math.PI;
    }
    /**
     * 获取滑动方向; 
     * 1向上 2向下 3向左 4向右 0未滑动  
     */
    getDirection(startx, starty, endx, endy) {
        var angx = endx - startx;
        var angy = endy - starty;
        var result = 0;
        var angle = this.getAngle(angx, angy);
        if (angle >= -135 && angle <= -45) {
            result = 1;
        } else if (angle > 45 && angle < 135) {
            result = 2;
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        } else if (angle >= -45 && angle <= 45) {
            result = 4;
        }
        return result;
    }  
    /**
     * 手指移动;
     */  
    touchmove(e){ 
        if(databus.disabled) return; 
        e.preventDefault();
        if(!this.completeMove) return;
        this.click = false;
        if(this.moveCount > 0) {
            this.moveCount --;
            return;
        }else if(this.moveCount == 0){
            var nowX = e.changedTouches[0].clientX,
                nowY = e.changedTouches[0].clientY;
            if(this.getDirection(this.prevLeft, this.prevTop, nowX, nowY) > 2) {
                this.horizontal = true;
            }
            this.moveCount --;
        }     
        this.iSpeedX = nowX - this.lastX;    
        this.iSpeedY= nowY - this.lastY;     
        this.lastX = nowX;    
        this.lastY = nowY;  
    }    
    /**
     * 手指抬起;
     */
    touchend(e) { 
        if(databus.disabled) return; 
        e.preventDefault();
        if(this.click || (this.isTouchend || !this.completeMove)) return; 
        if(this.start) {
            this.start = false;
        }
        databus.isUpdate = true;
        this.completeMove = false;
        this.dataCheck(e);
        music.playJump();
    }
    /**
     *  静态左右移动;
     */
    staticMove() {
        this.collide();
        databus.isUpdate = false;
        this.isTouchend = true;
        this.completeMove = true;
        this.animateData.normalTime = 1;
        this.animateData.normalMotion = false;
    }
    /**
     * 数据获取;
     */
    dataCheck(e) {
        var x = e.changedTouches[0].clientX - this.posX,
            y = e.changedTouches[0].clientY - this.posY,
            time = (new Date().getTime() - this.time) / (1000 / 60),
            left = e.changedTouches[0].clientX > this.posX,
            type,
            list = [];
            this.speedX = (x / 2) / time;
            this.speedY = (y / 2) / time;
        this.directChange = false;
        if(this.posX + this.width == databus.gameinfo.poleLeft) {    //左左;
            if(this.horizontal && this.speedX > 0) {
                this.posX = databus.gameinfo.poleLeft + databus.gameinfo.poleWidth;
                this.left = false;
                this.staticMove();
                return;
            }
            if(left) {
                this.straight = true;
                if(this.speedY > 0) {
                    list = this.list.downRight;
                    type = 'DOWN';
                }else {
                    list = this.list.upRight;
                    type = 'UP';
                }
            }else {
                list = this.list.left2Right;
                type = 'JUMP';
                this.directChange = true;
            }
        }else if(this.posX == databus.gameinfo.poleLeft + databus.gameinfo.poleWidth) {   //左右;
            if(this.horizontal && this.speedX < 0) {
                this.posX = databus.gameinfo.poleLeft - this.width;
                this.left = true;
                this.staticMove();
                return;
            }
            if(!left) {
                this.straight = true;
                if(this.speedY > 0) {
                    list = this.list.downLeft;
                    type = 'DOWN';
                }else {
                    list = this.list.upLeft;
                    type = 'UP';
                }
            }else {
                list = this.list.right2Left;
                type = 'JUMP'
                this.directChange = true;
            }
        }else if(this.posX + this.width == databus.gameinfo.poleRight) { //右左;
            if(this.horizontal && this.speedX > 0) {
                this.posX = databus.gameinfo.poleRight + databus.gameinfo.poleWidth;
                this.left = false;
                this.staticMove();
                return;
            }
            if(left) {
                this.straight = true;
                if(this.speedY > 0) {
                    list = this.list.downRight;
                    type = 'DOWN';
                }else {
                    list = this.list.upRight;
                    type = 'UP';
                }
            }else {
                list = this.list.left2Right;
                type = 'JUMP';
                this.directChange = true;
            }
        }else if(this.posX == databus.gameinfo.poleRight + databus.gameinfo.poleWidth) {  //右右;
            if(this.horizontal && this.speedX < 0) {
                this.posX = databus.gameinfo.poleRight - this.width;
                this.left = true;
                this.staticMove();
                return;
            }
            if(!left) {
                this.straight = true;
                if(this.speedY > 0) {
                    list = this.list.downLeft;
                    type = 'DOWN';
                }else {
                    list = this.list.upLeft;
                    type = 'UP';
                }
            }else {
                list = this.list.right2Left;
                type = 'JUMP';
                this.directChange = true;
            }
        }
        if(list.length) {
            this.changeList(list);
            this.type = type;
            this.setSize(type);
        }
        //速度控制;
        if(this.speedY >= 20) {
            this.speedY = 20
        }else if(this.speedY <= - 10) {
            this.speedY = -10;
        }
        if(this.speedY < 0) {
            if(this.speedX >= 8) {
                this.speedX = 8;
            }else if(this.speedX <= -8) {
                this.speedX = -8;
            }
        }else {
            if(this.speedX >= 12) {
                this.speedX = 12;
            }else if(this.speedX <= -12) {
                this.speedX = -12;
            }
        }
    }
    /**
     * 运动;
     */
    startMove() {
        if(!this.straight) {
            this.posX += this.speedX;
            this.type = 'JUMP';
        }
        this.speedX *= 0.98;
        if(this.speedY < 0) {
            if(this.posY >= databus.gameinfo.innerHeight / 2) {
                this.posY += this.speedY;
            }
        }else {
            this.posY += this.speedY;
        }
        if(this.speedY < 0) {
            if(this.speedY < - 0.3) {
                this.speedY *= 0.95;
            }else {
                if(this.straight) {
                    this._moveClear();
                }else {
                    this.speedY = - this.speedY;   
                }
            }
        }else {
            if(this.straight) {
                this.speedY *= 0.95;
                if(this.speedY < 0.03) {
                    this._moveClear();
                }
            }else {
                this.speedY += Math.sqrt(1.1);
            }
        }
        databus.gameinfo.update(databus.degree, this.speedY);
        this.collide();
    }
    /**
     * 猴子Y位置修正;
     */
    posYReset(obj) {
        this.areaY = 0;
        if(this.posY + this.height >= obj.posY + obj.height && this.posY > obj.posY) {  //上面;
            this.areaY = Math.ceil(this.posY + this.height - obj.posY - obj.height);   
        }else if(this.posY < obj.posY && this.posY + this.height >= obj.posY) {     //下面;
            this.areaY = Math.ceil(this.posY - obj.posY);
        }
    }
    /**
     * 游戏结束数据设置;
     */
    gameOverSet() {
        databus.gameOver = true;
        this.isTouchend = true;
        music.playEnd();
    }
    /**
     * 清除定时器;
     */
    _moveClear() {
        this.speedX = 0;
        this.speedY = 0;
        databus.isUpdate = false;
        if(!this.loop) {
            this.stop();
            this.index = 0;
            this.visible = true;
            this.delayArea = 0;
        }
        databus.poleArr.map(value => {
            if(value.collide(this)) {   
                this.posYReset(value);
            }
        })
        if(this.areaY != 0) {       //位置矫正;
            var num = this.areaY > 0 ? - 2 : 2;
            this.correct = true;
            var timer = setInterval(() => {
                if(Math.abs(this.areaY) >= 2) {
                    this.areaY += num;
                    this.posY += num;
                }else {
                    clearInterval(timer);
                    timer = null;
                    this.completeMove = true;
                    this.isTouchend = true;
                    this.correct = false;
                }
            });
        }else {
            this.completeMove = true;
            this.isTouchend = true;
        }
        if(this.posY <= databus.gameinfo.innerHeight / 5) {
            databus.disabled = true;
        }
    }
    /**
     * 中断手指触摸;
     */
    touchcancel(e) {
        e.preventDefault();
        this.click = true;
    }
    /**
     * 碰撞检测;
     */
    collide() {
        //分支碰撞检测;      
        databus.twigArr.filter(va => {
            return !va.destroyed;
        }).map((value) => {
            if(value.collide(this)) {
                var can = false;
                switch(value.pos) {
                    case 0: 
                        if(databus.gameinfo.poleLeft > this.posX) can = true;
                        break;
                    case 1:
                        if(databus.gameinfo.poleLeft < this.posX) can = true;
                        break;
                    case 2:
                        if(databus.gameinfo.poleRight > this.posX) can = true; 
                        break;
                    case 3:
                        if(databus.gameinfo.poleRight < this.posX) can - true;
                        break;
                    default: can = false;
                }
                if(can) {
                    if(this.god) {
                        value.destroyed = true;
                    }else {
                        this.gameOverSet();
                    }
                }
            }
        });
        //杆子碰撞检测;
        if(!this.straight) {    //非直走;
            databus.poleArr.map((value) => {
                if(value.collide(this)) {
                    if(value.posX > this.posX && this.posX + this.width <= value.posX + value.width) {
                        this.posX = value.posX - this.width;
                        this.left = true;
                    }else {
                        this.posX = value.posX + value.width;
                        this.left = false;
                    }
                    this.type = 'NORMAL';
                    this._moveClear();
                }
            });
        }else {     //直走;
            let arr = databus.poleArr.filter(value => {
                return value.collide(this);
            });
            if(arr.length == 0) {
                this.straight = false;
            }
        }
        //边界检测;
        if(this.posX < -this.width || this.posX >= databus.gameinfo.innerWidth) {
            this.gameOverSet();
        }
        if(this.posY + this.height >= databus.gameinfo.innerHeight) {
            this.gameOverSet();
        }
    }
    /**
     * 图形绘制;
     */
    drawImg(ctx) {
        if(!this.start) {
            if(databus.isUpdate && this.straight) {     //需要更新(上下跳);
                if(this.loop) {
                    this.loop = false;
                }
                if(this.animateData.normalMotion) {
                    this.animateData.normalMotion = false;
                    this.animateData.normalTime = 1;
                }
            }else {     //不需要更新;
                const imgList = this.imgList;
                let list = [],
                    type;
                if(databus.isUpdate) {     //左右跳;
                    if(this.left) {
                        list = this.list.left2Right;
                    }else {
                        list = this.list.right2Left;
                    }
                    type = 'JUMP';
                    this.animateData.normalTime = 1;
                }else if(this.animateData.normalTime == 0) {        //静止动画;
                    if(!this.animateData.normalMotion) {
                        var length = this.list.normalLeftMotion.length,
                            ran = Math.floor(Math.random() * length);
                        this.animateData.delayNormalNowTime = this.animateData.delayNormalTime[ran];
                        if(this.left) {
                            list = this.list.normalLeftMotion[ran];
                        }else {
                            list = this.list.normalRightMotion[ran];
                        }
                        type = ran == 0 ? 'MOTION_SHEARS' : 'MOTION_SWIM';
                        this.animateData.normalMotion = true;
                        this.loop = true;
                        this.animateData.normalLoop = 3;
                    }
                    if(this.animateData.normalLoop < 0) {
                        this.loop = false;
                        this.animateData.normalTime = 1;
                        this.animateData.normalMotion = false;
                    }
                }else {     //静止
                    if(this.correct && imgList != this.list.correct) {
                        list = this.list.correct;
                        type = 'CORRECT';
                    }else if(!this.correct){
                        const obj = this.left ? 'Left' : 'Right';   //猴子位置判断;
                        if(this.buffStatus) {     //buff状态;   
                            list = this.list['buff' + obj]
                            type = 'BUFF';
                        }else if(!this.buffStatus){     //正常状态; 
                            list = this.list['normal' + obj]
                            type = 'NORMAL'
                        }
                        this.animateData.normalTime ++;
                        this.animateData.normalTime %= this.animateData.normalChange;
                    }
                }
                if(list.length) {
                    this.changeList(list);
                    if(!this.isChange) {
                        this.type = type;
                    }
                }
            }
            if(!this.isChange) {
                this.setSize(this.type);
            }
        }
        this.loopPlay();
        this.render(ctx);
        if(this.god) {
            ctx.drawImage(
                this.royal, 
                this.posX + this.width / 2 - ROYAL_WIDTH / 2 + (this.left ? 10 : - 10), 
                this.posY - 12,
                ROYAL_WIDTH,
                ROYAL_HEIGHT
            );
        }
    }
    /**
     * 猴子吃到buff动画;
     */
    getBuff() {
        if(!databus.isUpdate && !this.buffStatus) {
            let list = [];
            this.buffStatus = true;
            if(this.rate != 1) {
                var timer = setTimeout(() => {
                    this.buffStatus = false;
                    timer = null;
                }, 1000);
            }
            if(this.left && list != this.list.buffLeft) {
                list = this.list.buffLeft;
            }else {
                list = this.list.buffRight;
            }
            this.type = 'BUFF';
            this.changeList(list);
        }
    }
    /**
     * 重写播放方法;
     */
    loopPlay() { 
        if(!databus.isUpdate) {     //静止动画;
            if(this.animateData.delayArea % (this.animateData.delayNormalNowTime) == 0) {
                this.index ++;
            }
        }else {
            if(this.speedY < 0) {   //上移;
                if(this.animateData.delayArea % this.animateData.delayUpTime == 0) {
                    this.index ++;
                }
            }else {     //下移;
                if(this.animateData.delayArea % this.animateData.delayDownTime == 0) {
                    this.index ++;
                }
            }
        }
        if(this.index >= this.count) {
            if(!this.isUpdate) {
                this.animateData.normalLoop --;
            }
            if(!this.loop) {
                this.stop();
                this.index = 0;
            }else {
                this.index = 0;
            }   
        }
        this.animateData.delayArea ++;
    }
}