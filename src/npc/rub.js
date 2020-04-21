import Animation from '../base/animation'
import DataBus from '../databus'
const databus = new DataBus();
const MAX_SPEED = 1.8;
const URL = 'images/rub/';
const BUFF = URL + 'god.png';
/**
 * 障碍位置初始化;
 */
const randomPos = () => {
    var ranW = Math.floor(Math.random() * 4),
        left = ranW % 2 == 0;
    switch(ranW) {
        case 0: ranW = databus.gameinfo.poleLeft - databus.degree.rub.width;break;
        case 1: ranW = databus.gameinfo.poleLeft + databus.gameinfo.poleWidth; break;
        case 2: ranW = databus.gameinfo.poleRight - databus.degree.rub.width; break;
        case 3: ranW = databus.gameinfo.poleRight + databus.gameinfo.poleWidth; break;
    }
    return {
        x: ranW, 
        y: -databus.degree.rub.height, 
        left
    };
}
export default class Rub extends Animation{
    constructor() {
        super();
        this.img.src = BUFF;
    }
    init() {
        this.width = databus.degree.rub.width;
        this.height = databus.degree.rub.height;
        var pos = randomPos();
        this.posX = pos.x;
        this.posY = pos.y;
        this.left = pos.left;
        this.isPlaying = true;
        this.god = false;
        this.directChange = false;
        this.type = '';
        this.posChange = false;
        this.direct = 0;
        this.timer = null;
        this.moveArea = 0;
        this.speed = Math.random() * (databus.degree.rub.maxSpeed - databus.degree.rub.minSpeed + 1) + databus.degree.rub.minSpeed;
        this.isGetBuff = false;
        this.buffList = {
            big: true,
            small: true,
            fat: false,
            thin: false,
            long: false,
            short: false,
            god: true,
        }
        this.list = {
            spider: {
                normal:[],
                left:[],
                right:[]
            },
            beetle: {
                normal: [],
                left: [],
                right: [],
            },
            scorpion: {
                normal: [],
                left: [],
                right: []
            }
        }
        this.animateData = {
            spider: 1,
            beetle: 30,
            scorpion: 12,
            delayTime: 0
        }
        this.destroyInit();
        this.changeList(this.list.spider.normal);
        this.getType();
        this.initDetail();
    }
    /**
     * 蜘蛛初始化;
     */
    initSpider() {
        this.list.spider.normal = this.list.spider.normal.concat(this.initList(URL + 'rub_normal_1_', 31));
        this.list.spider.left = this.list.spider.left.concat(this.initList(URL + 'rub_left_1_', 31));
        this.list.spider.right = this.list.spider.right.concat(this.initList(URL + 'rub_right_1_', 31));
        this.changeList(this.list.spider.normal);
    }
    /**
     * 甲虫初始化;
     */
    initBeetle() {
        this.list.beetle.normal = this.list.beetle.normal.concat(this.initList(URL + 'rub_normal_2_', 4));
        this.list.beetle.left = this.list.beetle.left.concat(this.initList(URL + 'rub_left_2_', 4));
        this.list.beetle.right = this.list.beetle.right.concat(this.initList(URL + 'rub_right_2_', 4));
            this.changeList(this.list.beetle.normal);
    }
    /**
     * 蝎子初始化;
     */
    initScorpion() {
        this.list.scorpion.normal = this.list.scorpion.normal.concat(this.initList(URL + 'rub_normal_3_', 5));
        this.list.scorpion.left = this.list.scorpion.left.concat(this.initList(URL + 'rub_left_3_', 5));
        this.list.scorpion.right = this.list.scorpion.right.concat(this.initList(URL + 'rub_right_3_', 5));
        this.changeList(this.list.scorpion.normal);
    }
    /**
     * 障碍类型获取;
     */
    getType() {
        var ran = Math.floor(Math.random() * 3);
        switch(ran) {
            case 0: 
                this.type = 'spider';
                this.initSpider();
                break;
            case 1: 
                this.type = 'beetle'; 
                this.initBeetle();
                break;
            case 2: 
                this.type = 'scorpion'; 
                this.initScorpion();
                break;
            default: 
                this.type = 'spider';
                this.initSpider();
        }
    }
    /**
     * 绘制; 
     */
    drawImg(ctx) {
        if(this.isGetBuff) {
            ctx.drawImage(this.img, this.posX + this.width / 4 + (this.left ? 8 : - 8), this.posY - this.height / 4, this.width / 2, this.height / 4);
        }
        this.loopPlay();
        this.render(ctx);
    }
    /**
     * 视图更新;
     */
    update(speed) {
        if(this.directChange) {     //碰撞换向;
            if((this.posX < this.moveArea && this.direct > 0) || (this.posX > this.moveArea && this.direct < 0)) {
                this.posX += this.direct;
                this.posY += speed;
            }else {     //动画矫正;
                this.directChange = false;
                this.posX = this.moveArea;
                this.moveArea = 0;
                this.changeList(this.list[this.type].normal);
            }
        }else {
            this.posY += this.speed + speed;
        }
        if(this.posY >= databus.gameinfo.innerHeight || !this.visible) {
            databus.removeRub(this);
        }
    }
    /**
     * 加速延迟恢复;
     */
    delay() {
        this.timer = setTimeout(() => {
            this.speed = Math.random() * (databus.degree.rub.maxSpeed - databus.degree.rub.minSpeed) + databus.degree.rub.minSpeed;
            this.timer = null;
            this.posChange = false;
        }, 2000);
    }
    /**
     * 移动方向判断;
     */
    posCheck() {
        var speed = this.speed = Math.random() * (MAX_SPEED - databus.degree.rub.maxSpeed) + databus.degree.rub.maxSpeed,
            list;
        if(this.posX < databus.gameinfo.poleLeft) {      //左左;
            this.moveArea = databus.gameinfo.poleLeft + databus.gameinfo.poleWidth;
            list = this.list[this.type].right;
        }else if(this.posX > databus.gameinfo.poleLeft + this.width && this.posX < databus.gameinfo.poleRight) {  //右左;
            this.moveArea = databus.gameinfo.poleRight + databus.gameinfo.poleWidth;
            list = this.list[this.type].right;
        }else if(this.posX > databus.gameinfo.poleLeft && this.posX < databus.gameinfo.poleRight){    //左右
            speed = - speed
            this.moveArea = databus.gameinfo.poleLeft - this.width;
            list = this.list[this.type].left;
        }else {     //右右;
            speed = - speed;
            this.moveArea = databus.gameinfo.poleRight - this.width;
            list = this.list[this.type].left;
        }
        this.direct = speed;
        this.posChange = true;
        this.left = !this.left;
        this.changeList(list);
    }
    /**
     * 重写动画播放方法;
     */
    loopPlay() {
        if(this.animateData.delayTime % this.animateData[this.type] == 0) {
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
        this.animateData.delayTime ++;
    }
}