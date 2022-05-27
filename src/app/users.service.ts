import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../environments/environment";
import {User} from "./User";
import {SocketService} from "./socket.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  onlineUsers: User[] = [];

  constructor(private http: HttpClient, private socketService: SocketService) {
    /*
    this.onlineUsers = [];

    this.socketService.newOnlineUser().subscribe((msg) => {
      this.onlineUsers.push(new User(msg.user_id, msg.first_name, msg.last_name));
    })

    this.socketService.userDisconnects().subscribe((user_id) => {
      if (this.onlineUsers[0] === user_id) {
        this.onlineUsers = [];
      }
    })

    this.socketService.onlineUsers().subscribe((msg) => {
      this.onlineUsers.push(msg);
    })
    */
  }

  // generate the headers for content-type as JSON in a POST request
  genHeadersJSON(): any {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  getOnlineUserId(): string {
    return this.onlineUsers[0].user_id;
  }

  addOnlineUser(id: string, first_name: string, last_name: string) {
    if (this.onlineUsers.length == 0 || this.onlineUsers[0].user_id !== id) {
      this.onlineUsers.push(new User(id, first_name, last_name));
    }
  }

  validateUser(username: string, password: string): any {
    const body = {
      username: username,
      password: password
    };
    return this.http.post(environment.apiURL + '/login', JSON.stringify(body), this.genHeadersJSON());
  }

  createUser(username: string, password: string, firstName: string, lastName: string): any {
    const body = {
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName
    };
    return this.http.post(environment.apiURL + '/register', JSON.stringify(body), this.genHeadersJSON());
  }

  getUserId(firstName: string, lastName: string): any {
    const body = {
      first_name: firstName,
      last_name: lastName
    };
    return this.http.post(environment.apiURL + '/getUserId', JSON.stringify(body), this.genHeadersJSON());
  }
}
