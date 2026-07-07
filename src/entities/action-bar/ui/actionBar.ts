import { emitEvent } from "@shared";
import { Container, Graphics, Ticker } from "pixi.js";

const PADDING = 4;
const HEIGHT = 96 - PADDING * 2;
const WIDTH = 352 - PADDING * 2;
const DISABLING_BAR_AFTER_FINISH_TIMEOUT = 600;

const ticker = new Ticker();

export function loadActionBar(): Promise<Container> {
    return new Promise(async (resolve) => {
        const bar = new Container();
        resolve(bar);

        const background = new Graphics();
        background.roundRect(0, 0, WIDTH + PADDING * 2, HEIGHT + PADDING * 2)
            .fill("#A59805");

        const negativeRect = new Graphics();
        negativeRect.roundRect(0, 0, WIDTH, HEIGHT)
            .fill("#D0021B");

        const positiveRectsContainer = new Container();
        positiveRectsContainer.x = negativeRect.x;
        positiveRectsContainer.y = negativeRect.y;

        const selector = new Graphics();
        selector.roundRect(0, 0, 4, HEIGHT)
            .fill("#C2B306")

        bar.addChild(background);
        bar.addChild(negativeRect);
        bar.addChild(positiveRectsContainer);
        bar.addChild(selector);

        bar.x = window.innerWidth / 2 - bar.width / 2;
        bar.y = window.innerHeight * .05;
        negativeRect.x = PADDING;
        negativeRect.y = PADDING;
        selector.x = PADDING * 2;
        selector.y = PADDING;

        bar.visible = false;

        const SELECTOR_SPEED = 5;

        let selectorDirection: "right" | "left" = "left";
        ticker.add(ticker => {
            if (selectorDirection === "right") {
                if ((selector.x + PADDING) > WIDTH) selectorDirection = "left";
                else selector.x += SELECTOR_SPEED * ticker.deltaTime;
            }
            else if (selectorDirection === "left") {
                if (selector.x < PADDING * 2) selectorDirection = "right";
                else selector.x -= SELECTOR_SPEED * ticker.deltaTime;
            }
        });

        window.addEventListener("action-bar:start", () => {
            if (bar.visible) return;

            bar.visible = true;
            ticker.start();

            simpleCenterLine(bar, selector);
        });

        window.addEventListener("action-bar:space-pressed", () => {
            bar.visible = false;
        });
    });
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

function simpleCenterLine(container: Container, selector: Graphics) {
    const line = new Graphics()
        .rect(0, 0, 24, HEIGHT)
        .fill("#63B208");

    container.addChild(line);
    container.setChildIndex(line, 3);

    line.x = WIDTH / 2 - line.width / 2;
    line.y = PADDING;

    const handler = () => {
        if (window.KeysListener.keys.space?.pushed) {
            ticker.stop();
            setTimeout(
                () => emitEvent("action-bar:space-pressed", { success: rectsIntersect(line, selector) }),
                DISABLING_BAR_AFTER_FINISH_TIMEOUT
            );
            ticker.remove(handler);
        }
    };
    ticker.add(handler);
}