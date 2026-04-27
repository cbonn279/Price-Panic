class Grab extends Phaser.Scene {
    constructor() {
        super("grab");
    }

    // receive selected item from Shelf
    init(data) {
        this.item = data.item;
    }

    create() {
        // background
        this.add.rectangle(512, 300, 1024, 600, 0x333333);

        // prompt text
        this.add.text(512, 250, `Grab ${this.item.name}?`, {fontSize: "32px", color: "#ffffff"}).setOrigin(0.5);

        // yes button
        const yes = this.add.text(412, 350, "YES", {fontSize: "28px", backgroundColor: "#0f0", color: "#000", padding: { x: 20, y: 10 }}).setInteractive();
        yes.on("pointerdown", () => {

            // add item to inventory and subtract cost
            GameManager.addItem(this.item);

            // mark this aisle as used 
            const key = `aisle${GameManager.currentAisle + 1}`;
            GameManager.shelvesUsed[key] = true;

            // clear selected item 
            GameManager.selectedItem = null;

            // return to shelf
            this.scene.start("shelf", { aisle: GameManager.currentAisle });
        });

        // no button
        const no = this.add.text(612, 350, "NO", {fontSize: "28px", backgroundColor: "#f00", color: "#000", padding: { x: 20, y: 10 }}).setInteractive();
        no.on("pointerdown", () => {

            // just go back without changes
            GameManager.selectedItem = null;

            this.scene.start("shelf", { aisle: GameManager.currentAisle });
        });
    }
}