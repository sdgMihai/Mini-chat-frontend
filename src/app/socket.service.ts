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
  private socket;

  constructor() {
    this.socket = io(this.url, {
      extraHeaders: {'Authorization': "Bearer " + localStorage.getItem("jwtToken")}
    });
    this.unreadMessages = [];

    this.logConnection().subscribe(() => {
    });
  }

  public onlineUsers() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('online_users', (msg: { users: User[] }) => {
        console.log("list of users already online: " + JSON.stringify(msg));
        observer.next(msg);
        observer.complete();
      });
    });
  }


  public joinChannel() {
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
      this.socket.emit("unread_messages", "ready", withTimeout((messages: Message[]) => {
        if (messages.length >= 1) {
          unreadMessages.push(...messages);
        }
        observer.next(unreadMessages);
        observer.complete();
      }, () => {
        console.log("timeout!");
      }, 3000));
    });
  }

  public logConnection() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('connect', () => {
        observer.next('connect');
        observer.complete();
      });
    });
  }

  public sendMessage(username: string, message: string) {
    const content = {
      user_id: username,
      message: message,
    };
    this.socket.emit('send_message', content);
  }

  public newOnlineUser() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('new_connection', (msg) => {
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
        observer.next(incoming);
      });
    });
  }
}
