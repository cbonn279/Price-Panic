class TextNotif {
    constructor(scene, config) {
        this.scene = scene;
        if (GameManager.notifActive) return;
        GameManager.notifActive = true;

        // config defaults
        this.text = config.text || "";
        this.x = config.x ?? scene.scale.width / 2;
        this.y = config.y ?? scene.scale.height / 2;
        this.fontSize = config.fontSize || "32px";
        this.color = config.color || "#ffffff";
        this.speed = config.speed || 50; 
        this.holdTime = config.holdTime || 3000;
        this.index = 0;
        this.fullText = "";
        this.background = config.background || false;
        this.onComplete = config.onComplete || null;

        // optional background
        if (this.background) { const { width, height } = scene.scale;
        this.back = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8).setDepth(9998);
        }

        // create text object
        this.label = scene.add.text(this.x, this.y, "", {fontFamily: "text", fontSize: this.fontSize, color: this.color, align: "center"}).setOrigin(0.5).setDepth(9999);
        this.start();

        // clean up if scene shuts down
        this.scene.events.once("shutdown", () => {
            this.forceDestroy();
        });
    }

    // begin text display
    start() {
        this.typingEvent = this.scene.time.addEvent({delay: this.speed, loop: true, callback: () => this.type()});
    }

    // text display typing
    type() {
        if (this.index >= this.text.length) {
            this.typingEvent.remove();
            this.finishTyping();
            return;
        }
        this.fullText += this.text[this.index];
        this.label.setText(this.fullText);
        this.index++;
    }

    // finish message
    finishTyping() {
        this.scene.time.delayedCall(this.holdTime, () => {
            this.destroy();

            if (this.onComplete) {
                this.onComplete();
            }
        });
    }

    // destroy text object
    destroy() {
        if (!this.label) return;

        // stop typing event just in case
        if (this.typingEvent) {
            this.typingEvent.remove();
            this.typingEvent = null;
        }

        this.scene.tweens.add({targets: [this.label, this.back].filter(Boolean), alpha: 0, duration: 500,
            onComplete: () => {
                if (this.label) {
                    this.label.destroy();
                    this.label = null;
                }
                if (this.back) {
                    this.back.destroy();
                    this.back = null;
                }
                GameManager.notifActive = false;
            }
        });
    }

    forceDestroy() {
        // stop typing event
        if (this.typingEvent) {
            this.typingEvent.remove();
            this.typingEvent = null;
        }

        // destroy text immediately
        if (this.label) {
            this.label.destroy();
            this.label = null;
        }

        // destroy background if it exists
        if (this.back) {
            this.back.destroy();
            this.back = null;
        }
        GameManager.notifActive = false;
    }
}