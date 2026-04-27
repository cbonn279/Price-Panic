class GameManager {

    // core stats
    static budget = 150;
    static timerDuration = 60000; 
    static timerStartedAt = null;

    // game progressions/transitions
    static inventory = [];
    static shoppingList = ["milk", "veg", "meat", "fruit", "egg"];
    static aisleScenes = ["aisleOneScene", "aisleTwoScene", "aisleThreeScene", "aisleFourScene", "aisleFiveScene", "checkoutScene"];

    // for after item is grabbed from a shelf already, marking the item as done 
    // (for shopping list and not letting player re-enter shelf)
    static shelvesUsed = {aisle1: false, aisle2: false, aisle3: false, aisle4: false, aisle5: false};

    // major state flags for possible endings
    static flags = {heartAttack: false, foodPoisoning: false, success: false, timeUp: false};

    // current state
    static currentAisle = 0;
    static selectedItem = null;

    // add items to inventory and minus cost from budget
    static addItem(item) {
        this.inventory.push(item);
        this.budget -= item.price;
    }

    // check if player already has item 
    static hasItem(itemName) {
        return this.inventory.some(i => i.name === itemName);
    }

    // get total item quality in inventory for ending flags
    static getTotalQuality() {
        return this.inventory.reduce((sum, item) => sum + item.quality, 0);
    }

    // start timer on play
    static startTimer(currentTime) {
        if (!this.timerStartedAt) {
            this.timerStartedAt = currentTime;
        }
    }

    // keep track of time
    static getRemainingTime(currentTime) {
        if (!this.timerStartedAt) return this.timerDuration;

        const elapsed = currentTime - this.timerStartedAt;
        return Phaser.Math.Clamp(this.timerDuration - elapsed, 0, this.timerDuration);
    }

    // reset game stats/states for restarts
    static reset() {
        this.budget = 150;
        this.timerStartedAt = null;
        this.inventory = [];

        this.flags = {
            heartAttack: false,
            foodPoisoning: false,
            success: false,
            timeUp: false
        };

        this.currentAisle = 0;
        this.selectedItem = null;
    }
}