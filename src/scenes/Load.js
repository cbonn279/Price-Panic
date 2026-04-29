class Load extends Phaser.Scene {
    constructor() {
        super("loadScene")
    }

    preload() {
        this.load.path = './assets/'

        // font
        this.load.font('text', 'Leander.ttf', 'truetype')

        // backgrounds
        this.load.image('A1', 'dairy.png')
        this.load.image('A2', 'produce.png')
        this.load.image('A3', 'butcher.png')
        this.load.image('A4', 'bread.png')
        this.load.image('A5', 'egg.png')
        this.load.image('A6', 'cashier.png')
        this.load.image('shelf', 'shelf.png')
        
        
    }

    create() {
        this.scene.launch("uiScene");
        this.scene.start("startScene");
    }
}
