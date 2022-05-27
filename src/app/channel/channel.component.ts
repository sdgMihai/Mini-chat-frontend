import {Component, OnInit} from '@angular/core';
import { formatDate } from "@angular/common";
import {SocketService} from "../socket.service";
import {UsersService} from "../users.service";
import { UserModel } from '../model/user.model';
import { MessageModel } from '../model/message.model';
import { MessageToSendModel } from '../model/message-to-send.model';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  socket: any;

  thisUser!: UserModel;
  users: Array<UserModel> = [];
  messagesWithUsers: Array<Array<MessageModel>> = [];

  roomToCreate: boolean = false;
  firstName!: string;
  lastName!: string;

  constructor(private usersService: UsersService, private socketService: SocketService) {
    if (localStorage.getItem('user') != null) {
      // @ts-ignore
      const userJSON = JSON.parse(localStorage.getItem('user'));

      console.log('thisUser: ' + userJSON.user_id)
      this.thisUser = {
        id: userJSON.user_id,
        firstName: userJSON.first_name,
        lastName: userJSON.last_name,
      };
    }
  }

  ngOnInit(): void {
    this.socket = this.socketService.getSocket();

    this.socketService.joinChannel(this.socket).subscribe((messages) => {
      if (messages) {
        messages.forEach((message: any) => this.addMessage(message));
      }
    });

    this.socketService.getMessage(this.socket).subscribe((message) => this.addMessage(message));
  }

  private addMessage(message: any): void {
    let senderIdx = this.users.findIndex((user: UserModel) => user.id === message.sender_id);
    if (senderIdx === -1) {
      this.users.push(
        {
          id: message.sender_id,
          firstName: message.first_name,
          lastName: message.last_name,
        }
      );
      this.messagesWithUsers.push([]);

      senderIdx = this.users.length - 1;
    }

    this.messagesWithUsers[senderIdx].push(
      {
        sender: {
          id: message.sender_id,
          firstName: message.first_name,
          lastName: message.last_name,
        },
        sentAt: formatDate(message.sent_at, 'dd/MM/yyyy hh:mm', 'en-US'),
        data: message.data,
      }
    );
  }

  deleteRoom(receiverId: string): void {
    const receiverIdx = this.users.findIndex((user: UserModel) => user.id === receiverId);
    if (receiverIdx > -1) {
        this.users.splice(receiverIdx, 1);
        this.messagesWithUsers.splice(receiverIdx, 1);
    }
  }

  sendMessage(messageToSend: MessageToSendModel): void {
    if (!messageToSend.dataToSend) {
      return;
    }

    const receiverIdx = this.users.findIndex((user: UserModel) => user.id === messageToSend.receiverId);
    if (receiverIdx > -1) {
      console.log('receiver: ' + messageToSend.receiverId)
      this.socketService.sendMessage(this.socket, messageToSend.receiverId, messageToSend.dataToSend);
      this.messagesWithUsers[receiverIdx].push(
        {
          sender: this.thisUser,
          sentAt: formatDate(Date.now().toString(), 'dd/MM/yyyy hh:mm', 'en-US'),
          data: messageToSend.dataToSend,
        }
      );
    }
  }

  onCreateRoom(): void {
    if (!this.firstName || !this.lastName) {
      return;
    }

    if (this.firstName === this.thisUser.firstName && this.lastName === this.thisUser.lastName) {
      return;
    }

    this.usersService.getUserId(this.firstName, this.lastName).subscribe(
      (data: any) => {
        const userId = data.user_id;

        this.users.push(
          {
            id: userId,
            firstName: this.firstName,
            lastName: this.lastName,
          }
        );
        this.messagesWithUsers.push([]);

        this.roomToCreate = false;
      },
      (err: { name: any; }) => {
        console.error(err.name);
      },
    );
  }
}
