import { Assets } from "pixi.js";
import { ActionResultsMapT } from "../model/ActionResultsMapT";

type pathKeyT = "hall/carpet";
const PATH_MAP: Record<pathKeyT, string> = {
    "hall/carpet": "actions-results/$lang/hall/carpet.json"
}

/**
 * Класс для работы с результатами пользовательской активности.
 * Скачивает карту действий и реализует метод выбора конкретного действия.
 */
export class ActionResults {
    private actionReults: ActionResultsMapT = { success: {}, failed: {} };

    selectResult(success: boolean) {
        const results = success ? this.actionReults.success : this.actionReults.failed;
        const resKeys = Object.keys(results);
        const key = resKeys[Math.floor(Math.random() * resKeys.length)];

        return { result: results[key], key: key };
    }

    async load(path: pathKeyT, lang: "en" | "ru" = "ru") {
        const fullPath = PATH_MAP[path].replace("$lang", lang);
        this.actionReults = await Assets.load(fullPath);
    }
}