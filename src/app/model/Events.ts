export interface CustomEventMap {
    "action-bar:start": CustomEvent<{ level: number }>;
    "action-bar:space-pressed": CustomEvent<{ success: boolean }>;
    "foolishness:changed": CustomEvent;
}