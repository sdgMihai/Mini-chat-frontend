import { UserModel } from "./user.model";

export interface MessageModel {
    sender: UserModel;
    sentAt: string;
    data: string;
}
