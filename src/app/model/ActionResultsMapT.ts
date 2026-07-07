export type ResultT = {
    foolishness: number;
    description: string;
}

export type ActionResultsMapT = {
    "success": {
        [key: string]: ResultT;
    };
    "failed": {
        [key: string]: ResultT;
    };
};