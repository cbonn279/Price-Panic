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

    makeItemSprite(x, y, textureKey, funcClick, funcHover = () => {}, funcOut = () => {}, item = null) {
        const sprite = this.add.image(x, y, textureKey).setInteractive({ useHandCursor: true }).setScale(item?.scale ?? this.itemScale);

        sprite.on('pointerdown', () => {
            funcClick(sprite, item);
        });

        sprite.on('pointerover', () => {
            sprite.setTint(0xaaaaaa);
            funcHover(sprite, item);
        });

        sprite.on('pointerout', () => {
            sprite.clearTint();
            funcOut(sprite, item);
        });

        return sprite;
    }

    // show unknown price when hovering item
    onItemUnHover(button, item) {
        if (this.priceText) {
            this.priceText.destroy();
            this.priceText = null;
        }
    }

    // hover price text
    onItemHover(button, item) {
        if (this.lastClicked === button) return;

        // keep track of state
        const index = button.itemIndex;
        const aisleState = GameManager.aisleData[this.aisle];

        // destroy old hover text first 
        if (this.priceText) this.priceText.destroy();

        // show ??? or price
        this.priceText = this.add.text(button.x, button.y + 70, aisleState.revealed[index] ? `$${item.price}` : "$???", this.priceConfig).setOrigin(0.5);
    }

    // shows buttons for selected item
    onItemClicked(button, item) {
        this.lastClicked = button;
        this.selectedIndex = button.itemIndex;

        // remove old buttons if they exist
        if (this.grabButton) this.grabButton.destroy();
        if (this.checkPriceButton) this.checkPriceButton.destroy();

        // create Grab and Check Price buttons
        this.grabButton = this.makeTextbox(button.x - 80, button.y + 80, "Grab", () => this.onItemGrabbed(item, this.selectedIndex));
        this.checkPriceButton = this.makeTextbox(button.x + 80, button.y + 80, "Check Price", () => this.onCheckPrice(item, this.selectedIndex));

        // remove hover text if present
        if (this.priceText) this.priceText.destroy();

        // store selected item globally
        GameManager.selectedItem = item;
    }

    // sends player to check price scene
    onCheckPrice(item, index) {
        this.scene.start("checkprice", {item: item, index: index, aisle: this.aisle});
    }

    // grab selected item
    onItemGrabbed(item, index) {
        if (GameManager.inputLocked) return;
        GameManager.lockInput();

        const aisleState = GameManager.aisleData[this.aisle];

        // mark shelf as used
        aisleState.used = true;

        // if price is not revealed, ??? budget
        if (!aisleState.revealed[index]) {
            GameManager.budgetHidden = true;
        }

        // add item
        GameManager.addItem(item);

        // remove the clicked item button
        if (this.lastClicked) {
            this.lastClicked.destroy();
        }

        // remove action buttons
        if (this.grabButton) this.grabButton.destroy();
        if (this.checkPriceButton) this.checkPriceButton.destroy();

        // fade out back to aisle
        this.ui.fadeOut(1000, () => {GameManager.unlockInput(); 
        this.scene.start(GameManager.aisleScenes[this.aisle]);});
    }

    create() {
        // set ui mode
        this.ui = this.scene.get("uiScene");
        this.ui.setMode("shelf");

        // fade in
        this.ui.fadeIn(1000);;

        // text styles for buttons and prices
        this.textConfig = {fontFamily: 'text', fontSize: '25px', color: '#FFFFFF', padding: { top: 25, bottom: 25, right: 25, left: 25 },};
        this.priceConfig = {fontFamily: 'text', fontSize: '20px', color: '#FFFFFF', italic: true, padding: { top: 5, bottom: 5 },};

        // Checkout (for now)
        if (this.aisle === 5) {
            this.add.rectangle(512, 300, 1024, 600, 0x000000);
            this.add.text(512, 300, "CHECKOUT", {fontSize: "48px", color: "#ffffff"}).setOrigin(0.5);
            this.createBackButton();
            return;
        }

        // load items for current aisle
        const key = `aisle${this.aisle + 1}`;
        this.items = ITEMS[key];
        const aisleState = GameManager.aisleData[this.aisle];

        // background for shelf
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, "shelf").setDisplaySize(width, height).setDepth(-1);

        // display revealed prices
        this.items.forEach((item, index) => {
            let x = 250 + index * 250;
            let y = 300;

            // display item sprite
            const textureKey = `${item.name}${index + 1}`;
            const sprite = this.makeItemSprite(x, y, textureKey, this.onItemClicked.bind(this), this.onItemHover.bind(this), this.onItemUnHover.bind(this), item);

            // attach index to sprite
            sprite.itemIndex = index; 
        });

        // back button
        this.createBackButton();
    }

    // back to aisle
    createBackButton() {
        const back = this.add.circle(50, 50, 30, 0xff0000).setInteractive();
        this.add.text(50, 50, "←", {fontSize: "24px", color: "#ffffff"}).setOrigin(0.5);
        back.on("pointerdown", () => {

            // fade out
            this.ui.fadeOut(1000, () => {

            // go back to aisle
            this.scene.start(GameManager.aisleScenes[this.aisle]);
            });
        });
    }
}