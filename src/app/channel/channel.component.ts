import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SocketService} from "../socket.service";
import {UsersService} from "../users.service";

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  username: string;
  // the messages of the channel
  // messages;

  constructor(private router: Router, private usersService: UsersService, private socketService: SocketService) {
    this.username = localStorage.getItem('username') || "test";
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.socketService.joinChannel();

      // debug only
      this.socketService.logConnection().subscribe(() => {
      });
    }, 100);
  }


}
