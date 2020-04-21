export default class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    setX(x) {
        this.x = x;
    }   
    setY(y) {
        this.y = y;
    }
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
}