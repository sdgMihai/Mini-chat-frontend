import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SocketService} from "../socket.service";
import {UsersService} from "../users.service";
import {Message} from "../Message";
import {User} from "../User";
import { UserModel } from '../model/user.model';
import { MessageModel } from '../model/message.model';
import { MessageToSendModel } from '../model/message-to-send.model';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  user: User;
  // the messages of the channel
  messages: Message[];
  newMessage: string;

  thisUser!: UserModel;
  users: Array<UserModel> = [];
  messagesWithUsers: Array<Array<MessageModel>> = [];

  roomToCreate: boolean = false;
  firstName!: string;
  lastName!: string;

  constructor(private router: Router, private usersService: UsersService, private socketService: SocketService) {
    if (localStorage.getItem('user') != null) {
      // @ts-ignore
      const userJSON = JSON.parse(localStorage.getItem('user'));
      this.user = new User(undefined, userJSON.first_name, userJSON.last_name);
    } else {
      this.user = new User(undefined, undefined, undefined);
    }
    this.newMessage = '';

    this.messages = [];
  }

  ngOnInit(): void {
    this.socketService.getMessage().subscribe((message) => {
        const msg = new Message(message.first_name + " " + message.last_name
          , message.data
          , message.sent_at);

        this.usersService.addOnlineUser(message.sender_id, message.first_name, message.last_name);
        this.messages.push(msg);
      }
    )

    this.socketService.joinChannel().subscribe(
      (messages) => {
        if (messages) {
          this.messages.push(...messages);
        }
      }
    );

    // TODO: fill dynamically
    this.thisUser = {
      id: '',
      firstName: 'Armand',
      lastName: 'Preda',
    };
    this.users = [
      {
        id: '1cfbb874-f402-43cf-9826-77e45a136bd4',
        firstName: 'Adrian',
        lastName: 'Stefan',
      },
      {
        id: "942946a2-911c-4873-895a-9d2ab5719438",
        firstName: "Mihai",
        lastName: "Gheoace",
      },
    ];
    this.messagesWithUsers = [
      [
        {
          sender: this.thisUser,
          sentAt: '11:03',
          data: 'buna',
        },
        {
          sender: this.users[0],
          sentAt: '11:04',
          data: 'buna',
        },
      ],
      [
        {
          sender: this.users[1],
          sentAt: '12:27',
          data: 'buna',
        },
        {
          sender: this.thisUser,
          sentAt: '12:28',
          data: 'buna',
        },
        {
          sender: this.users[1],
          sentAt: '12:29',
          data: 'ce faci?',
        },
        {
          sender: this.thisUser,
          sentAt: '12:30',
          data: 'bine',
        },
        {
          sender: this.thisUser,
          sentAt: '12:31',
          data: 'tu?',
        },
        {
          sender: this.users[1],
          sentAt: '12:32',
          data: 'bine',
        },
        {
          sender: this.users[1],
          sentAt: '12:33',
          data: 'mesaj lung lung lung lung lung lung lung lung lung lung lung lung lung lung lung',
        },
      ],
    ]
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

    this.socketService.sendMessage(messageToSend.receiverId, messageToSend.dataToSend);
    const receiverIdx = this.users.findIndex((user: UserModel) => user.id === messageToSend.receiverId);
    if (receiverIdx > -1) {
      this.messagesWithUsers[receiverIdx].push(
        {
          sender: this.thisUser,
          sentAt: Date.now().toString(),
          data: messageToSend.dataToSend,
        }
      );
    }
  }

  onCreateRoom(): void {
    if (!this.firstName || !this.lastName) {
      return;
    }

    this.roomToCreate = false;
    this.users.push(
      {
        id: '',
        firstName: this.firstName,
        lastName: this.lastName,
      }
    );
    this.messagesWithUsers.push([]);
  }

  /* send a new message to other user
  sendMessage() {
    this.socketService.sendMessage(this.usersService.getOnlineUserId(), this.newMessage);
    this.messages.push(new Message(this.user.getName(), this.newMessage, Date.now().toString()));
    this.newMessage = '';
  }
  */
}
