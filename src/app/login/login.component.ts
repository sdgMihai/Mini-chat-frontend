import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UsersService} from '../users.service';

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

  constructor(private router: Router, private usersService: UsersService) { }


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
        (data: { accessToken: string; first_name: string; last_name: string}) => {
        console.log('Received data from validation');
        console.log(data);
        if (data) {
          localStorage.setItem('username', this.username);
          localStorage.setItem('firstName', data.first_name);
          localStorage.setItem('lastName', data.last_name);
          this.router.navigateByUrl('/channel');
          // store jwt
          localStorage.setItem('jwtToken', data.accessToken);
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
    // console.log(this.newUserUsername, this.newUserPassword, this.newUserEmail);
    this.usersService.createUser(this.newUserUsername, this.newUserPassword, this.newUserFirstName, this.newUserLastName).subscribe(
        (data: any) => {
          localStorage.setItem('username', this.username);
          localStorage.setItem('firstName', data.first_name);
          localStorage.setItem('lastName', data.last_name);
          localStorage.setItem('jwtToken', data.accessToken);
          this.router.navigateByUrl('/channel');
      },
        (err: { name: any; }) => {
        console.error(err.name);
      },
      () => {
        console.log();
        this.newUserFirstName = '';
        this.newUserPassword = '';
        this.newUserUsername = '';
      }
    );
  }

}
