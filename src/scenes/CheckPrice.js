class CheckPrice extends Phaser.Scene {
    constructor() {
        super("checkprice");
    }

    // receive selected item
    init(data) {
        this.item = data.item;
    }

    create() {
        // basic UI
        this.add.rectangle(512, 300, 1024, 600, 0x555555);
        this.add.text(512, 250, `Item: ${this.item.name}`, {fontSize: "32px", color: "#ffffff"}).setOrigin(0.5);

        // initial hidden price
        this.priceText = this.add.text(512, 350, `Price: ???`, {fontSize: "32px", color: "#ffffff"}).setOrigin(0.5);

        // price reveal
        this.time.delayedCall(2000, () => {this.priceText.setText(`Price: $${this.item.price.toFixed(2)}`);});

        // return to shelf
        this.time.delayedCall(5000, () => {this.scene.start("shelf", { aisle: GameManager.currentAisle });});
    }
}