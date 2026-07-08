import { KeysListener } from "../lib/keys-listener.service";
import { Action } from "../ui/action";
import { Chat } from "../ui/chat";
import { Foolishness } from "../ui/foolishness";
import { Yennefer } from "../ui/yennefer";

export interface Singletons {
    Foolishness: Foolishness;
    KeysListener: KeysListener;
    Yennefer: Yennefer;
    Action: Action;
    Chat: Chat;
}