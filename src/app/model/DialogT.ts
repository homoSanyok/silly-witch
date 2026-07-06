export type ActionT = | {
    type: "text";
    content: string;
}
    | {
        type: "action";
        content: { label: string; id: string }[];
    };

export type DialogT = {
    id: string
    title: string
    actions: ActionT[]
}