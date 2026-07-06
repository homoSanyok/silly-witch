import { CustomEventMap } from "@app";

export function emitEvent<K extends keyof CustomEventMap>(
    event: K,
    detail?: CustomEventMap[K] extends CustomEvent<infer D> ? D : never
): void {
    window.dispatchEvent(new CustomEvent(event, { detail }));
}