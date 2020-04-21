import DataBus from './databus'
import Background from './runtime/backround'
import Monkey from './player/index';
import Music from './runtime/music'
import Pole from './npc/pole'
import Buff from './npc/buff'
import Rub from './npc/rub'
import Rain from './runtime/rain'
let databus = new DataBus();
const POLE_COUNT = 4;
export default class Main{
    constructor() {
        this.ctx = canvas.getContext('2d');
        this.init();
    }
    /**
     * 初始化函数;
     */
    init() {
        canvas.removeEventListener('touchstart', this.restartBind);
        databus.init();
        window.cancelAnimationFrame(this.timer)
        this.animate = 0;
        this.end = false;
        this.shadeIndex = 0;
        this.shadeDirect = 0;
        this.anotherSpeed = 0;
        this.background = new Background(this.ctx);
        this.music = new Music();
        this.poleCreate();
        this.monkey = new Monkey(this.ctx);
        this.music.playBg();
        this.loop();
    }
    /**
     * 渲染方法;
     */
    render() {
        //画布清除
        this.ctx.clearRect(0, 0, databus.gameinfo.innerWidth, databus.gameinfo.innerHeight);
        //背景运动
        this.background.render(this.ctx);
         //分支运动;
         databus.twigArr.filter(v => {
             return v.visible;
         }).map((value) => {
            value.drawImg(this.ctx);
        });
        //杆子运动;
        databus.poleArr.forEach((value) => {
            value.drawImg(this.ctx);
        });
        //猴子运动;
        this.monkey.drawImg(this.ctx);
        //buff运动;
        databus.buffArr.filter(v => {
            return v.visible;
        }).map((value) => {
            value.drawImg(this.ctx);
        });
        //障碍绘制;
        databus.rubArr.filter(v => {
            return v.visible;
        }).map((value) => {
            value.drawImg(this.ctx);
        });
        //雨点绘制;
        if(databus.dark) {
            databus.rainArr.filter(v => {
                return v.visible;
            }).map(value => {
                value.drawImg(this.ctx);
            });
        }
        //分数绘制;
        databus.gameinfo.write(this.ctx);
         /**
         * 背景虚化;
         */
        if(databus.shade && this.animate % 5 == 0) {
            this.ctx.fillStyle = 'black';
            if(this.shadeDirect % 4 == 0) {
                for(var h = this.shadeIndex, lenH = databus.gameinfo.innerHeight; h < lenH; h += 16) {
                        this.ctx.fillRect(0, h, databus.gameinfo.innerWidth, 8);
                }
            }else {
                for(var w = this.shadeIndex, lenW = databus.gameinfo.innerWidth; w < lenW; w += 16) {
                    this.ctx.fillRect(w, 0, 8, databus.gameinfo.innerHeight);
                }
            }
            this.shadeIndex ++;
            this.shadeDirect ++;
            this.shadeIndex %= 4;
        }
    }
    /**
     * 持续更新;
     */
    continueUpdate(speed) {
        if(speed <= 0) {
            speed = 0;
        }
        //buff位置刷新;
        databus.buffArr.map((value) => {
            value.update(speed);
        });
        //障碍物位置刷新;
        databus.rubArr.map((value) => {
            if(value.destroyed) {
                value.destroy(speed, () => {
                    databus.removeRub(value);
                });
            }else {
                value.update(speed);
            }
        });
        //雨点绘制;
        if(databus.dark) {
            databus.rainArr.map(value => {
                value.update(speed);
            });
        }
        //被销毁分支位置刷新;
        databus.twigArr.filter(v => {
            return v.destroyed;
        }).map(value => {
            value.destroy(speed, () => {
                databus.removeTwig(value);
            });
        });
        this.collide();
    }
    /** 
     * 间断更新;
     */
    interruptUpdate(speed) {
        if(speed < 0) return;
        //背景更新
        this.background.verticalUpdate(speed);
        //分支更新;
        databus.twigArr.filter(v => {
            return !v.destroyed && v.visible;
        }).map((value) => {
            value.verticalUpdate(speed);
        });
        // 杆子更新;
        databus.poleArr.map((value) => {
            value.verticalUpdate(speed);
        });
    }
    /**
     * 杆子创建;
     */
    poleCreate() {
        for(let i = 0, len = POLE_COUNT; i < len; i ++) {
            const left = i < (len / 2) ? databus.gameinfo.poleLeft : databus.gameinfo.poleRight;
            let temp = new Pole(this.ctx, left, i % 2 == 0);
            databus.poleArr.push(temp);
        }
    }
    /**
     * 障碍创建;
     */
    rubCreate() {
        if(this.animate % databus.degree.rub.time == 0) {
            let temp = databus.pool.getItem('rub', Rub);
            temp.init();
            databus.rubArr.push(temp);
        }
    }
    /**
     * 雨点创建;
     */
    rainCreate() {
        if(databus.dark && this.animate % databus.gameinfo.rainTime == 0) {
            let temp = databus.pool.getItem('rain', Rain);
            temp.init();
            databus.rainArr.push(temp);
        }
    }
    /**
     * buff创建;
     */
    buffCreate() {
        if(this.animate % databus.degree.buff.time == 0) {
            let temp = databus.pool.getItem('buff', Buff);
            temp.init();
            databus.buffArr.push(temp);
        }
    }
    /**
     * 对象创建;
     */
    createObject() {
        this.buffCreate();
        this.rubCreate();
        this.rainCreate();
    }
    /**
     * 碰撞检测;
     */
    collide() {
        //buff碰撞;
        databus.buffArr.filter((v) => {
            return v.visible && v.posY > v.height;
        }).map((value) => {
            //猴子碰撞;
            if(value.collide(this.monkey)) {
                value.getBuff(this.monkey);
                value.visible = false;
                this.music.playBuff();
            }
            // 分支碰撞;
            databus.twigArr.filter(va => {
                return va.posY > 0 
                    && 
                        !va.isGetBuff 
                    && 
                        !va.destroyed 
                    && 
                        va.posY > va.height;
            }).map((v) => {
                if(v.collide(value)) value.getBuff(v);
            });
            //障碍碰撞;
            databus.rubArr.filter(va => {
                return va.posY >= 0 
                    && 
                        !va.isGetBuff 
                    && 
                        va.visible 
                    && 
                        !va.destroyed
                    && 
                        va.posY > va.height;
            }).map((v) => {
                if(value.collide(v)) value.getBuff(v);
            });
        });
        //障碍碰撞;
        databus.rubArr.filter(va => {
            return !va.destroyed && va.posY > va.height && !va.god;
        }).map((value) => {
            //猴子碰撞;
            if(value.left == this.monkey.left && value.visible && value.collide(this.monkey)) {
                if(!this.monkey.god) {
                    this.monkey.gameOverSet();
                }else {
                    value.destroyed = true;
                    value.loop = false;
                }
            }
            //分支碰撞;
            if(!value.god) {
                databus.twigArr.filter((val) => {
                    return val.posY >= 0 && !val.destroyed && val.posY > val.height;
                }).map(va => {
                    if(!value.directChange && !value.posChange && va.collide(value)) {
                        value.directChange = true;
                        value.posCheck();
                        value.delay();
                    }
                });
            }
        });
    }   
    /**
     * 游戏重置;
     */
    restart(e) {
        e.preventDefault();
        var x = e.changedTouches[0].clientX,
            y = e.changedTouches[0].clientY;
        if(x > databus.gameinfo.btnArea.startX 
            && 
            y > databus.gameinfo.btnArea.startY 
            && 
            x < databus.gameinfo.btnArea.endX 
            && 
            y < databus.gameinfo.btnArea.endY) {
            this.init();
        }
        this.music.pauseEnd();
    }
    /**
     * 定时器;
     */
    loop() { 
        if(databus.gameOver) {
            if(!this.end) {
                this.end = true;
                databus.shade = false;  //防止出现游戏结束时的虚化样式;
            }else {
                databus.gameinfo.gameOverDraw(this.ctx);
                this.restartBind = this.restart.bind(this);
                canvas.addEventListener('touchstart', this.restartBind);
                this.music.pauseBg();
                return;
            }
        }
        if(!this.monkey.start) {
            if(databus.disabled) {
                if(this.monkey.posY <= databus.gameinfo.innerHeight / 5 * 4) {
                    this.continueUpdate(5);
                    this.interruptUpdate(5);
                    this.monkey.posY += 5;
                }else {
                    databus.disabled = false;
                }
            }else {
                this.animate ++;
                this.createObject();
                this.background.filterChange(this.animate);
                this.continueUpdate(- this.monkey.speedY);
                if(databus.isUpdate) {
                    this.interruptUpdate(- this.monkey.speedY);
                    this.monkey.startMove();
                }
            }
        }
        this.render();
        this.timer = window.requestAnimationFrame(() => {
            this.loop();
        });
    }
}