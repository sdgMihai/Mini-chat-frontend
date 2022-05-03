import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {
  }

  // generate the headers for content-type as JSON in a POST request
  genHeadersJSON(): any {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
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

}
