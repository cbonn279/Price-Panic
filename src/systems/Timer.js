class Timer {
    constructor(scene, x, y, radius) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.graphics = scene.add.graphics();
        this.text = scene.add.text(x, y, "", {fontFamily: "Arial", fontSize: "26px", color: "#242424", fontStyle: "bold"}).setOrigin(0.5);

        // use GameManager to start timer
        GameManager.startTimer(scene.game.loop.time);
    }

    update() {
        // get current time
        const currentTime = this.scene.game.loop.time;

        // ask GameManager for remaining time
        const remaining = GameManager.getRemainingTime(currentTime);
        const duration = GameManager.timerDuration;
        const percent = remaining / duration;
        const seconds = Math.ceil(remaining / 1000);
        const startAngle = Phaser.Math.DegToRad(-90);
        const endAngle = startAngle + (Math.PI * 2 * percent);

        this.graphics.clear();

        // background
        this.graphics.fillStyle(0xf5f1e6, 1);
        this.graphics.fillCircle(this.x, this.y, this.radius);

        // fill
        if (percent > 0) {
            this.graphics.fillStyle(0x3e8f5d, 1);
            this.graphics.slice(this.x, this.y, this.radius - 8, startAngle, endAngle, false);
            this.graphics.fillPath();
        }

        // border
        this.graphics.lineStyle(6, 0x2f2f2f, 0.8);
        this.graphics.strokeCircle(this.x, this.y, this.radius);

        // text
        this.text.setText(seconds.toString());

        // timeout flag
        if (remaining <= 0 && !GameManager.flags.timeUp) {
            GameManager.flags.timeUp = true;
        }
    }

    // visibility flexibility
    setVisible(value) {
        this.graphics.setVisible(value);
        this.text.setVisible(value);
    }
}