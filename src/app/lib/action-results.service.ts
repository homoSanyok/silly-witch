import { Assets } from "pixi.js";
import { ActionResultsMapT } from "../model/ActionResultsMapT";
import { ActionsResultsPathKeysT } from "../model/ActionsResultsPathKeysT";
import { ACTIONS_RESULTS_PATH_MAP } from "../config/actions-results";

/**
 * Класс для работы с результатами пользовательской активности.
 * Скачивает карту действий и реализует метод выбора конкретного действия.
 */
export class ActionResults {
    private actionReults: ActionResultsMapT = { success: {}, failed: {} };

    selectResult(success: boolean) {
        const results = (success ? this.actionReults.success : this.actionReults.failed);
        const resKeys = Object.keys(results)
            .filter(key => window.Foolishness.level >= results[key].minFoolishness && window.Foolishness.level <= results[key].maxFoolishness);

        const totalChance = resKeys.reduce((sum, key) => sum + results[key].chance, 0);
        let key: string = "";
        let random = Math.random() * totalChance;
        for (const resKey of resKeys) {
            random -= results[resKey].chance;
            if (random <= 0) {
                key = resKey;
                break;
            }
        }

        return { result: results[key], key: key };
    }

    async load(options: { path: ActionsResultsPathKeysT, lang: "en" | "ru" }) {
        const fullPath = ACTIONS_RESULTS_PATH_MAP[options.path].replace("$lang", options.lang);
        this.actionReults = await Assets.load(fullPath);
    }
}