const config = {
    parent: 'phaser-game',
    type: Phaser.WEBGL,
    width: 1024,
    height: 600,
    backgroundColor: '#000000',   
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 2000 },
            debug: false
        }
    },
    scene: [ Load,  Start, UIFrame, AisleScene, AisleOne, AisleTwo, AisleThree, AisleFour, AisleFive, Checkout, Shelf, CheckPrice, Done ]
}

const game = new Phaser.Game(config)
