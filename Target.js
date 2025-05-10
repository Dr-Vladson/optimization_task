class Target {
    static index = 0;
    constructor(bombAmount, x, y) {
        this.bombAmount = bombAmount;
        this.x = x;
        this.y = y;
        this.index = Target.index++;
    }

    getDistanceTo(target) {
        return Math.sqrt(Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2));
    }
}
