import { Foolishness } from "../lib/foolishness.service";
import { KeysListener } from "../lib/keys-listener.service";
import { Yennefer } from "../ui/yennefer";

export interface Singletons {
    Foolishness: Foolishness;
    KeysListener: KeysListener;
    Yennefer: Yennefer;
}