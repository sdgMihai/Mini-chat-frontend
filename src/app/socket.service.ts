import { Injectable } from '@angular/core';
import {Observable, Observer} from "rxjs";
import {environment} from "../environments/environment";
import { io, Socket} from "socket.io-client";
import {DefaultEventsMap} from '@socket.io/component-emitter';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = environment.socketURL;
  private socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

  constructor() {

  }

  public joinChannel() {
    this.socket = io(this.url, {
      extraHeaders: { 'Authorization' : "Bearer " + localStorage.getItem("jwtToken")}
      // auth: {
      //   token: (cb: (arg0: { token: any; }) => void) => {
      //     cb({ token: localStorage['jwtToken'] })
      // }}
    });
  }


  public logConnection = () => {
    return new Observable((observer: Observer<any>) => {

      // @ts-ignore
      this.socket.on('connect', () => {
        console.log('The client has connected with the server. Username: ' + localStorage.getItem('username'));
        observer.next('connect');
        observer.complete();
      });
    });
  }
}
