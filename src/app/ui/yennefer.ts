import { loadTileset } from "@app";
import { KeyName } from "@app";
import { AnimatedSprite, Polygon, Texture, Ticker } from "pixi.js";

const FRAME_DURATION = 10;
const MOVE_ALPHA = 2.2;

const RIGHT_FRAMES = [0, 1, 2, 3];
const LEFT_FRAMES = [4, 5, 6, 7];
const DOWN_FRAMES = [8, 9, 10, 11];
const UP_FRAMES = [12, 13, 14, 15];

/**
 * Singleton объект, инициализируемый в `window`.
 */
export class Yennefer {
    private readonly moveTicker = new Ticker();
    private frameTimer = 0;

    private _sprite?: AnimatedSprite;
    private readonly _polygon = new Polygon([]);

    get sprite(): AnimatedSprite { return this._sprite ?? new AnimatedSprite([new Texture()]); }

    get polygon() { return this._polygon; }
    set polygon(value: Polygon) { this._polygon.points = value.points; }


    async load() {
        const textures = await loadTileset([
            { frameWidth: 80, frameHeight: 64, cols: 4, rows: 2, file: "assets/yennefer/walk-horizontal.png" },
            { frameWidth: 40, frameHeight: 64, cols: 4, rows: 2, file: "assets/yennefer/walk-vertical.png" },
        ]);

        this._sprite = new AnimatedSprite(textures);
        this._sprite.gotoAndStop(LEFT_FRAMES[1]);
        this._sprite.x = 9 * 32;
        this._sprite.y = 12 * 32;

        this.moveTicker.start();
        return this._sprite;
    }

    private isInPolygon(options: {
        x: number,
        y: number,
        width: number,
        height: number
    }) {
        if (this._polygon.points.length === 0) return true;

        return this._polygon.contains(options.x, options.y) &&
            this._polygon.contains(options.x + options.width, options.y) &&
            this._polygon.contains(options.x + options.width, options.y + options.height) &&
            this._polygon.contains(options.x, options.y + options.height)
    }

    gotoRight() {
        if (!this._sprite) return;

        if (this.frameTimer > FRAME_DURATION || this._sprite.currentFrame > 3) {
            this._sprite.gotoAndStop((this._sprite.currentFrame + 1) % 4);
            this.frameTimer = 0;
        }
    }

    gotoLeft() {
        if (!this._sprite) return;

        if (this.frameTimer > FRAME_DURATION || (this._sprite.currentFrame < 4 || this._sprite.currentFrame > 7)) {
            this._sprite.gotoAndStop(4 + (this._sprite.currentFrame + 1) % 4);
            this.frameTimer = 0;
        }
    }

    gotoDown() {
        if (!this._sprite) return;

        if (this.frameTimer > FRAME_DURATION || (this._sprite.currentFrame < 8 || this._sprite.currentFrame > 11)) {
            this._sprite.gotoAndStop(8 + (this._sprite.currentFrame + 1) % 4);
            this.frameTimer = 0;
        }
    }

    gotoUp() {
        if (!this._sprite) return;

        if (this.frameTimer > FRAME_DURATION || this._sprite.currentFrame < 12) {
            this._sprite.gotoAndStop(12 + (this._sprite.currentFrame + 1) % 4);
            this.frameTimer = 0;
        }
    }

    gotoStop(opetions?: { now: boolean }) {
        if (!this._sprite) return;

        if (this.frameTimer > FRAME_DURATION * 7 || opetions?.now) {
            this.frameTimer = 0;

            if (RIGHT_FRAMES.includes(this._sprite.currentFrame)) this._sprite.gotoAndStop(RIGHT_FRAMES[0]);
            else if (LEFT_FRAMES.includes(this._sprite.currentFrame)) this._sprite.gotoAndStop(LEFT_FRAMES[3]);
            else if (DOWN_FRAMES.includes(this._sprite.currentFrame)) this._sprite.gotoAndStop(DOWN_FRAMES[0]);
            else if (UP_FRAMES.includes(this._sprite.currentFrame)) this._sprite.gotoAndStop(UP_FRAMES[0]);
        }
    }

