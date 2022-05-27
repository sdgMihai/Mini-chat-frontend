import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UsersService} from '../users.service';
import {User} from "../User";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  username = '';
  password = '';

  // create new user fields
  newUserUsername = '';
  newUserPassword = '';
  newUserFirstName = '';
  newUserLastName = '';

  myLogin: number | undefined;

  constructor(private router: Router, private usersService: UsersService) {
  }


  ngOnInit(): void {
    localStorage.clear();
    this.myLogin = 0;
  }

  login(): void {
    if (this.username === '') {
      alert('Username field cannot be empty');
      return;
    }
    if (this.password === '') {
      alert('Password field cannot be empty');
      return;
    }

    // check password via POST request
    this.usersService.validateUser(this.username, this.password).subscribe(
      (data: { accessToken: string; user_id: string; first_name: string; last_name: string }) => {
        console.log('Received data from validation');
        console.log(data);
        if (data) {
          localStorage.setItem('user', JSON.stringify(new User(data.user_id, data.first_name, data.last_name)));
          localStorage.setItem('jwtToken', data.accessToken);
          this.router.navigateByUrl('/channel');
        } else {
          alert('Invalid username or password');
        }
      },
      () => {
        console.error("error validating user credentials");
      },
      () => {
        console.log('completed validation');
      }
    );
  }

  // create a new user
  createUser(): any {
    if (this.newUserUsername === '') {
      alert('Username field cannot be blank');
      return;
    }
    if (this.newUserPassword === '') {
      alert('Password field cannot be blank');
      return;
    }
    if (this.newUserFirstName === '') {
      alert('First Name field cannot be blank');
      return;
    }
    if (this.newUserLastName === '') {
      alert('Last Name field cannot be blank');
      return;
    }

    console.log('Creating new user!');
    this.usersService.createUser(this.newUserUsername, this.newUserPassword, this.newUserFirstName, this.newUserLastName).subscribe(
      (data: any) => {
        localStorage.setItem('user', JSON.stringify(new User(undefined, data.first_name, data.last_name)));
        localStorage.setItem('jwtToken', data.accessToken);
        this.router.navigateByUrl('/channel');
      },
      (err: { name: any; }) => {
        console.error(err.name);
      },
      () => {
        this.newUserFirstName = '';
        this.newUserPassword = '';
        this.newUserUsername = '';
      }
    );
  }

}
