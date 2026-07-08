import { Container, Graphics, Ticker } from "pixi.js";

const PADDING = 4;
const HEIGHT = 96 - PADDING * 2;
const WIDTH = 352 - PADDING * 2;
const TIMEOUT_BECOMING_INVISIBLE_BAR = 600;

const DEFAULT_SPEED = 5;

export class Action {
    private readonly ticker = new Ticker();

    private _container?: Container;
    get container(): Container { return this._container ?? new Container(); }

    private selector = new Graphics();
    private speed = DEFAULT_SPEED;

    get visible(): boolean { return !!this._container?.visible; }
    set visible(value: boolean) {
        if (!this._container) return;
        this._container.visible = value;
    }

    async load() {
        const bar = new Container();

        const background = new Graphics();
        background.roundRect(0, 0, WIDTH + PADDING * 2, HEIGHT + PADDING * 2)
            .fill("#A59805");

        const negativeRect = new Graphics();
        negativeRect.roundRect(0, 0, WIDTH, HEIGHT)
            .fill("#D0021B");

        const positiveRectsContainer = new Container();
        positiveRectsContainer.x = negativeRect.x;
        positiveRectsContainer.y = negativeRect.y;

        this.selector.roundRect(0, 0, 4, HEIGHT)
            .fill("#C2B306")

        bar.addChild(background);
        bar.addChild(negativeRect);
        bar.addChild(positiveRectsContainer);
        bar.addChild(this.selector);

        bar.x = window.innerWidth / 2 - bar.width / 2;
        bar.y = window.innerHeight * .05;
        negativeRect.x = PADDING;
        negativeRect.y = PADDING;
        this.selector.x = PADDING * 2;
        this.selector.y = PADDING;

        bar.visible = false;

        this._container = bar;
        this.visible = false;

        return this._container;
    }

    private simpleCenterLine(): Promise<boolean> {
        return new Promise(resolve => {
            const line = new Graphics()
                .rect(0, 0, 24, HEIGHT)
                .fill("#63B208");

            this.container.addChild(line);
            this.container.setChildIndex(line, 3);

            line.x = WIDTH / 2 - line.width / 2;
            line.y = PADDING;

            const handler = () => {
                if (window.KeysListener.keys.space?.pushed) {
                    this.ticker.stop();
                    setTimeout(
                        () => resolve(rectsIntersect(line, this.selector)),
                        TIMEOUT_BECOMING_INVISIBLE_BAR
                    );
                    this.ticker.remove(handler);
                }
            };
            this.ticker.add(handler);
        });
    }

    async start(options?: { speed: number }) {
        if (this.visible) return new Error("Another action is already run!");

        if (options?.speed) this.speed = options.speed;
        this.visible = true;
        this.ticker.start();

        const success = await this.simpleCenterLine();

        await (() => new Promise(resolve => {
            setTimeout(() => resolve(true), TIMEOUT_BECOMING_INVISIBLE_BAR);
        }))();
        this.speed = DEFAULT_SPEED;
        this.visible = false;

        return success;
    }

    constructor() {
        let selectorDirection: "right" | "left" = "left";
        this.ticker.add(ticker => {
            if (selectorDirection === "right") {
                if ((this.selector.x + PADDING) > WIDTH) selectorDirection = "left";
                else this.selector.x += this.speed * ticker.deltaTime;
            }
            else if (selectorDirection === "left") {
                if (this.selector.x < PADDING * 2) selectorDirection = "right";
                else this.selector.x -= this.speed * ticker.deltaTime;
            }
        });
    }
}

function rectsIntersect(
    rect1: { x: number, y: number, width: number, height: number },
    rect2: { x: number, y: number, width: number, height: number }
): boolean {
    return !(rect1.x + rect1.width < rect2.x ||
        rect2.x + rect2.width < rect1.x ||
        rect1.y + rect1.height < rect2.y ||
        rect2.y + rect2.height < rect1.y);
}