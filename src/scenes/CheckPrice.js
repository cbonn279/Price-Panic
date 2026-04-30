class CheckPrice extends Phaser.Scene {
    constructor() {
        super("checkprice");
    }

    // receive selected item
    init(data) {
        this.item = data.item;
        console.log(this.item)

        this.grabbed = false;
        this.grabTime = 1000;
        this.shakeIntensity = 1;
        this.shakeRamping = 0.01;
        this.shakeDir = 1;
        this.shakeMovement = 1;
        this.shakeMovementRamping = 0.01;
    }

    create() {
        // basic UI
        this.add.rectangle(512, 300, 1024, 600, 0x555555);
        this.add.text(512, 250, `Item: ${this.item.name}`, {fontSize: "32px", color: "#ffffff"}).setOrigin(0.5);

        // initial hidden price
        this.priceText = this.add.text(512, 350, `Price: ???`, {fontSize: "64px", color: "#ffffff"}).setOrigin(0.5);
        this.priceTag = this.add.rectangle(512,350, 400, 100, 0x00000).setInteractive({useHandCursor: true}).setOrigin(0.5)
        .on('pointerdown', () => {
            this.grabbed = true;
            this.shakeIntensity - 1;
            this.shakeMovement = 1
        }).on('pointerup', () => {
            this.grabbed = false;
            this.priceTag.angle = 0;
        }).on('pointerout', () => {
            this.grabbed = false;
            this.priceTag.angle = 0;
        });

        // price reveal
        // this.time.delayedCall(2000, () => {this.priceText.setText(`Price: $${this.item.price.toFixed(2)}`);});

        // return to shelf
        // this.time.delayedCall(5000, () => {this.scene.start("shelf", { aisle: GameManager.currentAisle });});
    }

    update() {
        this.shakeDir = 1
        if (this.grabbed) {
            this.shakeDir = -1
            this.shakeIntensity += this.shakeRamping
            if (this.grabTime % 4 == 0) {
                this.priceTag.angle = this.shakeIntensity;
            } else if (this.grabTime % 7 == 0) {
                this.priceTag.angle = -this.shakeIntensity;
            }
            else {
                this.priceTag.angle = 0;
            }
        }
        console.log(this.grabTime)
        this.shakeMovement += this.shakeMovementRamping * this.shakeDir
        this.grabTime = Math.floor(this.grabTime + this.shakeMovement)
        this.grabTime = Phaser.Math.Clamp(this.grabTime, 0, 1000);
        this.shakeIntensity = Phaser.Math.Clamp(this.shakeIntensity, 0, 5)
        this.priceTag.x = Phaser.Math.Interpolation.SmoothStep(this.grabTime / 1000, 512/2, 512)
    }
}