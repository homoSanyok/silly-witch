export interface CustomEventMap {
    "action-bar:start": CustomEvent<{ level: number }>;
    "action-bar:space-pressed": CustomEvent<{ success: boolean }>;
    "foolishness-bar:changed": CustomEvent;
}

declare global {
    interface WindowEventMap extends CustomEventMap { }
}