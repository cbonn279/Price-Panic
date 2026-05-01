class AisleScene extends Phaser.Scene {
    constructor(key, index) {
        super(key);
        this.aisleIndex = index;
    }

    create() {
        const { width, height } = this.scale;

        // keep track of global scene
        GameManager.currentAisle = this.aisleIndex;
        SoundManager.updateHorrorAmbientForAisle(this);

        // background image
        const background = `A${this.aisleIndex + 1}`;
        this.add.image(width / 2, height / 2, background).setDisplaySize(width, height).setDepth(-1);

        // use arrows to room transition
        this.ui = this.scene.get("uiScene");

        // UI mode
        this.ui.setMode("aisle");
        
        // fade in
        this.ui.fadeIn(1000);

        // listen
        this.ui.events.on("changeAisle", this.changeAisle, this);

        // clean up after scene
        this.events.once("shutdown", () => {
            this.ui.events.off("changeAisle", this.changeAisle, this);
        });

        // enter shelf scene if clicking general middle of the room
        this.input.on("pointerdown", (pointer) => {
            if (GameManager.inputLocked) return;
            const cx = width / 2;
            const cy = height / 2;

            // determine center of room
            if (Math.abs(pointer.x - cx) < 200 && Math.abs(pointer.y - cy) < 120) {
                const aisleState = GameManager.aisleData[this.aisleIndex];

                // already got item from shelf notif
                if (aisleState.used) {
                    new TextNotif(this, {text: `I already got ${GameManager.shoppingList[this.aisleIndex]}...\nI have to hurry...`, holdTime: 2000, color: "#ffffff", background: true});
                    return;
                }

                // fade out
                SoundManager.playAisleFootsteps(this);
                if (SoundManager.isButcherAisle(this.aisleIndex)) {
                    SoundManager.stopHorrorAmbient(this);
                    SoundManager.startSpookyWindWithWhoosh(this);
                }
                this.ui.fadeOut(1000, () => {this.scene.start("shelf", { aisle: this.aisleIndex });});
            }
        });
    }

    // use GameManager to change aisle with arrows
    changeAisle(direction) {
        GameManager.currentAisle = Phaser.Math.Wrap(GameManager.currentAisle + direction, 0, GameManager.aisleScenes.length);
        SoundManager.updateHorrorAmbientForAisle(this);

        // fade out
        this.ui.fadeOut(1000, () => {this.scene.start(GameManager.aisleScenes[GameManager.currentAisle]);});
    }
}

// aisle/checkout scenes defined for rooms
class AisleOne extends AisleScene { constructor() { super("aisleOneScene", 0); } }
class AisleTwo extends AisleScene { constructor() { super("aisleTwoScene", 1); } }
class AisleThree extends AisleScene { constructor() { super("aisleThreeScene", 2); } }
class AisleFour extends AisleScene { constructor() { super("aisleFourScene", 3); } }
class AisleFive extends AisleScene { constructor() { super("aisleFiveScene", 4); } }
class Checkout extends AisleScene { constructor() { super("checkoutScene", 5); } }
