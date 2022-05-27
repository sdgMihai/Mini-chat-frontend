import {Injectable} from '@angular/core';
import {Observable, Observer} from "rxjs";
import {environment} from "../environments/environment";
import {io} from "socket.io-client";
import {Message} from "./Message";
import {User} from "./User";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  unreadMessages: Message[];
  private url = environment.socketURL;

  constructor() {
    this.unreadMessages = [];

    /*
    this.logConnection().subscribe(() => {
    });
    */
  }

  public getSocket() {
    return io(this.url, {
      extraHeaders: {'Authorization': "Bearer " + localStorage.getItem("jwtToken")}
    });
  }

  public onlineUsers(socket: any) {
    return new Observable((observer: Observer<any>) => {
      socket.on('online_users', (msg: { users: User[] }) => {
        console.log("list of users already online: " + JSON.stringify(msg));
        observer.next(msg);
        observer.complete();
      });
    });
  }


  public joinChannel(socket: any) {
    let unreadMessages: any[];
    const withTimeout = (onSuccess: { (messages: Message[]): void; apply?: any; }
      , onTimeout: { (): void; (): void; }
      , timeout: number) => {
      let called = false;

      const timer = setTimeout(() => {
        if (called) return;
        called = true;
        if (onTimeout) {
          onTimeout();
        }
      }, timeout);

      return (...args: any) => {
        if (called) return;
        called = true;
        clearTimeout(timer);
        onSuccess.apply(this, args);
      }
    }
    return new Observable((observer: Observer<any>) => {
      socket.on('unread_messages', (incoming: any) => {
        observer.next(incoming);
      });
    });
  }

  public logConnection(socket: any) {
    return new Observable((observer: Observer<any>) => {
      socket.on('connect', () => {
        observer.next('connect');
        observer.complete();
      });
    });
  }

  public sendMessage(socket: any, username: string, message: string) {
    const content = {
      user_id: username,
      message: message,
    };
    socket.emit('send_message', content);
  }

  public newOnlineUser(socket: any) {
    return new Observable((observer: Observer<any>) => {
      socket.on('new_connection', (msg: any) => {
        observer.next(msg);
      });
    });
  }

  public userDisconnects(socket: any) {
    return new Observable((observer: Observer<any>) => {
      socket.on('user_disconnect', (user_id: any) => {
        observer.next(user_id);
        observer.complete();
      });
    });
  }

  public getMessage(socket: any) {
    return new Observable((observer: Observer<any>) => {
      socket.on('receive_message', (incoming: { sender_id: string, data: string, sent_at: any }) => {
        observer.next(incoming);
      });
    });
  }
}
