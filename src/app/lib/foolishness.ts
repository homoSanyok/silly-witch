const STORAGE_PATH = "foolishness";

export function getFoolishness(): number {
    const level = localStorage.getItem(STORAGE_PATH) ?? "0";
    return Number(level);
}

export function setFoolishness(level: number) {
    localStorage.setItem(STORAGE_PATH, level.toString());
}