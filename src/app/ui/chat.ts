import { Container, Graphics, TextStyle, Text, Ticker } from "pixi.js";
import { ResultT } from "../model/ActionResultsMapT";

const WIDTH = 500;
const PADDING = 8;

export class Chat {
    private readonly ticker = new Ticker();

    private _container?: Container;
    get container(): Container { return this._container ?? new Container(); }

    get visible() { return this._container?.visible ?? false }
    set visible(value: boolean) {
        if (!this._container) return;
        this._container.visible = value;
    }

    private title = new Text();
    private description = new Text();
    private background = new Graphics();

    private fitToContent() {
        if (!this._container) return;

        this.title.x = PADDING;
        this.title.y = PADDING;

        this.description.x = (WIDTH - this.description.width) / 2;
        this.description.y = PADDING + this.title.height + 15;

        const totalHeight = this.description.y + this.description.height + PADDING;
        this.background.clear();
        this.background.roundRect(0, 0, WIDTH, totalHeight, 10);
        this.background.fill(0x000000);
        this.background.stroke({ color: 0xffffff, width: 2 });

        this._container.x = (window.innerWidth - WIDTH) / 2;
        this._container.y = window.innerHeight - totalHeight - PADDING;
    }

    async load() {
        const container = new Container();

        this.background.roundRect(0, 0, WIDTH, 10, 10);
        this.background.fill(0x000000);
        this.background.stroke({ color: 0xffffff, width: 2 });
        container.addChild(this.background);

        const titleStyle = new TextStyle({
            fontSize: 12,
            fontFamily: 'Arial',
            fill: 0xffffff,
            fontWeight: 'bold',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: WIDTH - PADDING * 2,
        });

        const descriptionStyle = new TextStyle({
            fontSize: 16,
            fontFamily: 'Arial',
            fill: 0xcccccc,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: WIDTH - PADDING * 2,
        });

        this.title.style = titleStyle;
        this.description.style = descriptionStyle;

        container.addChild(this.title);
        container.addChild(this.description);

        this._container = container;
        this.fitToContent();
        this.visible = false;



        return this._container;
    }

    start(options: ResultT): Promise<unknown> {
        this.title.text = options.title;
        this.description.text = options.description;
        this.fitToContent();

        this.visible = true;

        return new Promise(resolve => {
            const handler = () => {
                if (
                    window.KeysListener.keys.space?.pushed ||
                    window.KeysListener.keys.enter?.pushed
                ) {
                    resolve(true);
                    this.visible = false;
                    this.ticker.stop();
                    this.ticker.remove(handler);
                }
            };
            this.ticker.add(handler);
            this.ticker.start();
        });
    }
}