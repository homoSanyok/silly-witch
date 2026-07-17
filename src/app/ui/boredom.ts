import { Container, Graphics, Ticker } from "pixi.js";

const BOREDOM_PATH = "foolishness";
const BOREDOM_MIN = 0;
const BOREDOM_MAX = 100;

const BOREDOM_SPEED_PATH = "foolishness_speed";
const BOREDOM_SPEED_MIN = .1;

const PADDING = 4;
const WIDTH = 48 - PADDING * 2;
const HEIGHT = 176 - PADDING * 2;
const FRAME_TIMER_TIMEOUT = 1000;

/**
 * Singleton объект, инициализируемый в `window`.
 */
export class Boredom {
    private readonly ticker = new Ticker();

    private _level: number;
    private _speed: number;
    private _container?: Container;

    private fillingRect = new Graphics();

    get level() { return this._level; }
    get speed() { return this._speed; }
    get container(): Container { return this._container ?? new Container(); }

    set level(value: number) {
        let fixedValue = value;
        if (value > BOREDOM_MAX) fixedValue = BOREDOM_MAX;
        if (value < BOREDOM_MIN) fixedValue = BOREDOM_MIN;

        this.fillingRect.clear();
        const height = HEIGHT * (fixedValue / 100);
        this.fillingRect.rect(0, 0, WIDTH, HEIGHT - height)
            .fill("#A59805");

        this._level = fixedValue;
        localStorage.setItem(BOREDOM_PATH, fixedValue.toString());
    }

    set speed(value: number) {
        let fixedValue = value;
        if (value < BOREDOM_SPEED_MIN) fixedValue = BOREDOM_SPEED_MIN;

        this._level = fixedValue;
        localStorage.setItem(BOREDOM_SPEED_PATH, fixedValue.toString());
    }

    async load() {
        const bar = new Container();

        const background = new Graphics();
        background.roundRect(0, 0, WIDTH + PADDING * 2, HEIGHT + PADDING * 2)
            .fill("#A59805");

        const negativeRect = new Graphics();
        negativeRect.roundRect(0, 0, WIDTH, HEIGHT)
            .fill("#D0021B");

        this.fillingRect.rect(0, 0, WIDTH, HEIGHT - (HEIGHT * (this.level / 100)))
            .fill("#A59805");

        bar.addChild(background);
        bar.addChild(negativeRect);
        bar.addChild(this.fillingRect);

        bar.x = window.innerWidth - bar.width - PADDING;
        bar.y = PADDING;
        negativeRect.x = PADDING;
        negativeRect.y = PADDING;
        this.fillingRect.x = PADDING;
        this.fillingRect.y = PADDING;

        this._container = bar;
        return this._container;
    }

    constructor() {
        this._level = Number(localStorage.getItem(BOREDOM_PATH) ?? BOREDOM_MIN);
        this._speed = Number(localStorage.getItem(BOREDOM_SPEED_PATH) ?? BOREDOM_SPEED_MIN);

        let frameTimer = 0;
        this.ticker.add(ticker => {
            frameTimer += ticker.deltaMS;

            if (frameTimer > FRAME_TIMER_TIMEOUT) {
                frameTimer = 0;
                this.level = this.level + 1 * this.speed;
            }
        });
        this.ticker.start();
    }
}