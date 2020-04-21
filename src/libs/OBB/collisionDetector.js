export default class CollisionDetector{
    detectorOBBvsOBB(OBB1, OBB2) {
        var nv = OBB1.centerPoint.sub(OBB2.centerPoint);
        var axisA1 = OBB1.axes[0];
        if (OBB1.getProjectionRadius(axisA1) + OBB2.getProjectionRadius(axisA1) <= Math.abs(nv.dot(axisA1))) return false;
        var axisA2 = OBB1.axes[1];
        if (OBB1.getProjectionRadius(axisA2) + OBB2.getProjectionRadius(axisA2) <= Math.abs(nv.dot(axisA2))) return false;
        var axisB1 = OBB2.axes[0];
        if (OBB1.getProjectionRadius(axisB1) + OBB2.getProjectionRadius(axisB1) <= Math.abs(nv.dot(axisB1))) return false;
        var axisB2 = OBB2.axes[1];
        if (OBB1.getProjectionRadius(axisB2) + OBB2.getProjectionRadius(axisB2) <= Math.abs(nv.dot(axisB2))) return false;
        return true;

    }
}