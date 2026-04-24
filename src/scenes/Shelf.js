class Shelf extends Phaser.Scene {
    constructor() {
        super("shelf");
    }

    // which aisle we are on
    init(data) {
        this.aisle = data.aisle;
        this.lastClicked = null
        this.priceText = null
    }

    // fart framework
    makeTextbox(x, y, text, funcClick, funcHover = (button) => {}, funcOut = (button) => {}) {
		let button = this.add.text(x, y, text, this.textConfig)
			.setStyle({ backgroundColor: '#111' })
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				funcClick(button);
				// this.sound.play('textbox-click_sound', this.buttonAudioConfig);
			})
			.on('pointerover', () => {
				button.setStyle({ backgroundColor: '#706e6a' });
                funcHover(button)
				// this.sound.play('textbox-hover_sound', this.buttonAudioConfig);
			})
			.on('pointerout', () => {
                button.setStyle({ backgroundColor: '#111' })
                funcOut(button)
            })
		return button
	}

    onItemHover(button) {
        // Dont show price ??? if clicked already
        if (this.lastClicked === button) return;
        this.priceText = this.add.text(button.x + 12, button.y + 80, "$: ???", this.priceConfig)
    }

    onItemUnHover(button) {
        if (this.priceText != null) this.priceText.destroy();
    }

    onItemClicked(button) {
        this.lastClicked = button;
        if (this.grabButton) this.grabButton.destroy()
        if (this.checkPriceButton) this.checkPriceButton.destroy()

        this.grabButton = this.makeTextbox(button.x - 80, button.y + 80, "Grab", this.onItemGrabbed.bind(this))
        this.checkPriceButton = this.makeTextbox(button.x + 80, button.y + 80, "Check Price", this.onCheckPrice.bind(this))

        // destroy if clicked poo button
        if (this.priceText != null) this.priceText.destroy();
    }

    onItemGrabbed(button) {
        this.scene.start("grab")
    }

    onCheckPrice(button) {
        this.scene.start("checkprice")
    }

    create() {
        this.textConfig = {
			fontFamily: 'Arial',
			fontSize: '25px',
			color: '#FFFFFF',
			align: 'left',
			padding: { top: 25, bottom: 25, right: 25, left: 25 },
		};

		this.priceConfig = {
			fontFamily: 'Arial',
			fontSize: '20px',
			color: '#FFFFFF',
			align: 'left',
            italic: true,
			padding: { top: 5, bottom: 5 },
		};

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
            // this.add.rectangle(x, y, 150, 150, 0xffffff).setStrokeStyle(3, 0x000000);
            // this.add.text(x, y, item.name, {color: "#000"}).setOrigin(0.5);});

            this.makeTextbox(x, y, item.name, this.onItemClicked.bind(this), this.onItemHover.bind(this), this.onItemUnHover.bind(this))
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