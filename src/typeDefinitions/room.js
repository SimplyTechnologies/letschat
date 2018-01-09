// @flow

export type Room = {
    messageId: string,
    created: number,
    id: string,
    updated: number,
    lastMessage: ?string,
    participants: Array<string>
};