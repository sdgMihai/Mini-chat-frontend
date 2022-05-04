import {Injectable} from '@angular/core';
import {Observable, Observer} from "rxjs";
import {environment} from "../environments/environment";
import {io} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = environment.socketURL;
  private socket = io(this.url, {
    extraHeaders: {'Authorization': "Bearer " + localStorage.getItem("jwtToken")}
  });

  constructor() {

  }

  public joinChannel() {
    let unreadMessages: any[];
    return new Observable((observer: Observer<any>) => {
      this.socket.on("unread_messages", (messages) => {
        unreadMessages = messages;
      })
      observer.next(unreadMessages);
      observer.complete();
    })
  }

  public logConnection() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('connect', () => {
        console.log('The client has connected with the server. Username: ' + localStorage.getItem('username'));
        observer.next('connect');
        observer.complete();
      });
    });
  }

  public sendMessage(username: string, message: string) {
    console.log('Sending: ' + message);
    const content = {
      user_id: username,
      message: message,
    };
    this.socket.emit('send_message', content);
  }

  public onlineUsers() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('new_connection', (msg) => {
        console.log("new connection msg: " + JSON.stringify(msg));
        observer.next(msg);

      });
    });
  }

  public userDisconnects() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('user_disconnect', (user_id) => {
        observer.next(user_id);
        observer.complete();
      });
    });
  }

  public getMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('receive_message', (incoming: { sender_id: string, data: string, sent_at: any }) => {
        console.log("incoming msg: " + JSON.stringify(incoming));
        observer.next(incoming);
      });
    });
  }


}



