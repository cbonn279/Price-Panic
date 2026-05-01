class CheckPrice extends Phaser.Scene {
    constructor() {
        super("checkprice");
    }

    init(data) {
        this.item = data.item;
        this.index = data.index;
        this.aisle = data.aisle;

        // hold reveal
        this.grabbed = false;
        this.progress = 0;

        // shake
        this.shakeIntensity = 0;

        // prevent multiple triggers
        this.finished = false;
    }

    create() {
        const { width, height } = this.scale;

        // backgrounds
        this.cameras.main.setBackgroundColor("#000");

        // price
        this.priceText = this.add.text(width / 2 + 150, height / 2, `$${this.item.price}`, {fontFamily: "text", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5);
        const textureKey = `${this.item.name}${this.index + 1}`;
        this.itemSprite = this.add.image(width / 2, height / 2, textureKey).setInteractive({ useHandCursor: true }).setScale(this.item.Pscale || 1.5);

        // input
        this.itemSprite.on("pointerdown", () => {
            this.grabbed = true;
        });

        this.itemSprite.on("pointerup", () => {
            this.grabbed = false;
            this.itemSprite.angle = 0;
        });

        this.itemSprite.on("pointerout", () => {
            this.grabbed = false;
            this.itemSprite.angle = 0;
        });
    }

    update() {
        const { width } = this.scale;

        // progress
        if (this.grabbed) {
            this.progress += 0.0015;
            this.shakeIntensity += 0.05;

            // subtle camera shake while dragging
            this.cameras.main.shake(40, 0.00002);
        } else {
            this.progress -= 0.02;
            this.shakeIntensity *= 0.85;
        }

        this.progress = Phaser.Math.Clamp(this.progress, 0, 1);
        this.shakeIntensity = Phaser.Math.Clamp(this.shakeIntensity, 0, 8);

        // shake item
        if (this.grabbed) {
            this.itemSprite.angle = Phaser.Math.Between(
                -this.shakeIntensity,
                this.shakeIntensity
            );
        } else {
            this.itemSprite.angle = 0;
        }

        // move item to the left
        const startX = width / 2;
        const endX = width / 2 - 140;

        this.itemSprite.x = Phaser.Math.Linear(startX, endX, this.progress);

        // finish reveal
        if (this.progress >= 1 && !this.finished) {
            this.finished = true;

            // mark revealed
            GameManager.aisleData[this.aisle].revealed[this.index] = true;

            // success camera bump
            this.cameras.main.shake(200, 0.01);

            // immediately return to shelf
            this.scene.start("shelf", { aisle: this.aisle });
        }
    }
}