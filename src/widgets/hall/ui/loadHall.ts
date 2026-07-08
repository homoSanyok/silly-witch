import { Container, Polygon } from "pixi.js";
import { fitToScreen } from "@shared";
import { loadLayer } from "@app";
import { loadHallCarpet } from "@entities";

const HALL_PATH_PREFIX = "assets/hall";
const TILESET_PATH = HALL_PATH_PREFIX + "/hall.tileset.png";
const POLYGON = new Polygon([
    2 * 32, 5 * 32,   // 64, 160
    2 * 32, 8 * 32,   // 64, 256
    0, 8 * 32,        // 0, 256
    0, 14 * 32,       // 0, 448
    3 * 32, 14 * 32,  // 96, 448
    3 * 32, 13 * 32,  // 96, 416
    7 * 32, 13 * 32,  // 224, 416
    7 * 32, 15 * 32,  // 224, 480
    12 * 32, 15 * 32, // 384, 480
    13 * 32, 15 * 32, // 384, 448
    13 * 32, 14 * 32, // 416, 448
    13 * 32, 9 * 32,  // 416, 288
    8 * 32, 9 * 32,   // 256, 288
    8 * 32, 5 * 32    // 256, 160
]);

export async function loadHall() {
    const container = new Container();

    window.Yennefer.polygon = POLYGON;

    const [
        floor,
        carpet,
        walls,
        entranceKitchen,
        entranceHallBath,
        bar,
        barStuff,
        wallStuff,
        cabinet,
        cleaningStuff,
        lex,
        chorni,
        top,
        compod,
        bathroomDoorjamb,
    ] = await Promise.all([
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_пол.csv`, tilesetPath: TILESET_PATH }),
        loadHallCarpet(),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_стены.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_вход кухня.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_входы зал ванна.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_бар.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_херь на баре.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_херь на стену.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_шкаф.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_уборочная херь.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_лекс.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_чорни.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_верхушка.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_комрод.csv`, tilesetPath: TILESET_PATH }),
        loadLayer({ csvPath: `${HALL_PATH_PREFIX}/hall_косяк_у_ванной.csv`, tilesetPath: TILESET_PATH }),
    ]);

    container.addChild(floor);                     // пол (самый нижний)
    container.addChild(carpet);                    // коврик
    container.addChild(walls);                     // стены
    container.addChild(entranceHallBath);          // входы зал ванна
    container.addChild(entranceKitchen);           // вход кухня
    container.addChild(bathroomDoorjamb);          // косяк у ванной
    container.addChild(bar);                       // бар
    container.addChild(lex);                       // лекс
    container.addChild(window.Yennefer.sprite); // собака
    container.addChild(cleaningStuff);             // уборочная херь
    container.addChild(compod);                    // комрод
    container.addChild(barStuff);                  // херь на баре
    container.addChild(cabinet);                   // шкаф
    container.addChild(wallStuff);                 // херь на стену
    container.addChild(chorni);                    // чорни
    container.addChild(top);                       // верхушка (самый верхний)

    fitToScreen(container);

    return container;
}