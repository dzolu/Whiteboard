interface IPoint {
    x: number;
    y: number
}

class CanvasHelper {
    static DistanseBetweenPoints(a: IPoint, b: IPoint) {
        return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((b.y - b.y), 2));
    }
}

export default CanvasHelper