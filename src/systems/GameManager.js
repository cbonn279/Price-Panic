class GameManager {

    // core stats
    static budget = 150;
    static timerDuration = 60000;  
    static timerStart = null;
    static paused = false;
    static pausedTime = 0;
    static pauseStart = null;
    static inputLocked = false;
    static notifActive = false;

    // game progressions/transitions
    static inventory = [];
    static shoppingList = ["milk", "veg", "meat", "bread", "egg"];
    static aisleScenes = ["aisleOneScene", "aisleTwoScene", "aisleThreeScene", "aisleFourScene", "aisleFiveScene", "checkoutScene"];

    // for after item is grabbed from a shelf already, marking the item as done 
    // (for shopping list and not letting player re-enter shelf)
    static shelvesUsed = {aisle1: false, aisle2: false, aisle3: false, aisle4: false, aisle5: false};

    // track per aisle state
    static aisleData = {
        0: { used: false, checked: [false, false, false], revealed: [false, false, false] },
        1: { used: false, checked: [false, false, false], revealed: [false, false, false] },
        2: { used: false, checked: [false, false, false], revealed: [false, false, false] },
        3: { used: false, checked: [false, false, false], revealed: [false, false, false] },
        4: { used: false, checked: [false, false, false], revealed: [false, false, false] }
    };

    // if player ever grabs without checking price
    static budgetHidden = false;

    // major state flags for possible endings
    static flags = {heartAttack: false, foodPoisoning: false, success: false, timeUp: false};

    // current state
    static currentAisle = 0;
    static selectedItem = null;

    // checkout condition
    static hasAllItems() {
        return this.shoppingList.every(item => this.hasItem(item));
    }

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
        if (this.timerStart === null) {
            this.timerStart = currentTime;
            this.pausedTime = 0;
            this.paused = false;
            this.pauseStart = null;
        }
    }

    // keep track of time
    static getRemainingTime(currentTime) {
        if (this.timerStart === null) return this.timerDuration;
        let pausedExtra = this.pausedTime;

        // if currently paused, include current pause duration
        if (this.paused && this.pauseStart !== null) {
            pausedExtra += currentTime - this.pauseStart;
        }

        // visually keep up
        const elapsed = currentTime - this.timerStart - pausedExtra;
        return Phaser.Math.Clamp(this.timerDuration - elapsed, 0, this.timerDuration);
    }

    // pause timer
        static pauseTimer(currentTime) {
        if (!this.paused) {
            this.paused = true;
            this.pauseStart = currentTime;
        }
    }

    // resume timer
    static resumeTimer(currentTime) {
        if (this.paused) {
            this.paused = false;
            this.pausedTime += currentTime - this.pauseStart;
            this.pauseStart = null;
        }
    }

    // lock and unlock input
    static lockInput() {
        this.inputLocked = true;
    }

    static unlockInput() {
        this.inputLocked = false;
    }

    // reset game stats/states for restarts
    static reset() {
        this.budget = 150;

        // stats reset
        this.timerStart = null;
        this.paused = false;
        this.pausedTime = 0;
        this.pauseStart = null;
        this.inputLocked = false;
        this.notifActive = false;
        this.inventory = [];

        // reset aisle data completely
        this.aisleData = {
            0: { used: false, checked: [false, false, false], revealed: [false, false, false] },
            1: { used: false, checked: [false, false, false], revealed: [false, false, false] },
            2: { used: false, checked: [false, false, false], revealed: [false, false, false] },
            3: { used: false, checked: [false, false, false], revealed: [false, false, false] },
            4: { used: false, checked: [false, false, false], revealed: [false, false, false] }
        };

        this.budgetHidden = false;
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