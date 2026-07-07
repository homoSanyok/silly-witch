import { emitEvent } from "@shared";

const FOOLISHNESS_PATH = "foolishness";
const FOOLISHNESS_MIN = 0;
const FOOLISHNESS_MAX = 100;

const FOOLISHNESS_SPEED_PATH = "foolishness_speed";
const FOOLISHNESS_SPEED_MIN = .1;

/**
 * Singleton объект, инициализируемый в `window`.
 */
export class Foolishness {
    private _level: number;
    private _speed: number;

    get level() { return this._level; }
    get speed() { return this._speed; }

    set level(value: number) {
        let fixedValue = value;
        if (value > FOOLISHNESS_MAX) fixedValue = FOOLISHNESS_MAX;
        if (value < FOOLISHNESS_MIN) fixedValue = FOOLISHNESS_MIN;

        this._level = fixedValue;
        localStorage.setItem(FOOLISHNESS_PATH, fixedValue.toString());
    }

    set speed(value: number) {
        let fixedValue = value;
        if (value < FOOLISHNESS_SPEED_MIN) fixedValue = FOOLISHNESS_SPEED_MIN;

        this._level = fixedValue;
        localStorage.setItem(FOOLISHNESS_SPEED_PATH, fixedValue.toString());
    }

    constructor() {
        this._level = Number(localStorage.getItem(FOOLISHNESS_PATH) ?? FOOLISHNESS_MIN);
        this._speed = Number(localStorage.getItem(FOOLISHNESS_SPEED_PATH) ?? FOOLISHNESS_SPEED_MIN);
    }
}