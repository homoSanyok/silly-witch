import { ActionResults, loadLayer } from "@app";
import { emitEvent } from "@shared";
import { Container, ContainerChild, Ticker } from "pixi.js";

const ticker = new Ticker();

export function loadHallCarpet(): Promise<Container<ContainerChild>> {
    return new Promise(async (resolve) => {
        const carpet = await loadLayer({ csvPath: "assets/hall/hall_коврик.csv", tilesetPath: "assets/hall/hall.tileset.png" });
        resolve(carpet);

        const actionResults = new ActionResults();
        await actionResults.load("hall/carpet", "ru");

        /** 
         * Is user in interactive game mode.
         * If true the mini game launched.
         */
        let isInteraction = false;
        ticker.add(() => {
            if (window.KeysListener.keys.e?.pushed && rectsIntersectOrContain(window.Yennefer.character, carpet) && !isInteraction) {
                isInteraction = true;

                emitEvent("action-bar:start", { level: 0 });
            }
        });
        ticker.start();

        window.addEventListener("action-bar:space-pressed", event => {
            isInteraction = false;

            const { result } = actionResults.selectResult(event.detail.success);
            window.Foolishness.level = (window.Foolishness.level + result.foolishness);
            emitEvent("foolishness:changed");
        });
    });
}

function rectsIntersectOrContain(
    rect1: { x: number, y: number, width: number, height: number },
    rect2: { x: number, y: number, width: number, height: number }
): boolean {
    // Проверяем, есть ли общие точки (включая касание)
    const hasIntersection = !(rect1.x + rect1.width < rect2.x ||
        rect2.x + rect2.width < rect1.x ||
        rect1.y + rect1.height < rect2.y ||
        rect2.y + rect2.height < rect1.y);

    // Проверяем, лежит ли rect1 внутри rect2
    const rect1InsideRect2 = rect1.x >= rect2.x &&
        rect1.y >= rect2.y &&
        rect1.x + rect1.width <= rect2.x + rect2.width &&
        rect1.y + rect1.height <= rect2.y + rect2.height;

    // Проверяем, лежит ли rect2 внутри rect1
    const rect2InsideRect1 = rect2.x >= rect1.x &&
        rect2.y >= rect1.y &&
        rect2.x + rect2.width <= rect1.x + rect1.width &&
        rect2.y + rect2.height <= rect1.y + rect1.height;

    return hasIntersection || rect1InsideRect2 || rect2InsideRect1;
}