class Start extends Phaser.Scene {
    constructor() {
        super("startScene");
    }

    create() {
        const { width, height } = this.scale;

        // UI mode
        this.ui = this.scene.get("uiScene");
        this.ui.setMode("none");
        GameManager.pauseTimer(this.game.loop.time);

        // black background
        this.cameras.main.setBackgroundColor("#000000");

        // message to type
        const message = `oh no
the bus is gonna leave soon...
I better hurry up and get everything....`;

        // create text notif
        const notif = new TextNotif(this, {text: message, speed: 80, holdTime: 1000, fontSize: "32px"});

        // total time until typing finishes
        const typingTime = message.length * 40;

        // wait after typing
        this.time.delayedCall(typingTime + 3000, () => {this.fadeToWhite();});
    }

    // fade the black screen into a white one for bright store
    fadeToWhite() {
        const { width, height } = this.scale;

        // white overlay starts invisible
        const whiteOverlay = this.add.rectangle(0, 0, width, height, 0xffffff).setOrigin(0).setAlpha(0).setDepth(9999);

        // fade tween to white
        this.tweens.add({targets: whiteOverlay, alpha: 1, duration: 1500, onComplete: () => {

                // hold white screen then transition
                this.time.delayedCall(1000, () => {this.scene.start("aisleOneScene");});
                GameManager.resumeTimer(this.game.loop.time);
            }
        });
    }
}
