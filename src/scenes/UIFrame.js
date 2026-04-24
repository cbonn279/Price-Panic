class UIFrame extends Phaser.Scene {
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
        this.createTimer(width / 2, 72, 62)
        this.createDisplayPlaceholder(width / 2, height / 2 + 7)
        this.createAisleArrows(width, height)
        this.createCartPlaceholder(width / 2, height - 85)
    }

    update() {
        this.updateTimer()
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
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#2e2a24",
            fontStyle: "bold"
        })
    }

    createTimer(x, y, radius) {
        if (!this.registry.has("timerStartedAt")) {
            this.registry.set("timerStartedAt", this.game.loop.time)
        }

        this.timerDuration = 60000
        this.timerStartedAt = this.registry.get("timerStartedAt")
        this.timerX = x
        this.timerY = y
        this.timerRadius = radius
        this.timerGraphics = this.add.graphics()
        this.timerText = this.add.text(x, y, "60", {
            fontFamily: "Arial",
            fontSize: "26px",
            color: "#242424",
            fontStyle: "bold"
        }).setOrigin(0.5)

        this.updateTimer()
    }

    updateTimer() {
        if (!this.timerGraphics) {
            return
        }

        const elapsed = this.game.loop.time - this.timerStartedAt
        const remaining = Phaser.Math.Clamp(this.timerDuration - elapsed, 0, this.timerDuration)
        const remainingPercent = remaining / this.timerDuration
        const remainingSeconds = Math.ceil(remaining / 1000)
        const startAngle = Phaser.Math.DegToRad(-90)
        const endAngle = startAngle + (Math.PI * 2 * remainingPercent)

        this.timerGraphics.clear()
        this.timerGraphics.fillStyle(0xf5f1e6, 1)
        this.timerGraphics.fillCircle(this.timerX, this.timerY, this.timerRadius)

        if (remainingPercent >= 1) {
            this.timerGraphics.fillStyle(0x3e8f5d, 1)
            this.timerGraphics.fillCircle(this.timerX, this.timerY, this.timerRadius - 8)
        } else if (remainingPercent > 0) {
            this.timerGraphics.fillStyle(0x3e8f5d, 1)
            this.timerGraphics.slice(this.timerX, this.timerY, this.timerRadius - 8, startAngle, endAngle, false)
            this.timerGraphics.fillPath()
        }

        this.timerGraphics.lineStyle(6, 0x2f2f2f, 0.8)
        this.timerGraphics.strokeCircle(this.timerX, this.timerY, this.timerRadius)
        this.timerText.setText(remainingSeconds.toString())
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
