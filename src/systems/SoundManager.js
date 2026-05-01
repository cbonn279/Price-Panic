class SoundManager {

    static sounds = {
        cartRolling: "cartRolling",
        aisleFootsteps: "aisleFootsteps",
        horrorAmbient: "horrorAmbient",
        butcherWhoosh: "butcherWhoosh",
        todoCheck: "todoCheck",
        spookyWind: "spookyWind",
        itemPickup: "itemPickup",
        clockTicking: "clockTicking"
    };

    static butcherAisle = 2;
    static ambientVolume = 0.25;
    static spookyWindVolume = 0.18;
    static clockTickingVolume = 0.35;
    static shouldPlaySpookyWind = false;
    static spookyWindDelay = null;

    // play function
    static play(scene, key, config = {}) {
        let sound = scene.sound.get(key);

        if (!sound) {
            sound = scene.sound.add(key, config);
        }

        sound.play();
        return sound;
    }

    // sfx
    static playCartRolling(scene) {
        return this.play(scene, this.sounds.cartRolling);
    }

    static playAisleFootsteps(scene) {
        return this.play(scene, this.sounds.aisleFootsteps);
    }

    static playTodoCheck(scene) {
        return this.play(scene, this.sounds.todoCheck);
    }

    static playItemPickup(scene) {
        return this.play(scene, this.sounds.itemPickup);
    }

    // clock ticking
    static startClockTicking(scene) {
        const key = this.sounds.clockTicking;

        let ticking = scene.sound.get(key);

        if (!ticking) {
            ticking = scene.sound.add(key, {
                loop: true,
                volume: this.clockTickingVolume
            });
        }

        if (!ticking.isPlaying) {
            ticking.play();
        }
    }

    static stopClockTicking(scene) {
        const ticking = scene.sound.get(this.sounds.clockTicking);
        if (ticking?.isPlaying) ticking.stop();
    }

    // ambience
    static startHorrorAmbient(scene) {
        const key = this.sounds.horrorAmbient;

        let music = scene.sound.get(key);

        if (!music) {
            music = scene.sound.add(key, {
                loop: true,
                volume: this.ambientVolume
            });
        }

        if (!music.isPlaying) {
            music.play();
        }
    }

    static stopHorrorAmbient(scene) {
        const music = scene.sound.get(this.sounds.horrorAmbient);
        if (music?.isPlaying) music.stop();
    }

    static updateHorrorAmbientForAisle(scene) {
        this.startHorrorAmbient(scene);
    }

    static updateHorrorAmbientForShelf(scene, aisleIndex) {
        if (this.isButcherAisle(aisleIndex)) {
            this.stopHorrorAmbient(scene);
        } else {
            this.startHorrorAmbient(scene);
        }
    }

    // spooky wind
    static startSpookyWindWithWhoosh(scene) {
        this.shouldPlaySpookyWind = true;

        this.play(scene, this.sounds.butcherWhoosh);

        if (this.spookyWindDelay) {
            this.spookyWindDelay.remove(false);
        }

        this.spookyWindDelay = scene.time.delayedCall(450, () => {
            this.spookyWindDelay = null;

            if (this.shouldPlaySpookyWind) {
                this.startSpookyWind(scene);
            }
        });
    }

    static startSpookyWind(scene) {
        const key = this.sounds.spookyWind;

        let wind = scene.sound.get(key);

        if (!wind) {
            wind = scene.sound.add(key, {
                loop: true,
                volume: this.spookyWindVolume
            });
        }

        if (!wind.isPlaying) {
            wind.play();
        }
    }

    static stopSpookyWind(scene) {
        this.shouldPlaySpookyWind = false;

        if (this.spookyWindDelay) {
            this.spookyWindDelay.remove(false);
            this.spookyWindDelay = null;
        }

        const wind = scene.sound.get(this.sounds.spookyWind);
        if (wind?.isPlaying) wind.stop();
    }

    // helpers
    static isButcherAisle(index) {
        return index === this.butcherAisle;
    }
}