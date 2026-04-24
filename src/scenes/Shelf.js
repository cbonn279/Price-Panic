class Shelf extends Phaser.Scene {
    constructor() {
        super("shelf");
    }

    // which aisle we are on
    init(data) {
        this.aisle = data.aisle;
    }

    create() {
        // if room 6, the checkout will popup instead of shelves
        if (this.aisle === 5) {

            // temporary checkout visuals
            this.add.rectangle(512, 300, 1024, 600, 0x000000);
            this.add.text(512, 300, "CHECKOUT", {fontSize: "48px", color: "#ffffff" }).setOrigin(0.5);
            
            // back to rooms button
            this.createBackButton();
            return;
        }

        // shelves display if not checkout
        // get item list based on aisle index
        const key = `aisle${this.aisle + 1}`;
        this.items = ITEMS[key];

        // temporary shelf background
        this.add.rectangle(512, 300, 1024, 600, 0x222222);

        // display each item 
        this.items.forEach((item, index) => {
            let x = 250 + index * 250;
            let y = 300;

            // temporary box/text instead of items
            this.add.rectangle(x, y, 150, 150, 0xffffff).setStrokeStyle(3, 0x000000);
            this.add.text(x, y, item.name, {color: "#000"}).setOrigin(0.5);
        });

        
        // back to rooms button
        this.createBackButton();
    }

    // create back to room button
    createBackButton() {
        // Red circle with white arrow
        const back = this.add.circle(50, 50, 30, 0xff0000).setInteractive();
        this.add.text(50, 50, "←", {fontSize: "24px",color: "#ffffff"}).setOrigin(0.5);

        // cick to transition
        back.on("pointerdown", () => {
            this.scene.start(GameManager.aisleScenes[GameManager.currentAisle]);
        });
    }
}