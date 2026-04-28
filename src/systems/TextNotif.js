class TextNotif {
    constructor(scene, config) {
        this.scene = scene;

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

        // create text object
        this.label = scene.add.text(this.x, this.y, "", {fontFamily: "Arial", fontSize: this.fontSize, color: this.color, align: "center"}).setOrigin(0.5);
        this.start();
    }

    // begin text display
    start() {
        this.scene.time.addEvent({delay: this.speed, loop: true, callback: () => this.type()});
    }

    // text display typing
    type() {
        if (this.index >= this.text.length) {
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
        });
    }

    // destroy text object
    destroy() {
        this.scene.tweens.add({targets: this.label, alpha: 0, duration: 500, onComplete: () => {this.label.destroy();}});
    }
}