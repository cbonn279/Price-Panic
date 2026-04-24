class CheckPrice extends Phaser.Scene {
    
    constructor() {
        super("checkprice");
    }

    init(data) {
        this.item = data.item;
    }

    create() {
        // temporary check price screen visuals
        this.add.rectangle(512, 300, 1024, 600, 0x555555);
        this.add.text(512, 250, `Item: ${this.item.name}`, {fontSize: "32px", color: "#ffffff" }).setOrigin(0.5);
        this.add.text(512, 350, `Price: ???`, {fontSize: "32px", color: "#ffffff" }).setOrigin(0.5);
    }

    update() { 
        // potentially: price gets bigger every second until it reaches the actual price
        // update price text to show actual price after X seconds
        this.time.delayedCall(2000, () => {
            
            // Destroy the previous price text before adding the new one
             this.children.each(child => {
                if (child.text && child.text.startsWith("Price:")) {
                    child.destroy();
                }
            });
    
            this.add.text(512, 350, `Price: $${this.item.price.toFixed(2)}`, {fontSize: "32px", color: "#ffffff" }).setOrigin(0.5);
        });
        
        // after X second, go back to shelf
        this.time.delayedCall(5000, () => {
            this.scene.start("shelf", { aisle: GameManager.currentAisle });
        });

    }

}