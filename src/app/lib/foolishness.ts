import { emitEvent } from "@shared";

const FOOLISHNESS_PATH = "foolishness";
const FOOLISHNESS_MIN = 0;
const FOOLISHNESS_MAX = 100;

const FOOLISHNESS_SPEED_PATH = "foolishness_speed";
const FOOLISHNESS_SPEED_MIN = .1;

export function getFoolishness(): number {
    const level = localStorage.getItem(FOOLISHNESS_PATH) ?? "0";
    return Number(level);
}

export function setFoolishness(level: number, options?: { emitEvent: boolean }) {
    let fixedLevel = level;
    if (level > FOOLISHNESS_MAX) fixedLevel = FOOLISHNESS_MAX;
    if (level < FOOLISHNESS_MIN) fixedLevel = FOOLISHNESS_MIN;

    localStorage.setItem(FOOLISHNESS_PATH, fixedLevel.toString());

    if (options?.emitEvent) {
        emitEvent("foolishness-bar:changed");
    }
}

export function getFoolishnessSpeed() {
    const speed = localStorage.getItem(FOOLISHNESS_SPEED_PATH) ?? ".1";
    return Number(speed);
}

export function setFoolishnessSpeed(speed: number) {
    let fixedSpeed = speed;
    if (speed < FOOLISHNESS_SPEED_MIN) fixedSpeed = FOOLISHNESS_SPEED_MIN;

    localStorage.setItem(FOOLISHNESS_PATH, fixedSpeed.toString());
}