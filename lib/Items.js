//Someone please tune price and quality here, but for price nothing above double digits please
//Also please adjust the budget var in GameManager to tune how much money we start with
//Also please adjust the 2o in Done.js labelled (overall quality below 20 means bad soup ending)

const ITEMS = {
    aisle1: [
        { name: "milk", price: 11, quality: 13, scale: .3, Pscale: 1.3 },
        { name: "milk", price: 7, quality: 8, scale: .3, Pscale: 1.3 },
        { name: "milk", price: 4, quality: 4, scale: .3, Pscale: 1.3 }
    ],

    aisle2: [
        { name: "veg", price: 8, quality: 14, scale: 3, Pscale: 10 },
        { name: "veg", price: 6, quality: 9, scale: 3, Pscale: 8 },
        { name: "veg", price: 3, quality: 1, scale: .5, Pscale: 1.5 }
    ],

    aisle3: [
        { name: "meat", price: 7, quality: 5, scale: .2, Pscale: .6 },
        { name: "meat", price: 14, quality: 16, scale: .2, Pscale: 1.3 },
        { name: "meat", price: 11, quality: 8, scale: .2, Pscale: 1.5 }
    ],

    aisle4: [
        { name: "bread", price: 2, quality: 3, scale: .24, Pscale: .8 },
        { name: "bread", price: 5, quality: 7, scale: .24, Pscale: .8 },
        { name: "bread", price: 7, quality: 11, scale: .24, Pscale: .8 }
    ],

    aisle5: [
        { name: "egg", price: 9, quality: 12, scale: .2, Pscale: .6 },
        { name: "egg", price: 6, quality: 8, scale: .2, Pscale: .6 },
        { name: "egg", price: 3, quality: 4, scale: .3, Pscale: 1.9 }
    ]
};
