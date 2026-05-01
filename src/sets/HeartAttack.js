class HeartAttack {
    constructor(scene) {
        this.scene = scene;

        const { width, height } = scene.scale;

        // lock inputs
        GameManager.lockInput();

        // go quiet
        SoundManager.stopHorrorAmbient(scene);
        SoundManager.stopClockTicking(scene);
        SoundManager.playHeartBeat(scene);

        // create overlay container
        this.container = scene.add.container(0, 0).setDepth(10000);

        // red screen
        this.red = scene.add.rectangle(0, 0, width, height, 0xff0000).setOrigin(0).setAlpha(0);
        this.container.add(this.red);

        // block clicks completely
        this.blocker = scene.add.rectangle(0, 0, width, height, 0x000000, 0).setOrigin(0).setInteractive();
        this.container.add(this.blocker);
        this.startEffect();
    }

    startEffect() {
        let flashes = 0;

        const doFlash = () => {
            if (flashes >= 4) {

                // stay red after
                this.red.setAlpha(0.85);
                this.showRestart();
                return;
            }
            flashes++;
            this.scene.tweens.add({targets: this.red, alpha: 0.75, duration: 180, yoyo: true, ease: "linear",
                onComplete: () => {
                    this.scene.time.delayedCall(120, doFlash);
                }
            });

            // screeen shake
            this.scene.cameras.main.shake(200, 0.006);
        };

        doFlash();
    }

    showRestart() {
        const { width, height } = this.scene.scale;

        // you died text
        this.deathNotif = new TextNotif(this.scene, {
            text: "you had a heart attack from the stress...", x: width / 2, y: height / 2 - 120, fontSize: "28px", color: "#000000", holdTime: 999999, background: false});
            this.deathNotif.label.setDepth(10002);

        const button = this.scene.add.text(width / 2, height - 80, "RESTART", {fontFamily: "text", fontSize: "32px", color: "#ffffff", backgroundColor: "#222",
            padding: { left: 20, right: 20, top: 10, bottom: 10 } }).setOrigin(0.5).setDepth(10001).setInteractive({ useHandCursor: true });

        button.on("pointerdown", () => {
            GameManager.reset();
            SoundManager.stopHeartBeat(this.scene);

            // completely restart Phaser game instance
            this.scene.game.destroy(true);

            // rebuild game cleanly
            window.location.reload();
        });

        // hover effect
        button.on("pointerover", () => {
            button.setStyle({ backgroundColor: "#555" });
        });

        button.on("pointerout", () => {
            button.setStyle({ backgroundColor: "#222" });
        });
    }
}