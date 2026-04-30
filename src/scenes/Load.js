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
        
        // items
        this.load.image('milk1', 'milk1.png')
        this.load.image('milk2', 'milk2.png')
        this.load.image('milk3', 'milk3.png')
        this.load.image('veg1', 'veg1.png')
        this.load.image('veg2', 'veg2.png')
        this.load.image('veg3', 'veg3.png')
        this.load.image('meat1', 'meat1.png')
        this.load.image('meat2', 'meat2.png')
        this.load.image('meat3', 'meat3.png')
        this.load.image('bread1', 'bread1.png')
        this.load.image('bread2', 'bread2.png')
        this.load.image('bread3', 'bread3.png')
        this.load.image('egg1', 'egg1.png')
        this.load.image('egg2', 'egg2.png')
        this.load.image('egg3', 'egg3.png')

        // ui
        this.load.image('list', 'list.png')
        this.load.image('price', 'price.png')
        this.load.image('budget', 'budget.png')
        this.load.image('cart', 'cart.png')
    }

    create() {
        this.scene.launch("uiScene");
        this.scene.start("startScene");
    }
}
