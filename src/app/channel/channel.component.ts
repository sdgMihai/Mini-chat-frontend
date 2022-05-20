import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SocketService} from "../socket.service";
import {UsersService} from "../users.service";
import {Message} from "../Message";
import {User} from "../User";

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

  }


  // send a new message to other user
  sendMessage() {
    this.socketService.sendMessage(this.usersService.getOnlineUserId(), this.newMessage);
    this.messages.push(new Message(this.user.getName(), this.newMessage, Date.now().toString()));
    this.newMessage = '';
  }

}
