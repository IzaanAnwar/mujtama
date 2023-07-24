declare module "my-types" {
    export interface Message {
        id: string | number;
        content: string;
        timeStamp: Date | string;
        sender?: User;
        senderId: string;
        chatRoom?: string;
        chatRoomId: string;
    }

    export interface User {
        name: string;
        email: string;
        id: string;
        role: string;
        image?: string;
        chatRoomId: string;
    }

    export type Role = BEGINNER | INTERMEDIATE | ADVANCE | PRO | G;

    export interface Tasks {
        id: number;
        name: string;
        amount: number;
        completed: boolean;
        userId: string;
    }
    export interface ISession {
        user: User;
        expires: Date;
    }
}
