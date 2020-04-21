import Sprite from '../base/sprite'
import DataBus from '../databus'
let databus = new DataBus();
/**
 * buff类型初始化;
 */
const randomBuff = () => {
    var url = 'images/buff/';
    const typecount = 8;
    var types = Math.floor(Math.random() * typecount);
    switch(types) {
        case 0: url += 'buff1.png'; break;
        case 1: url += 'buff2.png'; break;
        case 2: url += 'buff3.png'; break; 
        case 3: url += 'buff4.png'; break;
        case 4: url += 'buff5.png'; break;
        case 5: url += 'buff6.png'; break;
        case 6: url += 'buff7.png'; break;
        case 7: url += 'buff8.png'; break;
        default: url += 'buff1.png'; break;
    }
    return [types, url];
}
/**
 * buff位置初始化;
 */
const randomPos = () => {
    var ranW = Math.floor(Math.random() * 3);
    switch(ranW) {
        case 0: ranW = Math.random() * (databus.gameinfo.poleLeft - databus.degree.buff.width); break;
        case 1: ranW = Math.random() * (databus.gameinfo.poleRight - databus.degree.buff.width - databus.gameinfo.poleLeft - databus.gameinfo.poleWidth + 1) + databus.gameinfo.poleLeft + databus.gameinfo.poleWidth; break;
        case 2: ranW = Math.random() * (databus.gameinfo.innerWidth - databus.gameinfo.poleRight - databus.degree.buff.width - databus.gameinfo.poleWidth + 1) + databus.gameinfo.poleRight + databus.gameinfo.poleWidth; break;
    }
    return [ranW, - databus.degree.buff.height];
}
export default class Buff extends Sprite{
    constructor() {
        super();
        this.changeSpeed = 0.5;
        this.buffData = {   //buff增益数据;
            big: {
                data: 1.3,
                add: false
            },
            small: {
                data: 0.8,
                add: false
            },
            long: {
                data: 10,
                add: true
            },
            short: {
                data: -10,
                add:true
            },
            fat: {
                data: 2,
                add: false
            },
            thin: {
                data: 0.5,
                add: false
            }
        }
    }
    init() {
        this.width = databus.degree.buff.width;
        this.height = databus.degree.buff.height;
        var arr = randomPos(),
            buffArr = randomBuff();
        this.posX = arr[0];
        this.posY = arr[1];
        this.img.src = buffArr[1];
        this.buffType = buffArr[0];
        this.visible = true;
        this.speed = Math.random() * (databus.degree.buff.maxSpeed - databus.degree.buff.minSpeed) + databus.degree.buff.minSpeed;
        this.initDetail();
    }
    /**
     * 绘制;
     */
    drawImg(ctx) {
        ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
    }
    /**
     * 视图更新;
     */
    update(speed) {
        this.posY += this.speed + speed;
        if(this.posY > databus.gameinfo.innerHeight  || !this.visible) {
            databus.removeBuff(this);
        }
    }
    /**
     * 获取buff效果;
     */
    getBuff(obj) {
        this.visible = false;
        if(obj.getBuff) {
            obj.getBuff();
        }
        switch(this.buffType) {
            case 0: 
                if(obj.buffList.big) this.big(obj);
                break;
            case 1: 
                if(obj.buffList.small) this.small(obj);
                break;
            case 2: 
                if(obj.buffList.fat) this.fat(obj);
                break;
            case 3: 
                if(obj.buffList.thin) this.thin(obj);
                break;
            case 4: 
                if(obj.buffList.long) this.long(obj);
                break;
            case 5: 
                if(obj.buffList.short) this.short(obj);
                break;
            case 6:  
                if(obj.buffList.god) this.god(obj);
                break;
            case 7: 
                this.shade();
                break;
        }
        obj.isGetBuff = true;
        var timer = setTimeout(() => {
            obj.isGetBuff = false;
            timer = null;
        }, databus.degree.buff.delayTime[obj.name]);
    }
    /**
     * 变大
     */
    big(obj) {
       this.commonWH('big', obj);
    }
    /**
     * 变小
     */
    small(obj) {
        this.commonWH('small', obj);
    }
    /**
     * 变粗
     */
    fat(obj) {
        this.commonW('fat', obj);
    }
    /**
     * 变细
     */
    thin(obj) {
        this.commonW('thin', obj);
    }
    /**
     * 变长
     */
    long(obj) {
        this.commonH('long', obj);
    }
    /**
     * 变短
     */
    short(obj) {
        this.commonH('short', obj);
    }
    /**
     * 无敌
     */
    god(obj) {
        if(obj.god) return;
        obj.god = true;
        var timer = setInterval(() => {
            obj.god = false;
            timer = null;
        }, databus.degree.buff.delayTime[obj.name]);
    }
    /**
     * 虚化
     */
    shade() {
        if(!this.isShade) {
            databus.isShade = true;
            databus.shade = true;
            var timer = setTimeout(() => {
                databus.isShade = false;
                databus.shade = false;
            }, databus.degree.buff.delayTime['background']);
        }
    }
    /**
     * 状态恢复;
     */
    reset(obj, type, prevWidth, prevHeight) {
        var time = setTimeout(() => {
            if(obj.setRate) {
                obj.setRate(1);
            }else {
                obj.width = prevWidth;
                obj.height = prevHeight;
            }
            obj.buffList[type] = true;
        }, databus.degree.buff.delayTime[obj.name]);
    }
    /**
     * 宽高变动;
     */
    commonWH(type, obj) {
        obj.buffList[type] = false; 
        obj.isChange = true;
        var width,
            height,
            status,
            prevWidth = obj.width,
            prevHeight = obj.height,
            _width = 0,
            _type = this.type;
        if(this.buffData[type].add) {
            width = this.buffData[type].data + obj.width;
            height = this.buffData[type].data + obj.height;
        }else {
            width = this.buffData[type].data * obj.width;
            height = this.buffData[type].data * obj.height;
        }
        status = width > obj.width;
        _width = Math.abs(width - obj.width);
        var timer = setInterval(() => {
            if(_type != this.type && obj.name == 'monkey') {    //图片列表的变动;
                clearInterval(timer);  
                obj.isChange = false;
                if(obj.setRate) obj.setRate(this.buffData[type].data);
                this.reset(obj, type, prevWidth, prevHeight);
                timer = null;
            }
            if(status && obj.width < width) {
                obj.width += this.changeSpeed;
                obj.height += this.changeSpeed * prevHeight / prevWidth;
                if(obj.left) {
                    obj.posX -= this.changeSpeed; 
                }
            }else if(!status && obj.width > width) {
                obj.width -= this.changeSpeed;
                obj.height -= this.changeSpeed * prevHeight / prevWidth;
                if(obj.left) {
                    obj.posX += this.changeSpeed;
                }
            }else {     //持续保持不动;  
                clearInterval(timer);
                if(obj.setRate) {
                    if(obj.type == 'BUFF') {
                        obj.type = 'NORMAL';
                        obj.buffStatus = false;
                        if(obj.left) {
                            obj.changeList(obj.list.normalLeft);
                        }else {
                            obj.changeList(obj.list.normalRight);
                        }
                    }
                    obj.isChange = false;
                    obj.setRate(this.buffData[type].data);
                }else {
                    obj.width = width;
                    obj.height = height;
                }
                this.reset(obj, type, prevWidth, prevHeight);
                timer = null;
            }
        }, 1000 / 60);
    }
    /**
     * 宽变动;
     */
    commonW(type, obj) {
        obj.buffList[type] = false;
        var width,
            status,
            prevWidth = obj.width;
        if(this.buffData[type].add) {
            width = this.buffData[type].data + obj.width
        }else {
            width = this.buffData[type].data * obj.width;
        }
        status = width > obj.width;
        var timer = setInterval(() => {
            if(status && obj.width < width) {
                obj.width += this.changeSpeed;
            }else if(!status && obj.width > width) {
                obj.width -= this.changeSpeed;
            }else {
                clearInterval(timer);
                var time = setTimeout(() => {
                    obj.width = prevWidth;
                    obj.buffList[type] = true;
                    time = null;
                }, databus.degree.buff.delayTime[obj.name]);
            }
        }, 1000 / 60);
    }
    /**
     * 高变动;
     */
    commonH(type, obj) {
        obj.buffList[type] = false;
        var height,
            status,
            prevHeight = obj.height;
        if(this.buffData[type].add) {
            height = this.buffData[type].data + obj.height
        }else {
            height = this.buffData[type].add * obj.height;
        }
        status = height > obj.height;
        var timer = setInterval(() => {
            if(status && obj.height < height) {
                obj.height += this.changeSpeed;
            }else if(!status && obj.height > height) {
                obj.height -= this.changeSpeed;
            }else {
                clearInterval(timer);
                var time = setTimeout(() => {
                    obj.height = prevHeight;
                    obj.buffList[type] = true;
                    time = null;
                }, databus.degree.buff.delayTime[obj.name]);
            }
        }, 1000 / 60);
    }
}