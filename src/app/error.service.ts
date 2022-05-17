import {ErrorHandler, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {
  constructor(private router: Router) {
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      console.log(error.status);
    } else {
      console.error("an error occurred here");
      console.log(error.status);
      console.log(error);
    }
    this.router.navigateByUrl('/error');
  }
}
