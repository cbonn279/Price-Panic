class UIFrame extends Phaser.Scene {
    constructor(sceneKey, aisleIndex) {
        super(sceneKey)

        // defining room are we in
        this.aisleIndex = aisleIndex
    }

    create() {
        const { width, height } = this.scale

        // keep track of global scene
        GameManager.currentAisle = this.aisleIndex

        // temporary room colors, just rainbow for now (we can add assets later)
        this.aisleColors = [0xff0000, 0xff7f00, 0xFFCE1B, 0x00ff00, 0x0000ff, 0x8b00ff];

        // temporary labelling of rooms
        this.add.text(width / 2, height / 3.5, `ROOM ${this.aisleIndex + 1}`, {fontSize: "48px",color: "#ffffff"}).setOrigin(0.5);

        // UI Placement (ty Noah)
        this.cameras.main.setBackgroundColor(this.aisleColors[this.aisleIndex]);
        this.createStickyNote(115, 35, 190, 150, "Buy", 0xffef8a)
        this.createStickyNote(width - 305, 35, 190, 150, "Budget", 0xaee6ff)
        this.createTimer(width / 2, 72, 62, 0.72)
        this.createDisplayPlaceholder(width / 2, height / 2 + 7)
        this.createAisleArrows(width, height)
        this.createCartPlaceholder(width / 2, height - 85)

        // enter Shelf  when clicking center of room
        this.input.on("pointerdown", (pointer) => {
            const centerX = this.scale.width / 2;
            const centerY = this.scale.height / 2;

            // determine center of room
            if (Math.abs(pointer.x - centerX) < 200 && Math.abs(pointer.y - centerY) < 120) {
                this.scene.start("shelf", {aisle: GameManager.currentAisle});
            }
        });
    }

    // use GameManager to reference aisle switching for arrows
    changeAisle(direction) {
        GameManager.currentAisle = Phaser.Math.Wrap(GameManager.currentAisle + direction, 0,GameManager.aisleScenes.length);

        // switch scene
        this.scene.start(GameManager.aisleScenes[GameManager.currentAisle]);
    }

    // create UI (tyty Noah)
    createStickyNote(x, y, noteWidth, noteHeight, title, color) {
        const note = this.add.graphics()

        note.fillStyle(color, 1)
        note.fillRoundedRect(x, y, noteWidth, noteHeight, 8)
        note.lineStyle(4, 0x3a3024, 0.75)
        note.strokeRoundedRect(x, y, noteWidth, noteHeight, 8)
        note.lineBetween(x, y + 44, x + noteWidth, y + 44)

        this.add.text(x + 18, y + 10, title, {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#2e2a24",
            fontStyle: "bold"
        })
    }

    createTimer(x, y, radius, remainingPercent) {
        const timer = this.add.graphics()
        const startAngle = Phaser.Math.DegToRad(-90)
        const endAngle = startAngle + (Math.PI * 2 * remainingPercent)

        timer.fillStyle(0xf5f1e6, 1)
        timer.fillCircle(x, y, radius)
        timer.fillStyle(0x3e8f5d, 1)
        timer.slice(x, y, radius - 8, startAngle, endAngle, false)
        timer.fillPath()
        timer.lineStyle(6, 0x2f2f2f, 0.8)
        timer.strokeCircle(x, y, radius)

        this.add.text(x, y, "Timer", {
            fontFamily: "Arial",
            fontSize: "22px",
            color: "#242424",
            fontStyle: "bold"
        }).setOrigin(0.5)
    }

    createDisplayPlaceholder(x, y) {
        const display = this.add.rectangle(x, y, 430, 195, 0xe9e2d1, 0.8)
            .setStrokeStyle(5, 0x2f2f2f, 0.7)

        this.add.text(display.x, display.y, "Asset area", {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#6f675b",
            fontStyle: "bold"
        }).setOrigin(0.5)
    }

    createAisleArrows(width, height) {
        this.createArrowButton(75, height / 2 + 32, "left")
        this.createArrowButton(width - 75, height / 2 + 32, "right")
    }

    createArrowButton(x, y, direction) {
        const arrow = this.add.graphics()
        const point = direction === "left" ? -1 : 1
        const hitArea = new Phaser.Geom.Triangle(
            x + (point * 38),
            y,
            x - (point * 18),
            y - 48,
            x - (point * 18),
            y + 48
        )

        arrow.fillStyle(0xded8c8, 1)
        arrow.lineStyle(5, 0x2f2f2f, 0.85)
        arrow.beginPath()
        arrow.moveTo(hitArea.x1, hitArea.y1)
        arrow.lineTo(hitArea.x2, hitArea.y2)
        arrow.lineTo(hitArea.x3, hitArea.y3)
        arrow.closePath()
        arrow.fillPath()
        arrow.strokePath()

        arrow.setInteractive(hitArea, Phaser.Geom.Triangle.Contains)
        arrow.on("pointerdown", () => {
            this.changeAisle(direction === "left" ? -1 : 1)
        })
        arrow.on("pointerover", () => {
            this.input.setDefaultCursor("pointer")
        })
        arrow.on("pointerout", () => {
            this.input.setDefaultCursor("default")
        })
    }

    createCartPlaceholder(x, y) {
        const cart = this.add.graphics()
        const cartWidth = 470
        const cartHeight = 120
        const left = x - cartWidth / 2
        const top = y - cartHeight / 2

        cart.fillStyle(0xe6ddcb, 0.92)
        cart.fillRoundedRect(left, top, cartWidth, cartHeight, 10)
        cart.lineStyle(5, 0x2f2f2f, 0.75)
        cart.strokeRoundedRect(left, top, cartWidth, cartHeight, 10)

        this.add.text(x, y, "Shopping cart asset area", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#6f675b",
            fontStyle: "bold"
        }).setOrigin(0.5)
    }
}

// aisle/checkout scenes defined for rooms
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
    }
}

class AisleFour extends UIFrame {
    constructor() {
        super("aisleFourScene", 3)
    }
}

class AisleFive extends UIFrame {
    constructor() {
        super("aisleFiveScene", 4)
    }
}

class Checkout extends UIFrame {
    constructor() {
        super("checkoutScene", 5)
    }
}
