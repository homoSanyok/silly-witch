import { KeysListener } from "../lib/keys-listener.service";
import { Action } from "../ui/action";
import { Chat } from "../ui/chat";
import { Boredom } from "../ui/boredom";
import { Yennefer } from "../ui/yennefer";

export interface Singletons {
    Boredom: Boredom;
    KeysListener: KeysListener;
    Yennefer: Yennefer;
    Action: Action;
    Chat: Chat;
}