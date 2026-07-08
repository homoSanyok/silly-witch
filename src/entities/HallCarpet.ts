import { InteractiveLayer } from "@shared";

export class HallCarpet extends InteractiveLayer {
    init() {
        this.ticker.add(() => {
            if (!this.container) return;

            if (window.KeysListener.keys.e?.pushed && this.isIntersectWithCharacter() && (
                !window.Action.visible &&
                !window.Chat.visible
            )) {
                window.Action.start()
                    .then(success => {
                        if (success instanceof Error) return;

                        const { result } = this.actionResults.selectResult(success);
                        window.Foolishness.level = window.Foolishness.level + result.foolishness;
                        window.Chat.start(result);
                    });
            }
        });
        this.ticker.start();
    }

    constructor() {
        super({
            csvPath: "assets/hall/hall_коврик.csv",
            tilesetPath: "assets/hall/hall.tileset.png",
            actionResultsPath: "hall/carpet",
            lang: "ru"
        });
    }
}