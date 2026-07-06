declare global {
    interface WindowEventMap {
        'action-bar:start': CustomEvent<{ level: number }>;
        'action-bar:space-pressed': CustomEvent<{ success: boolean }>;
    }
}