    constructor() {
        this.moveTicker.add(ticker => {
            this.frameTimer += ticker.deltaTime;
            const keys = window.KeysListener.keys;

            const yennefer = this._sprite;
            if (!yennefer) return;

            if (window.Action.visible || window.Chat.visible) {
                this.gotoStop({ now: true });
                return;
            }

            let lastPushedKey: KeyName | undefined = "w";
            for (const key of (["w", "a", "s", "d"] as KeyName[])) {
                if (keys[key]?.pushed && ((keys[key]?.timestamp ?? 0) > (keys[lastPushedKey]?.timestamp ?? 0))) {
                    lastPushedKey = key;
                }
            }
            if (!keys[lastPushedKey]?.pushed) lastPushedKey = undefined;

            switch (lastPushedKey) {
                case "w": {
                    const xCompensation = RIGHT_FRAMES.includes(yennefer.currentFrame) ? 40 : 0;
                    if (!this.isInPolygon({
                        x: yennefer.x + xCompensation,
                        y: yennefer.y - ticker.deltaTime * MOVE_ALPHA,
                        width: 40,
                        height: 64
                    })) {
                        if (UP_FRAMES.includes(yennefer.currentFrame)) break;
                        this.gotoUp();
                        break;
                    }

                    yennefer.x += xCompensation;
                    yennefer.y -= ticker.deltaTime * MOVE_ALPHA;
                    this.gotoUp();
                    break;
                }
                case "s": {
                    const xCompensation = RIGHT_FRAMES.includes(yennefer.currentFrame) ? 40 : 0;
                    if (!this.isInPolygon({
                        x: yennefer.x + xCompensation,
                        y: yennefer.y + ticker.deltaTime * MOVE_ALPHA,
                        width: 40,
                        height: 64
                    })) {
                        if (DOWN_FRAMES.includes(yennefer.currentFrame)) break;
                        this.gotoDown()
                        break;
                    }

                    yennefer.x += xCompensation;
                    yennefer.y += ticker.deltaTime * MOVE_ALPHA;
                    this.gotoDown();
                    break;
                }
                case "a": {
                    if (!this.isInPolygon({
                        x: yennefer.x - ticker.deltaTime * MOVE_ALPHA,
                        y: yennefer.y,
                        width: 80,
                        height: 64
                    })) {
                        if (LEFT_FRAMES.includes(yennefer.currentFrame) || RIGHT_FRAMES.includes(yennefer.currentFrame)) break;
                        if (!this.isInPolygon({
                            x: yennefer.x - ticker.deltaTime * MOVE_ALPHA - 40,
                            y: yennefer.y,
                            width: 80,
                            height: 64
                        })) {
                            this.gotoLeft();
                            break;
                        }

                        yennefer.x -= 40;
                    }

                    yennefer.x -= ticker.deltaTime * MOVE_ALPHA;
                    this.gotoLeft();
                    break;
                }
                case "d": {
                    if (!this.isInPolygon({
                        x: yennefer.x + ticker.deltaTime * MOVE_ALPHA,
                        y: yennefer.y,
                        width: 80,
                        height: 64
                    })) {
                        if (LEFT_FRAMES.includes(yennefer.currentFrame) || RIGHT_FRAMES.includes(yennefer.currentFrame)) break;
                        let xOffset = 0;
                        while (!this.isInPolygon({
                            x: yennefer.x + ticker.deltaTime * MOVE_ALPHA - xOffset,
                            y: yennefer.y,
                            width: 80,
                            height: 64
                        })) xOffset += 2;

                        yennefer.x -= xOffset;
                    }

                    yennefer.x += ticker.deltaTime * MOVE_ALPHA;
                    this.gotoRight();
                    break;
                }
            }

            this.gotoStop();
        });
    }
}