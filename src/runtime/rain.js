import DataBus from '../databus';
import Sprite from '../base/sprite'
const databus = new DataBus();
const WIDTH = 3;
const HEIGHT = 15;
const COLOR = 'rgba(51,255,255, 0.5)';
export default class Rain extends Sprite{
    constructor() {
        super(WIDTH, HEIGHT);
        this.color = COLOR;
    }
    /**
     * 初始化;
     */
    init() {
        this.posY = - HEIGHT;
        this.width = WIDTH;
        this.visible = true;
        this.posX = Math.random() * (databus.gameinfo.innerWidth - WIDTH + 1) + WIDTH;
        this.maxR = Math.random() * 21 + 20;
    }
    /**
     * 绘制;
     */
    drawImg(ctx) {
        ctx.beginPath();
        if(this.width == WIDTH) {
            ctx.fillStyle = this.color;
            ctx.rect(this.posX, this.posY, this.width, this.height);
            ctx.fill();
        }else {
            ctx.strokeStyle = this.color;
            ctx.arc(this.posX, this.posY, this.width, 0, Math.PI * 2, false);
            ctx.stroke();
        }
    }
    /**
     * 位置更新;
     */
    update(speed) {
        if(this.posY <= databus.gameinfo.innerHeight - 20) {
            this.posY += (speed + 10);
        }else {
            if(this.width >= this.maxR) {
                this.visible = false;
                databus.removeRain(this);
            }else {
                this.width += 0.8;
            }
        }
    }
}