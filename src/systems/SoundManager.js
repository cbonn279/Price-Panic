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

    static play(scene, key) {
        let sound = scene.sound.get(key);

        if (!sound) {
            sound = scene.sound.add(key);
        }

        if (sound.isPlaying) return sound;

        sound.play();
        return sound;
    }

    static playCartRolling(scene) {
        SoundManager.play(scene, SoundManager.sounds.cartRolling);
    }

    static playAisleFootsteps(scene) {
        SoundManager.play(scene, SoundManager.sounds.aisleFootsteps);
    }

    static playButcherWhoosh(scene) {
        return SoundManager.play(scene, SoundManager.sounds.butcherWhoosh);
    }

    static playTodoCheck(scene) {
        SoundManager.play(scene, SoundManager.sounds.todoCheck);
    }

    static playItemPickup(scene) {
        SoundManager.play(scene, SoundManager.sounds.itemPickup);
    }

    static startClockTicking(scene) {
        const key = SoundManager.sounds.clockTicking;
        let ticking = scene.sound.get(key);

        if (!ticking) {
            ticking = scene.sound.add(key, {
                loop: true,
                volume: SoundManager.clockTickingVolume
            });
        }

        ticking.setVolume(SoundManager.clockTickingVolume);

        if (!ticking.isPlaying) {
            ticking.play();
        }
    }

    static stopClockTicking(scene) {
        const ticking = scene.sound.get(SoundManager.sounds.clockTicking);

        if (ticking && ticking.isPlaying) {
            ticking.stop();
        }
    }

    static startSpookyWindWithWhoosh(scene) {
        SoundManager.shouldPlaySpookyWind = true;
        SoundManager.playButcherWhoosh(scene);

        if (SoundManager.spookyWindDelay) {
            SoundManager.spookyWindDelay.remove(false);
        }

        SoundManager.spookyWindDelay = scene.time.delayedCall(450, () => {
            SoundManager.spookyWindDelay = null;

            if (SoundManager.shouldPlaySpookyWind) {
                SoundManager.startSpookyWind(scene);
            }
        });
    }

    static startSpookyWind(scene) {
        const key = SoundManager.sounds.spookyWind;
        let wind = scene.sound.get(key);

        if (!wind) {
            wind = scene.sound.add(key, {
                loop: true,
                volume: SoundManager.spookyWindVolume
            });
        }

        wind.setVolume(SoundManager.spookyWindVolume);

        if (!wind.isPlaying) {
            wind.play();
        }
    }

    static stopSpookyWind(scene) {
        SoundManager.shouldPlaySpookyWind = false;
        if (SoundManager.spookyWindDelay) {
            SoundManager.spookyWindDelay.remove(false);
            SoundManager.spookyWindDelay = null;
        }

        const wind = scene.sound.get(SoundManager.sounds.spookyWind);

        if (wind && wind.isPlaying) {
            wind.stop();
        }
    }

    static startHorrorAmbient(scene) {
        const key = SoundManager.sounds.horrorAmbient;
        let music = scene.sound.get(key);

        if (!music) {
            music = scene.sound.add(key, {
                loop: true,
                volume: SoundManager.ambientVolume
            });
        }

        music.setVolume(SoundManager.ambientVolume);

        if (!music.isPlaying) {
            music.play();
        }
    }

    static stopHorrorAmbient(scene) {
        const music = scene.sound.get(SoundManager.sounds.horrorAmbient);

        if (music && music.isPlaying) {
            music.stop();
        }
    }

    static updateHorrorAmbientForShelf(scene, aisleIndex) {
        if (SoundManager.isButcherAisle(aisleIndex)) {
            SoundManager.stopHorrorAmbient(scene);
            return;
        }

        SoundManager.startHorrorAmbient(scene);
    }

    static updateHorrorAmbientForAisle(scene) {
        SoundManager.startHorrorAmbient(scene);
    }

    static isButcherAisle(aisleIndex) {
        return aisleIndex === SoundManager.butcherAisle;
    }
}
