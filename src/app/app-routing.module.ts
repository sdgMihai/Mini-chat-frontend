import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {ChannelComponent} from "./channel/channel.component";
import {ErrorComponent} from "./error/error.component";

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'channel', component: ChannelComponent
  },
  {
    path: 'error', component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
