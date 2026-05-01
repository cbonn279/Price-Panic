//Someone please tune price and quality here, but for price nothing above double digits please
//Also please adjust the budget var in GameManager to tune how much money we start with
//Also please adjust the 2o in Done.js labelled (overall quality below 20 means bad soup ending)

const ITEMS = {
    aisle1: [
        { name: "milk", price: 1, quality: 50, scale: .3, Pscale: 1.3},
        { name: "milk", price: 1, quality: 1, scale: .3, Pscale: 1.3 },
        { name: "milk", price: 10, quality: 10, scale: .3, Pscale: 1.3 }
    ],

    aisle2: [
        { name: "veg", price: 1, quality: 1, scale: 3, Pscale: 10 },
        { name: "veg", price: 1, quality: 1, scale: 3, Pscale: 8 },
        { name: "veg", price: 1, quality: 1, scale: .5, Pscale: 1.5 }
    ],

    aisle3: [
        { name: "meat", price: 1, quality: 1, scale: .2, Pscale: .6 },
        { name: "meat", price: 1, quality: 1, scale: .2, Pscale: 1.3 },
        { name: "meat", price: 1, quality: 1, scale: .2, Pscale: 1.5 }
    ],

    aisle4: [
        { name: "bread", price: 1, quality: 1, scale: .24, Pscale: .8 },
        { name: "bread", price: 1, quality: 1, scale: .24, Pscale: .8 },
        { name: "bread", price: 1, quality: 1, scale: .24, Pscale: .8 }
    ],

    aisle5: [
        { name: "egg", price: 1, quality: 1, scale: .2, Pscale: .6 },
        { name: "egg", price: 1, quality: 1, scale: .2, Pscale: .6 },
        { name: "egg", price: 1, quality: 1, scale: .3, Pscale: 1.9 }
    ]
};