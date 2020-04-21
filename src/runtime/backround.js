import Sprite from '../base/sprite';
import DataBus from '../databus';
const _SRC = 'images/background/background.jpg';
const databus = new DataBus();
export default class Background extends Sprite{
    constructor(ctx) {
        super(databus.gameinfo.innerWidth, databus.gameinfo.innerHeight, _SRC, 0, 0);
        this.name = 'background'
        this.interval = 1000 / 60;
        this.init();
        this.render(ctx);
    }
    init() {
        this.filter = 0.5;
        this.maxFilter = 0.7;
        this.minFilter = 0.5;
        this.timer = null;
    }
    render(ctx) {
        ctx.drawImage(this.img, this.posX, this.posY, databus.gameinfo.innerWidth, databus.gameinfo.innerHeight);
        ctx.drawImage(this.img, this.posX, this.posY - databus.gameinfo.innerHeight, databus.gameinfo.innerWidth, databus.gameinfo.innerHeight);
        ctx.fillStyle = 'rgba(0, 0, 0,' +  this.filter + ')';
        ctx.fillRect(0, 0, databus.gameinfo.innerWidth, databus.gameinfo.innerHeight);
    }
    /**
     * 遮罩透明度改变;
     */
    filterChange(time) {
        if(time % 3000 == 0) {
            this.timer = setInterval(() => {
                if(databus.dark && this.filter > this.minFilter) {
                    this.filter -= 0.001;
                }else if(!databus.dark && this.filter < this.maxFilter) {
                    this.filter += 0.001;
                }else {
                    clearInterval(this.timer);
                    this.timer = null;
                    databus.dark = !databus.dark;
                }
            }, this.interval);
        }
    }
    /**
     * 纵向更新;
     */
    verticalUpdate(speed) {
        if(this.posY > databus.gameinfo.innerHeight) {
            this.posY = 0;
        }
        this.posY += speed;
    }
}   