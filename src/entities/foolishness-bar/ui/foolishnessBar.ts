import { getFoolishness, getFoolishnessSpeed, setFoolishness } from "@app";
import { Container, Graphics, Ticker } from "pixi.js";

const PADDING = 4;
const WIDTH = 48 - PADDING * 2;
const HEIGHT = 176 - PADDING * 2;
const FRAME_TIMER_TIMEOUT = 1000;

const ticker = new Ticker();

const FILL_RECT = new Graphics();

export function foolishnessBar(): Promise<Container> {
    return new Promise(resolve => {
        const bar = new Container();
        resolve(bar);

        const background = new Graphics();
        background.roundRect(0, 0, WIDTH + PADDING * 2, HEIGHT + PADDING * 2)
            .fill("#A59805");

        const negativeRect = new Graphics();
        negativeRect.roundRect(0, 0, WIDTH, HEIGHT)
            .fill("#D0021B");

        FILL_RECT.rect(0, 0, WIDTH, 0)
            .fill("#A59805");

        bar.addChild(background);
        bar.addChild(negativeRect);
        bar.addChild(FILL_RECT);

        bar.x = window.innerWidth - bar.width - PADDING;
        bar.y = PADDING;
        negativeRect.x = PADDING;
        negativeRect.y = PADDING;
        FILL_RECT.x = PADDING;
        FILL_RECT.y = PADDING;

        setLevel(0);

        let frameTimer = 0;
        ticker.add(ticker => {
            frameTimer += ticker.deltaMS;

            if (frameTimer > FRAME_TIMER_TIMEOUT) {
                frameTimer = 0;
                setLevel(getFoolishness() + 1 * getFoolishnessSpeed());
            }
        });
        ticker.start();

        window.addEventListener("foolishness-bar:changed", () => setLevel(getFoolishness()));
    });
}

function setLevel(level: number) {
    let fixedLevel = level;
    if (level > 100) fixedLevel = 100;
    else if (level < 0) fixedLevel = 0;

    FILL_RECT.clear();
    const height = HEIGHT * (fixedLevel / 100);
    FILL_RECT.rect(0, 0, WIDTH, HEIGHT - height)
        .fill("#A59805");

    setFoolishness(level);
}