class Load extends Phaser.Scene {
    constructor() {
        super("loadScene")
    }

    preload() {
        this.load.path = './assets/'
        
    }

    create() {
        this.scene.launch("uiScene");
        this.scene.start("aisleOneScene");
    }
}
