class Load extends Phaser.Scene {
    constructor() {
        super("loadScene")
    }

    preload() {
        this.load.path = './assets/'

        // font
        this.load.font('text', 'Leander.ttf', 'truetype')
        
    }

    create() {
        this.scene.launch("uiScene");
        this.scene.start("startScene");
    }
}
