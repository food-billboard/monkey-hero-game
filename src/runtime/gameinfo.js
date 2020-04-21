const IMAGE = 'images/Common.png';
const contentWidth = window.innerWidth;
const contentHeight = window.innerHeight;
export default class GameInfo {
    constructor() {
        this.poleLeft = 60;
        this.poleRight = 290
        this.poleWidth = 15;   
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight; 
        this.rainTime = 10;
        this.img = new Image();
        this.img.src = IMAGE;
        this.btnArea = {
            startX: contentWidth / 2 - 40,
            startY: contentHeight / 2 - 100 + 180,
            endX  : contentWidth / 2  + 50,
            endY  : contentHeight / 2 - 100 + 225
          }
        this.init();
    }
    /**
     * 初始化;
     */
    init() {
        this.score = 0;
    }
    /**
     * 绘制;
     */
    write(ctx) {
        var score = this.score;
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText((score / 1000).toFixed(2), 20, 40);
    }
    /**
     * 游戏结束;
     */
    gameOverDraw(ctx) {
        ctx.drawImage(this.img, 0, 0, 119, 108, contentWidth / 2 - 150, contentHeight / 2 - 100, 300, 300)
        ctx.fillStyle = "#ffffff"
        ctx.font    = "20px Arial"
        ctx.fillText(
          '游戏结束',
          contentWidth / 2 - 40,
          contentHeight / 2 - 100 + 50
        )
        ctx.fillText(
          '跳跃: ' + (this.score / 1000).toFixed(2),
          contentWidth / 2 - 40,
          contentHeight / 2 - 100 + 130
        )
        ctx.drawImage(
          this.img,
          120, 6, 39, 24,
          contentWidth / 2 - 60,
          contentHeight / 2 - 100 + 180,
          120, 40
        )
        ctx.fillText(
          '重新开始',
          contentWidth / 2 - 40,
          contentHeight / 2 - 100 + 205
        )

    }
    /**
     * 分数更新;
     */
    update(degree, y) {
        this.score -= y;
        if(this.score < 50 && this.score %5 == 0) this.degreeChange(degree);
    }
    /**
     * 难度控制;
     */
    degreeChange(degree) {
        if(this.score < 5) {  
            return;
        }else if(this.score >= 5 && this.score < 15) {
            degree.rub = {
                maxSpeed: 0.62,
                minSpeed: 0.58,
                width: 36,
                height:36,
                time: 900
            }
            degree.twig = {
                number: 3,
                canExtend: false,
                maxHeight: 60,
                minHeight: 25
            }
            degree.buff = {
                maxSpeed: 0.73,
                minSpeed: 0.67,
                width: 39,
                height:39,
                time: 800,
                delayTime: {
                    monkey:2500,
                    rub: 3300,
                    twig: 3300,
                    background: 3300
                }
            }
        }else if(this.score >= 15 && this.score < 30) {
            degree.rub = {
                maxSpeed: 0.72,
                minSpeed: 0.68,
                width: 37,
                height:37,
                time: 800
            }
            degree.twig = {
                number: 5,
                canExtend: false,
                maxHeight: 65,
                minHeight: 27
            }
            degree.buff = {
                maxSpeed: 0.74,
                minSpeed: 0.66,
                width: 38,
                height:38,
                time: 900,
                delayTime: {
                    monkey:2300,
                    rub: 3500,
                    twig: 3500,
                    background: 3500
                }
            }
        }else if(this.score >= 30 && this.score < 40) {
            degree.rub = {
                maxSpeed: 0.82,
                minSpeed: 0.78,
                width: 38,
                height:38,
                time: 700
            }
            degree.twig = {
                number: 6,
                canExtend: true,
                maxExtend:5,
                minExtend:1,
                maxHeight: 72,
                minHeight: 28
            }
            degree.buff = {
                maxSpeed: 0.75,
                minSpeed: 0.65,
                width: 37,
                height:37,
                time: 1000,
                delayTime: {
                    monkey:2100,
                    rub: 3600,
                    twig: 3600,
                    background: 3600
                }
            }
        }else if(this.score >= 40 && this.score < 50) {
            degree.rub = {
                maxSpeed: 0.92,
                minSpeed: 0.88,
                width: 39,
                height:39,
                time: 600
            }
            degree.twig = {
                number: 7,
                canExtend: true,
                maxExtend:10,
                minExtend:1,
                maxHeight: 75,
                minHeight: 30
            }
            degree.buff = {
                maxSpeed: 0.76,
                minSpeed: 0.64,
                width: 36,
                height:36,
                time: 1500,
                delayTime: {
                    monkey:2000,
                    rub: 3800,
                    twig: 3800,
                    background: 3800
                }
            }
        }else if(this.score >= 50 && this.score < 80) {
            degree.rub = {
                maxSpeed: 1.02,
                minSpeed: 0.98,
                width: 40,
                height:40,
                time: 400
            }
            degree.twig = {
                number: 99,
                canExtend: true,
                maxExtend:20,
                minExtend: 1,
                maxHeight: 80,
                minHeight: 35
            }
            degree.buff = {
                maxSpeed: 0.78,
                minSpeed: 0.62,
                width: 35,
                height:35,
                time: 3000,
                delayTime: {
                    monkey:1900,
                    rub: 3900,
                    twig: 3900,
                    background: 3900
                }
            } 
        }else {
            degree.rub = {
                maxSpeed: 1.4,
                minSpeed: 1.2,
                width: 40,
                height:40,
                time: 200
            }
            degree.twig = {
                number: 99,
                canExtend: true,
                maxExtend: 25,
                minExtend: 1,
                maxHeight: 85,
                minHeight: 40
            }
            degree.buff = {
                maxSpeed: 0.8,
                minSpeed: 0.6,
                width: 35,
                height:35,
                time: 5000,
                delayTime: {
                    monkey:1500,
                    rub: 4500,
                    twig: 4500,
                    background: 4500
                }
            }
        }
    }
}