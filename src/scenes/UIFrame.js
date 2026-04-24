class UIFrame extends Phaser.Scene {
<<<<<<< Updated upstream
    constructor(sceneKey, aisleIndex) {
        super(sceneKey)
        this.aisleIndex = aisleIndex
    }

    create() {
        const { width, height } = this.scale
        this.currentAisle = this.aisleIndex
        this.aisleColors = [0xd9d4c6, 0xcfe3d1, 0xd7d2ea]
        this.aisleScenes = ["aisleOneScene", "aisleTwoScene", "aisleThreeScene"]

        this.background = this.add.rectangle(width / 2, height / 2, width, height, this.aisleColors[this.currentAisle])
        this.add.rectangle(width / 2, height / 2, width - 48, height - 40, 0xf0ead9, 0.18)
            .setStrokeStyle(4, 0x3d3d3d, 0.45)

        this.cameras.main.setBackgroundColor(this.aisleColors[this.currentAisle])

        this.createStickyNote(115, 35, 190, 150, "Buy", 0xffef8a)
        this.createStickyNote(width - 305, 35, 190, 150, "Budget", 0xaee6ff)
        this.createTimer(width / 2, 72, 62, 0.72)
        this.createDisplayPlaceholder(width / 2, height / 2 + 7)
        this.createAisleArrows(width, height)
        this.createCartPlaceholder(width / 2, height - 85)
    }

    changeAisle(direction) {
        const nextAisle = Phaser.Math.Wrap(this.currentAisle + direction, 0, this.aisleScenes.length)

        this.scene.start(this.aisleScenes[nextAisle])
    }

    createStickyNote(x, y, noteWidth, noteHeight, title, color) {
        const note = this.add.graphics()

        note.fillStyle(color, 1)
        note.fillRoundedRect(x, y, noteWidth, noteHeight, 8)
        note.lineStyle(4, 0x3a3024, 0.75)
        note.strokeRoundedRect(x, y, noteWidth, noteHeight, 8)
        note.lineBetween(x, y + 44, x + noteWidth, y + 44)

        this.add.text(x + 18, y + 10, title, {
=======
    constructor() {
        super("uiScene")
    }

    create() {
        const { width, height } = this.scale;
        this.scene.bringToTop();

        // UI elements defined
        this.ui = {};
        this.ui.buy = this.createStickyNote(115, 35, 190, 150, "Buy", 0xffef8a);
        this.ui.budget = this.createStickyNote(width - 305, 35, 190, 150, "Budget", 0xaee6ff);
        this.ui.timer = this.createTimer(width / 2, 72, 62, 0.72);
        this.ui.cart = this.createCartPlaceholder(width / 2, height - 85);
        this.ui.leftArrow = this.createArrowButton(75, height / 2 + 32, -1);
        this.ui.rightArrow = this.createArrowButton(width - 75, height / 2 + 32, 1);
    
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
>>>>>>> Stashed changes
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#2e2a24",
            fontStyle: "bold"
        });

        container.add([note, text]);
        return container;
    }

    createTimer(x, y, radius, percent) {
        const container = this.add.container();

        const timer = this.add.graphics();
        const startAngle = Phaser.Math.DegToRad(-90);
        const endAngle = startAngle + (Math.PI * 2 * percent);

        timer.fillStyle(0xf5f1e6, 1);
        timer.fillCircle(x, y, radius);

        timer.fillStyle(0x3e8f5d, 1);
        timer.slice(x, y, radius - 8, startAngle, endAngle, false);
        timer.fillPath();

        timer.lineStyle(6, 0x2f2f2f, 0.8);
        timer.strokeCircle(x, y, radius);

        const text = this.add.text(x, y, "Timer", {
            fontFamily: "Arial",
            fontSize: "22px",
            color: "#242424",
            fontStyle: "bold"
        }).setOrigin(0.5);

        container.add([timer, text]);
        return container;
    }

     createCartPlaceholder(x, y) {
        const container = this.add.container();

        const cart = this.add.graphics();
        const cartWidth = 470;
        const cartHeight = 120;
        const left = x - cartWidth / 2;
        const top = y - cartHeight / 2;

        cart.fillStyle(0xe6ddcb, 0.92);
        cart.fillRoundedRect(left, top, cartWidth, cartHeight, 10);

        cart.lineStyle(5, 0x2f2f2f, 0.75);
        cart.strokeRoundedRect(left, top, cartWidth, cartHeight, 10);

        const text = this.add.text(x, y, "Shopping cart asset area", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#6f675b",
            fontStyle: "bold"
        }).setOrigin(0.5);

<<<<<<< Updated upstream
class AisleOne extends UIFrame {
    constructor() {
        super("aisleOneScene", 0)
    }
}

class AisleTwo extends UIFrame {
    constructor() {
        super("aisleTwoScene", 1)
    }
}

class AisleThree extends UIFrame {
    constructor() {
        super("aisleThreeScene", 2)
=======
        container.add([cart, text]);
        return container;
>>>>>>> Stashed changes
    }
}
