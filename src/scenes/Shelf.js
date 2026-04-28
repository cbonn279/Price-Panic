class Shelf extends Phaser.Scene {
    constructor() {
        super("shelf");
    }

    // which aisle we are on
    init(data) {
        this.aisle = data.aisle;

        // track last clicked item 
        this.lastClicked = null;

        // price text reference
        this.priceText = null;
    }

    // reusable function for all clickable text UI
    makeTextbox(x, y, text, funcClick, funcHover = () => {}, funcOut = () => {}, item = null) {
        let button = this.add.text(x, y, text, this.textConfig).setStyle({ backgroundColor: '#111' }).setInteractive({ useHandCursor: true })

            // behavior for click, hover, and unhover
            .on('pointerdown', () => {funcClick(button, item);})
            .on('pointerover', () => {button.setStyle({ backgroundColor: '#706e6a' });funcHover(button, item);})
            .on('pointerout', () => {button.setStyle({ backgroundColor: '#111' });funcOut(button, item);});

        return button;
    }

    // interface functions

    // show unknown price when hovering item
    onItemHover(button, item) {
        // don't show price if already clicked
        if (this.lastClicked === button) return;
        this.priceText = this.add.text(button.x + 12, button.y + 80, "$: ???", this.priceConfig);
    }

    // remove hover price text
    onItemUnHover(button, item) {
        if (this.priceText) this.priceText.destroy();
    }

    // shows buttons for selected item
    onItemClicked(button, item) {
        this.lastClicked = button;

        // remove old buttons if they exist
        if (this.grabButton) this.grabButton.destroy();
        if (this.checkPriceButton) this.checkPriceButton.destroy();

        // create Grab and Check Price buttons
        this.grabButton = this.makeTextbox(button.x - 80, button.y + 80, "Grab", this.onItemGrabbed.bind(this));
        this.checkPriceButton = this.makeTextbox(button.x + 80, button.y + 80, "Check Price", this.onCheckPrice.bind(this));

        // remove hover text if present
        if (this.priceText) this.priceText.destroy();

        // store selected item globally
        GameManager.selectedItem = item;
    }

    // sends player to grab scene
    onItemGrabbed() {
        this.scene.start("grab", { item: GameManager.selectedItem });
    }

    // sends player to check price scene
    onCheckPrice() {
        this.scene.start("checkprice", { item: GameManager.selectedItem });
    }

    // end interface functions

    create() {
        // set ui mode
        const ui = this.scene.get("uiScene");
        ui.setMode("shelf");

        // text styles for buttons and prices
        this.textConfig = {fontFamily: 'Arial', fontSize: '25px', color: '#FFFFFF', padding: { top: 25, bottom: 25, right: 25, left: 25 },};
        this.priceConfig = {fontFamily: 'Arial', fontSize: '20px', color: '#FFFFFF', italic: true, padding: { top: 5, bottom: 5 },};

        // Checkout 
        if (this.aisle === 5) {
            this.add.rectangle(512, 300, 1024, 600, 0x000000);
            this.add.text(512, 300, "CHECKOUT", {fontSize: "48px", color: "#ffffff"}).setOrigin(0.5);
            this.createBackButton();
            return;
        }

        // load items for current aisle
        const key = `aisle${this.aisle + 1}`;
        this.items = ITEMS[key];

        // background for shelf
        this.add.rectangle(512, 300, 1024, 600, 0x222222);

        // create item displays
        this.items.forEach((item, index) => {let x = 250 + index * 250; let y = 300;
            this.makeTextbox(x, y, item.name, this.onItemClicked.bind(this), this.onItemHover.bind(this), this.onItemUnHover.bind(this), item);});

        // back button
        this.createBackButton();
    }

    // back to aisle
    createBackButton() {
        const back = this.add.circle(50, 50, 30, 0xff0000).setInteractive();
        this.add.text(50, 50, "←", {fontSize: "24px", color: "#ffffff"}).setOrigin(0.5);
        back.on("pointerdown", () => {this.scene.start(GameManager.aisleScenes[GameManager.currentAisle]);});
    }
}