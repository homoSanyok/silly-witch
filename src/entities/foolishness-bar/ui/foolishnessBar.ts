import { KeysT } from "@app";
import { Container, Graphics, Ticker } from "pixi.js";

const PADDING = 4;
const WIDTH = 48 - PADDING * 2;
const HEIGHT = 176 - PADDING * 2;

const ticker = new Ticker();

export function foolishnessBar(keys: KeysT): Promise<Container> {
    return new Promise(resolve => {
        const bar = new Container();
        resolve(bar);

        const background = new Graphics();
        background.roundRect(0, 0, WIDTH + PADDING * 2, HEIGHT + PADDING * 2)
            .fill("#A59805");

        const negativeRect = new Graphics();
        negativeRect.roundRect(0, 0, WIDTH, 0)
            .fill("#D0021B");

        bar.addChild(background);
        bar.addChild(negativeRect);

        bar.x = window.innerWidth - bar.width - PADDING;
        bar.y = PADDING;
        negativeRect.scale.y = -1;
        negativeRect.x = PADDING;
        negativeRect.y = HEIGHT + PADDING;

    });
}

function setLevel(rect: Graphics, level: number) {
    let fixedLevel = level;
    if (level > 100) fixedLevel = 100;
    else if (level < 0) fixedLevel = 0;

    rect.roundRect(0, 0, WIDTH, HEIGHT * (fixedLevel / 100))
        .fill("#D0021B");
}