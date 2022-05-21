import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserModel } from '../model/user.model';
import { MessageModel } from '../model/message.model';
import { MessageToSendModel } from '../model/message-to-send.model';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
    @Input()
    receiver!: UserModel;
    @Input()
    messages!: Array<MessageModel>;
    @Output()
    deleteRoomHandler: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    sendMessageHandler: EventEmitter<MessageToSendModel> = new EventEmitter<MessageToSendModel>();

    dataToSend: string = '';

    ngOnInit(): void {
        console.log('receiver: ' + this.receiver);
        console.log('messages: ' + this.messages);
    }

    isMessageSentBySender(message: MessageModel): boolean {
        return message.sender.id !== this.receiver.id;
    }

    onDeleteRoom(): void {
        this.deleteRoomHandler.emit(this.receiver.id);
    }

    onSendMessage(): void {
        this.sendMessageHandler.emit({
            receiverId: this.receiver.id,
            dataToSend: this.dataToSend,
        });
    }
}
