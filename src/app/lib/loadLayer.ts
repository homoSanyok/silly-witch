import { Assets, Container, Rectangle, Sprite, Texture } from "pixi.js";
import { TILE_SIZE } from "@app";

export async function loadLayer(options: { csvPath: string, tilesetPath: string }) {
    const [csvText, baseTexture] = await Promise.all([
        Assets.load<string>(options.csvPath),
        Assets.load<Texture>(options.tilesetPath)
    ]);

    baseTexture.source.scaleMode = 'nearest';
    baseTexture.source.style.update();

    const tilesetCols = Math.floor(baseTexture.width / TILE_SIZE);
    const layerContainer = new Container();

    const matrix = csvText.trim().split('\n')
        .filter(row => row.trim().length > 0)
        .map(row => (
            row.split(',')
                .map(col => parseInt(col.trim()))
        ));

    const rows = trimMatrix(matrix);

    for (let y = 0; y < rows.length; y++) {
        const cols = rows[y];

        for (let x = 0; x < cols.length; x++) {
            const tileId = cols[x];
            if (isNaN(tileId) || tileId === -1) continue;

            const tileIndex = tileId;
            const srcX = (tileIndex % tilesetCols) * TILE_SIZE;
            const srcY = Math.floor(tileIndex / tilesetCols) * TILE_SIZE;

            const tileTexture = new Texture({
                source: baseTexture.source,
                frame: new Rectangle(srcX, srcY, TILE_SIZE, TILE_SIZE)
            });

            tileTexture.source.scaleMode = 'nearest';
            tileTexture.source.style.update();

            const tileSprite = new Sprite(tileTexture);

            // В v8 используем Math.round вместо roundPixels
            tileSprite.x = Math.round(x * TILE_SIZE);
            tileSprite.y = Math.round(y * TILE_SIZE);

            layerContainer.addChild(tileSprite);
        }
    }

    const topLeft = findSubmatrixPosition(matrix, rows);
    if (topLeft) {
        layerContainer.x = topLeft.col * TILE_SIZE;
        layerContainer.y = topLeft.row * TILE_SIZE;
    }

    return layerContainer;
}

function trimMatrix(matrix: number[][]): number[][] {
    if (matrix.length === 0 || matrix[0].length === 0) return matrix;
    const rows = matrix.length;
    const cols = matrix[0].length;

    // Находим верхнюю границу
    let top = 0;
    while (top < rows && matrix[top].every(v => v === -1)) top++;
    if (top === rows) return []; // все строки пусты

    // Находим нижнюю границу
    let bottom = rows - 1;
    while (bottom >= top && matrix[bottom].every(v => v === -1)) bottom--;

    // Находим левую границу
    let left = 0;
    while (left < cols) {
        let allEmpty = true;
        for (let r = top; r <= bottom; r++) {
            if (matrix[r][left] !== -1) { allEmpty = false; break; }
        }
        if (!allEmpty) break;
        left++;
    }

    // Находим правую границу
    let right = cols - 1;
    while (right >= left) {
        let allEmpty = true;
        for (let r = top; r <= bottom; r++) {
            if (matrix[r][right] !== -1) { allEmpty = false; break; }
        }
        if (!allEmpty) break;
        right--;
    }

    // Вырезаем подматрицу
    const result: number[][] = [];
    for (let r = top; r <= bottom; r++) {
        const row = matrix[r].slice(left, right + 1);
        result.push(row);
    }
    return result;
}

function findSubmatrixPosition(big: number[][], small: number[][]): { row: number, col: number } | null {
    const bigRows = big.length;
    const bigCols = big[0]?.length || 0;
    const smallRows = small.length;
    const smallCols = small[0]?.length || 0;

    if (bigRows < smallRows || bigCols < smallCols) return null;

    for (let r = 0; r <= bigRows - smallRows; r++) {
        for (let c = 0; c <= bigCols - smallCols; c++) {
            let match = true;
            for (let i = 0; i < smallRows; i++) {
                for (let j = 0; j < smallCols; j++) {
                    if (big[r + i][c + j] !== small[i][j]) {
                        match = false;
                        break;
                    }
                }
                if (!match) break;
            }
            if (match) return { row: r, col: c };
        }
    }
    return null;
}