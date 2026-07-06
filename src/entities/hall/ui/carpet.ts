import { getFoolishness, KeysT, loadLayer, setFoolishness } from "@app";
import { emitEvent } from "@shared";
import { AnimatedSprite, Container, ContainerChild, Ticker } from "pixi.js";
import { FailedKeysT, InteractionResultMapT, SuccessedKeysT, ActionT } from "../model/InteractionResultMapT";

const INTERACTION_RESULT_MAP: InteractionResultMapT = {
    "success": {
        "to-smell": {
            foolishness: -10,
            description: "Вы решили понюхать ковёр. Он пахнет... грязью."
        }
    },
    "failed": {
        "to-lie": {
            foolishness: 10,
            description: "Вы решили полежать на грязном ковре."
        },
        "to-lie:washed": {
            foolishness: 10,
            description: "Вы решили полежать на грязном ковре. Тот факт, что шерсть ещё не до конца высохла, не смущает вас."
        },
        "gnaw": {
            foolishness: 10,
            description: "Вы решили погрызть ковёр. На удивление крайне интересное занятие."
        }
    }
}

const ticker = new Ticker();

export async function carpet(yennefer: AnimatedSprite, keys: KeysT): Promise<Container<ContainerChild>> {
    return new Promise(async (resolve) => {
        const carpet = await loadLayer({ csvPath: "assets/hall/hall_коврик.csv", tilesetPath: "assets/hall/hall.tileset.png" });
        resolve(carpet);

        /** 
         * Is user in interactive game mode.
         * If true the mini game launched.
         */
        let isInteraction = false;
        ticker.add(() => {
            if (keys.e?.pushed && rectsIntersectOrContain(yennefer, carpet) && !isInteraction) {
                isInteraction = true;

                emitEvent("action-bar:start", { level: 0 });
            }
        });
        ticker.start();

        window.addEventListener("action-bar:space-pressed", event => {
            isInteraction = false;

            let action: ActionT = {
                foolishness: .1,
                description: ""
            };

            const result = event.detail.success ? INTERACTION_RESULT_MAP.success : INTERACTION_RESULT_MAP.failed;
            const actionKeys = Object.keys(result);

            // Правильный расчёт: от 0 до actionKeys.length - 1
            const resActionKeyIndex = Math.floor(Math.random() * actionKeys.length);
            const resActionKey = actionKeys[resActionKeyIndex] as SuccessedKeysT | FailedKeysT;

            // Проверяем и получаем результат
            if (event.detail.success && resActionKey in INTERACTION_RESULT_MAP.success) {
                action = INTERACTION_RESULT_MAP.success[resActionKey as SuccessedKeysT];
            } else if (!event.detail.success && resActionKey in INTERACTION_RESULT_MAP.failed) {
                action = INTERACTION_RESULT_MAP.failed[resActionKey as FailedKeysT];
            }

            setFoolishness(getFoolishness() + action.foolishness, { emitEvent: true });
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