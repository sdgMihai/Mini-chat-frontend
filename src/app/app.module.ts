import {ErrorHandler, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import {AppRoutingModule} from './app-routing.module';
import {LoginInterceptor} from "./login.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SocketService} from "./socket.service";
import { ChannelComponent } from './channel/channel.component';
import { RoomComponent } from './room/room.component';
import { ErrorComponent } from './error/error.component';
import {ErrorService} from "./error.service";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChannelComponent,
    RoomComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [SocketService,
    {
      provide : HTTP_INTERCEPTORS,
      useClass: LoginInterceptor,
      multi   : true,
    },
    {
      provide: ErrorHandler,
      useClass: ErrorService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
