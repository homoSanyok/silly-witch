export type SuccessedKeysT = "to-smell";
export type FailedKeysT = "to-lie" | "to-lie:washed" | "gnaw";

export type ActionT = {
    foolishness: number;
    description: string;
}

export type InteractionResultMapT = {
    "success": {
        [key in SuccessedKeysT]: ActionT;
    };
    "failed": {
        [key in FailedKeysT]: ActionT;
    };
};