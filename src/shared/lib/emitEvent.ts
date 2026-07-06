export function emitEvent<K extends keyof WindowEventMap>(
    event: K,
    detail: WindowEventMap[K] extends CustomEvent<infer D> ? D : never
): void {
    window.dispatchEvent(new CustomEvent(event, { detail }));
}