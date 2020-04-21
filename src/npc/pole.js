import Sprite from '../base/sprite'
import DataBus from '../databus'
import Twig from './twig'
const WIDTH = 15;
const databus = new DataBus();
/**
 * 初始化类型;
 */
const getType = () => {
    var url = 'images/pole/',
        random = Math.floor(Math.random() * 2);
    switch(random) {
        case 0: url += 'pole1.png'; break;
        case 1: url += 'pole2.png'; break;
    }
    return url;
}
export default class Pole extends Sprite{
    constructor(ctx, left, isShow) {
        super(WIDTH);
        this.img.src = getType();
        this.ctx = ctx;
        this.posX = left;
        this.isShow = isShow;
        this.init();
        this.drawImg();
    }
    /**
     * 初始化;
     */
    init() {
        this.twigArr = [];
        this.height = this.getHeight(databus.gameinfo.innerHeight - 100, databus.gameinfo.innerHeight - 200);
        this.posY = this.isShow ? databus.gameinfo.innerHeight - this.height : - this.height;
        var maxCount = Math.floor((this.height - databus.degree.twig.maxHeight) / databus.degree.twig.maxHeight * 2); 
        //分支可选位置初始化;
        for(let j = 0, length = maxCount * 2; j < length; j ++) {
            this.twigArr[j] = {
                posX: j < maxCount ? this.posX : this.posX + this.width / 2,
                posY: this.posY + ((j < maxCount ? j : j - maxCount) + 1) * databus.degree.twig.maxHeight / 2,
                isSet: 0
            };
        }
        //分支位置初始化;
        for(let i = 0, len = (Math.ceil(Math.random() * (maxCount - 4) + 5)) > databus.degree.twig.number ? databus.degree.twig.number :  (Math.ceil(Math.random() * (maxCount - 4) + 5)); i < len; i ++) {
            var twig = databus.pool.getItem('twig', Twig, this.ctx),
                random = Math.floor(Math.random() * this.twigArr.length);
            twig.init();
            while(this.twigArr[random].isSet == 1) {
                random = Math.floor(Math.random() * this.twigArr.length);
            }
            this.twigArr[random].isSet = 1;
            twig.initDetail(this.twigArr[random].posX, this.twigArr[random].posY);
            databus.twigArr.push(twig);
        }
    }
    /**
     * 绘制;
     */
    drawImg(){
        this.ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
    }
    /**
     * 纵向视图更新;
     */
    verticalUpdate(speed) {
        this.posY += speed;
        if(this.posY >= 0 && this.posY < databus.gameinfo.innerHeight) {
            this.isShow = true;
        }else if(this.posY >= databus.gameinfo.innerHeight) {
            this.isShow = false;
            this.init();
        }
    }
}