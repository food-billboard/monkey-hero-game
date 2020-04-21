let instance;
export default class Music{
    constructor() {
        if(instance) {
            return instance;
        }
        instance = this;
        this.init();
    }
    init() {
        this.bg = new Audio();
        this.bg.src = 'audio/bg.mp3';
        this.bg.loop = true;
        this.jump = new Audio();
        this.jump.src = 'audio/jump.mp3';
        this.end = new Audio();
        this.end.src = 'audio/gameover.mp3';
        this.buff = new Audio();
        this.buff.src = 'audio/buff.mp3';
    }
    playBg() {
        this.bg.play();
    }
    playJump() {
        this.jump.currentTime = 0;
        this.jump.play();
    }
    playEnd() {
        this.end.currentTime = 0;
        this.end.play();
    }
    playBuff() {
        this.buff.currentTime = 0;
        this.buff.play();
    }
    pauseBg() {
        this.bg.pause();
        this.currentTime = 0;
    }
    pauseJump() {
        this.jump.currentTime = 0;
        this.jump.pause();
    }
    pauseEnd() {
        this.end.currentTime = 0;
        this.end.pause();
    }
    pauseBuff() {
        this.buff.currentTime = 0;
        this.buff.pause();
    }
}