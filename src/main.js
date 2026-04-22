const config = {
    parent: 'phaser-game',
    type: Phaser.WEBGL,
    width: 1024,
    height: 600,
    backgroundColor: '#626665',   
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 2000 },
            debug: false
        }
    },
    scene: [ Load, AisleOne, AisleTwo, AisleThree, AisleFour, AisleFive, Checkout, Shelf ]
}

const game = new Phaser.Game(config)
