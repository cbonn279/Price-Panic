class Grab extends Phaser.Scene {
    constructor() {
        super("grab");
    }

    init(data) {
        this.item = data.item;
    }

    create() {
        // temporary grab screen visuals
        this.add.rectangle(512, 300, 1024, 600, 0x444444);
        this.add.text(512, 300, `Grabbed: ${this.item.name}`, {fontSize: "32px", color: "#ffffff" }).setOrigin(0.5);
    }

    // after 2 second, go back to aisle 
    // update the inventory in the game manager
    // mark shelf as used so player can't re-enter and grab more items from the same shelf
    update() {
        GameManager.addItem(this.item);
        GameManager.shelvesUsed[`aisle${GameManager.currentAisle}`] = true;
        
        this.time.delayedCall(2000, () => {
            this.scene.start("aisle", { aisle: GameManager.currentAisle });
        });
    }

}