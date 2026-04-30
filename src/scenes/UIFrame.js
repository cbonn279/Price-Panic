class UIFrame extends Phaser.Scene {
    constructor() {
        super("uiScene")
    }

    create() {
        const { width, height } = this.scale;
        this.scene.bringToTop();

        // fade overlay
        this.fadeOverlay = this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0).setDepth(999999).setAlpha(0);

        this.uiOffsets = {
            list: { x: -50, y: -10 },
            budget: { x: 0, y: 0 },
            cart: { x: 0, y: 150 }
        };

        // UI elements defined
        this.ui = {};
        this.ui.buy = this.createBuyStickyNote(115, 35, 190, 150);
        this.ui.budget = this.createBudgetStickyNote(width - 305, 35, 190, 150);
        this.ui.timer = new Timer(this, width / 2, 72, 62);
        this.ui.cart = this.createCartPlaceholder(width / 2, height - 85);
        this.ui.leftArrow = this.createArrowButton(75, height / 2 + 32, -1);
        this.ui.rightArrow = this.createArrowButton(width - 75, height / 2 + 32, 1);

        // Each time you press C, it finds the next shopping-list item you don't have, 
        // adds a temporary item to inventory
        // and then refreshes the buy sticky note.
        this.input.keyboard.on("keydown-C", () => {
            const itemName = GameManager.shoppingList.find(item => !GameManager.hasItem(item));

            if (itemName) {
                GameManager.inventory.push({ name: itemName, price: 0, quality: 0 });
            }

            this.updateShoppingList();
        });
    }

    // fade out
    fadeOut(duration = 1000, onComplete = null) {

        // lock inputs
        GameManager.lockInput();

        // pause timer
        GameManager.pauseTimer(this.game.loop.time);

        // fade out tween
        this.tweens.add({targets: this.fadeOverlay, alpha: 1, duration: duration, onComplete: () => {if (onComplete) onComplete();}});
    }

    // fade in
    fadeIn(duration = 1000, onComplete = null) {

        // fade in tween
        this.tweens.add({targets: this.fadeOverlay, alpha: 0, duration: duration, onComplete: () => {

                // unlock inputs
                GameManager.unlockInput();

                // resume timer
                GameManager.resumeTimer(this.game.loop.time);
                if (onComplete) onComplete();
            }
        });
    }


    // update timer, list, budget
    update() {
        if (this.ui.timer) this.ui.timer.update();
        if (this.ui.buy) this.updateShoppingList();
        if (this.ui.budget) this.updateBudget();
    }

    // UI modes based on room
    setMode(mode) {
        // turn everything off first
        Object.values(this.ui).forEach(e => e.setVisible(false));

        // UI for aisle
        if (mode === "aisle") {
            this.ui.buy.setVisible(true);
            this.ui.budget.setVisible(true);
            this.ui.timer.setVisible(true);
            this.ui.cart.setVisible(true);
            this.ui.leftArrow.setVisible(true);
            this.ui.rightArrow.setVisible(true);
        }

        // UI for shelf
        if (mode === "shelf") {
            this.ui.budget.setVisible(true);
            this.ui.timer.setVisible(true);
        }

        // UI timer only
        if (mode === "time") {
            this.ui.timer.setVisible(true);
        }

        // UI off
        if (mode === "none") {
        }
    }

    // UI Creation (ty Noah)
    createArrowButton(x, y, direction) {
        const container = this.add.container();

        const arrow = this.add.graphics();
        const point = direction === -1 ? -1 : 1;

        const hitArea = new Phaser.Geom.Triangle(
            x + (point * 38), y,
            x - (point * 18), y - 48,
            x - (point * 18), y + 48
        );
        arrow.fillStyle(0xded8c8, 1);
        arrow.lineStyle(5, 0x2f2f2f, 0.85);
        arrow.beginPath();
        arrow.moveTo(hitArea.x1, hitArea.y1);
        arrow.lineTo(hitArea.x2, hitArea.y2);
        arrow.lineTo(hitArea.x3, hitArea.y3);
        arrow.closePath();
        arrow.fillPath();
        arrow.strokePath();
        arrow.setInteractive(hitArea, Phaser.Geom.Triangle.Contains);
        arrow.on("pointerdown", () => {
            // lock inputs
            if (GameManager.inputLocked) return;
            this.events.emit("changeAisle", direction);
        });

        arrow.on("pointerover", () => {
            this.input.setDefaultCursor("pointer");
        });

        arrow.on("pointerout", () => {
            this.input.setDefaultCursor("default");
        });

        container.add(arrow);
        return container;
    }

    createStickyNote(x, y, w, h, title, color) {
        const container = this.add.container();

        const note = this.add.graphics();
        note.fillStyle(color, 1);
        note.fillRoundedRect(x, y, w, h, 8);
        note.lineStyle(4, 0x3a3024, 0.75);
        note.strokeRoundedRect(x, y, w, h, 8);
        note.lineBetween(x, y + 44, x + w, y + 44);

        const text = this.add.text(x + 18, y + 10, title, {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#2e2a24",
            fontStyle: "bold"
        });

        container.add([note, text]);
        return container;
    }

    createBuyStickyNote(x, y, w, h) {
        const container = this.add.container();

        // background image
        const listBg = this.add.image(x + (this.uiOffsets.list?.x || 0), y + (this.uiOffsets.list?.y || 0), "list").setOrigin(0).setDisplaySize(w, h);
        container.add(listBg);
        const items = GameManager.shoppingList || [];

        const listX = x + 18;
        const listTop = y + 18;
        const listWidth = w - 36;
        const rowHeight = Math.min(18, (h - 66) / Math.max(items.length, 1));

        container.shoppingListItems = items.map((itemName, index) => {
            const itemY = listTop + index * rowHeight;

            const itemText = this.add.text(listX, itemY, itemName, {fontFamily: "text", fontSize: "15px", color: "#2e2a24", fixedWidth: listWidth});
            const strike = this.add.graphics();
            container.add([itemText, strike]);

            return {name: itemName, text: itemText, strike, strikeRight: x + w - 18};});

        this.updateShoppingList(container);
        return container;
    }

    createBudgetStickyNote(x, y, w, h) {
        const container = this.add.container();
        const bg = this.add.image( x + (this.uiOffsets.budget?.x || 0), y + (this.uiOffsets.budget?.y || 0), "budget").setOrigin(0).setDisplaySize(w, h);
        container.add(bg);
        container.budgetText = this.add.text(x + w / 2, y + 96, "", {fontFamily: "text", fontSize: "36px", color: "#2e2a24", fontStyle: "bold"}).setOrigin(0.5);
        container.add(container.budgetText);
        this.updateBudget(container);
        return container;
    }

    updateBudget(container = this.ui.budget) {
        if (!container || !container.budgetText) return;

        // hide budget if player grabbed without checking price
        if (GameManager.budgetHidden) {
            container.budgetText.setText("$???");
        } else {
            container.budgetText.setText(`$${GameManager.budget}`);
        }
    }

    updateShoppingList(container = this.ui.buy) {
        if (!container || !container.shoppingListItems) return;

        container.shoppingListItems.forEach((entry) => {
            const hasItem = GameManager.hasItem(entry.name);

            entry.text.setAlpha(hasItem ? 0.55 : 1);
            entry.strike.clear();

            if (hasItem) {
                const bounds = entry.text.getBounds();
                entry.strike.lineStyle(3, 0x2e2a24, 0.85);
                entry.strike.lineBetween(
                    bounds.left - 2,
                    bounds.centerY,
                    Math.min(bounds.right + 4, entry.strikeRight),
                    bounds.centerY
                );
            }
        });
    }

     createCartPlaceholder(x, y) {
        const container = this.add.container();
        const bg = this.add.image(x + (this.uiOffsets.cart?.x || 0), y + (this.uiOffsets.cart?.y || 0), "cart").setOrigin(0.5);
        container.add(bg);
        return container;
    }
}
