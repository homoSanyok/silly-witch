import { ActionResults, ActionsResultsPathKeysT, loadLayer } from "@app";
import { Container, Ticker } from "pixi.js";
import { rectsIntersectOrContain } from "../lib/rectsIntersectOrContain";

export abstract class InteractiveLayer {
    protected readonly ticker = new Ticker();
    private _container?: Container;
    protected readonly actionResults = new ActionResults();

    get container() { return this._container; }

    protected isIntersectWithCharacter() {
        if (!this._container) return false;
        return rectsIntersectOrContain(window.Yennefer.sprite, this._container);
    }

    async load() {
        this._container = await loadLayer(this.options);
        await this.actionResults.load({
            path: this.options.actionResultsPath,
            lang: this.options.lang
        });
    }

    abstract init(): void;

    constructor(private readonly options: {
        csvPath: string,
        tilesetPath: string,
        actionResultsPath: ActionsResultsPathKeysT,
        lang: "ru" | "en"
    }) { }
}