import Vector2 from './vector2'
export default class OBB {
    /*
        centerPoint: 中心点
        width: 宽度
        height: 高度
        rotation: 旋转角度
    */
    constructor(centerPoint, width, height, rotation) {
        this.setCenter(centerPoint);
        this.setExtends(width, height);
        this.vectorX = new Vector2(Math.cos(rotation), Math.sin(rotation));
        this.vectorY = new Vector2(-1 * Math.sin(rotation), Math.cos(rotation));
        this.setAxes(this.vectorX, this.vectorY);
        this._rotation = rotation;
    }
    setAxes(x, y) {
        this.axes = [x, y];
    }
    setCenter(centerPoint) {
        this.centerPoint = centerPoint;
    }
    setExtends(width, height) {
        this._width = width;
        this._height = height;
        this.extents = [width / 2, height / 2];
    }
    setPos(rotation) {
       this.vectorX.setX(Math.cos(rotation));
       this.vectorX.setY(Math.sin(rotation));
       this.vectorY.setX(-1 * Math.sin(rotation));
       this.vectorY.setY(Math.cos(rotation)); 
    }
    getProjectionRadius(axis) {
        return this.extents[0] * Math.abs(axis.dot(this.axes[0])) + this.extents[1] * Math.abs(axis.dot(this.axes[1]));
    }
}