class Done extends Phaser.Scene {
    constructor() {
        super("doneScene");
    }

    create() {
        const { width, height } = this.scale;

        // force close ui
        const ui = this.scene.get("uiScene");
        if (ui) ui.scene.setVisible(false);

        this.cameras.main.setBackgroundColor("#000");
        const totalQuality = GameManager.getTotalQuality();
        const finalBudget = GameManager.budget;

        // if budget fail
        if (finalBudget < 0) {
            this.showBudgetFail();
            return;
        }

        // soup quality checker
        const hasGoodQuality = totalQuality >= 20;
        this.showCashierIntro(hasGoodQuality);
    }

    // heart attack if budget fail
    showBudgetFail() {
        this.playTextAndThen({text: "hey your card declined, do you have tap orr??...\n\n...im not paid enough for this...", holdTime: 2500, background: true}, () => {
            this.time.delayedCall(400, () => {
                new HeartAttack(this);
            });
        });
    }

    // intro text-
    showCashierIntro(isGood) {
        this.playTextAndThen({text: "thanks for shopping at merchant johns...", holdTime: 2500, background: true}, () => {
            this.showSoup(isGood);
        });
    }

    // show your soup
    showSoup(isGood) {
        const { width, height } = this.scale;
        const soupKey = isGood ? "good" : "bad";

        // display soup
        this.soup = this.add.image(width / 2, height / 2, soupKey).setDisplaySize(width, height).setAlpha(0);
        this.tweens.add({targets: this.soup, alpha: 1, duration: 800,
            onComplete: () => {
                this.showSoupReaction(isGood);
            }
        });
    }

    // soup reaction text-
    showSoupReaction(isGood) {
        const msg = isGood ? "wow this looks amazing" : "wow this looks uh... horrible...";

        // determine ending
        this.playTextAndThen({text: msg, holdTime: 2000, background: true}, () => {
            if (isGood) {
                this.goodEnding();
            } else {
                this.badEnding();
            }
        });
    }

    // bad ending
    badEnding() {
        this.time.delayedCall(300, () => {
            new HeartAttack(this);
        });
    }

    // good ending
    goodEnding() {
        const { width, height } = this.scale;

        // keep soup
        if (this.soup) {
            this.soup.setDepth(0);
        }

        // create play again button 
        const button = this.add.text(width / 2, height / 2, "play again?", {fontFamily: "text", fontSize: "32px", color: "#ffffff", backgroundColor: "#222", padding: { left: 20, right: 20, top: 10, bottom: 10 }}).setOrigin(0.5).setScrollFactor(0).setDepth(1000).setInteractive({ useHandCursor: true });

        // restart game on click
        button.on("pointerdown", () => {
            GameManager.reset();
            this.scene.game.destroy(true);
            window.location.reload();
        });
        button.on("pointerover", () => button.setStyle({ backgroundColor: "#555" }));
        button.on("pointerout", () => button.setStyle({ backgroundColor: "#222" }));
    }

    // text displayer using TextNotif
    playTextAndThen(config, next) {
        const notif = new TextNotif(this, {
            text: config.text,
            holdTime: config.holdTime,
            background: config.background,
            onComplete: () => {
                if (next) next();
            }
        });
    }
}