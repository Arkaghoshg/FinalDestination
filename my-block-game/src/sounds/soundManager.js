// src/utils/soundManager.js
import { Audio } from "expo-av";

const soundFiles = {
  run: require("../../assets/sfx/run.mp3"),
  land: require("../../assets/sfx/land.mp3"),
  correct: require("../../assets/sfx/correct.mp3"),
  wrong: require("../../assets/sfx/wrong.mp3"),
  click: require("../../assets/sfx/click.mp3"),
};

let muted = false;

// return an Audio.Sound instance (you must call stop/unload when needed)
export async function playSound(name, { loop = false } = {}) {
  if (muted) return null;
  const file = soundFiles[name];
  if (!file) return null;
  try {
    const { sound } = await Audio.Sound.createAsync(file, { shouldPlay: true, isLooping: loop });
    // If loop is false, schedule unload after playback ends (best-effort)
    if (!loop) {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    }
    return sound;
  } catch (e) {
    console.warn("playSound error", e);
    return null;
  }
}

export async function stopSound(soundInstance) {
  if (!soundInstance) return;
  try {
    await soundInstance.stopAsync();
    await soundInstance.unloadAsync();
  } catch (e) {
    // ignore
  }
}

export function setMuted(val) {
  muted = !!val;
}

export function isMuted() {
  return muted;
}
