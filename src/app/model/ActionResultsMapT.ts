export type ResultT = {
    foolishness: number;
    description: string;
    stupidity: number;
    chance: number;
    minFoolishness: number;
    maxFoolishness: number;
    title: string;
}

export type ActionResultsMapT = {
    "success": {
        [key: string]: ResultT;
    };
    "failed": {
        [key: string]: ResultT;
    };
};