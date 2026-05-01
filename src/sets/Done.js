class Done extends Phaser.Scene {
    constructor() {
        super("doneScene");
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);

        const totalQuality = GameManager.getTotalQuality();

        this.add.text(width / 2, height / 2 - 50, "DONE!", {
            fontSize: "48px",
            color: "#ffffff"
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 + 20, `Quality: ${totalQuality}`, {
            fontSize: "28px",
            color: "#ffffff"
        }).setOrigin(0.5);
    }
}