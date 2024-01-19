import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {environment} from '../../environments/environment';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  auth2: any;

  private clientId: string = '798021972045-vo31kgilujafp0q9gibdmfe7jr5rau25.apps.googleusercontent.com';
  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/drive.readonly'
  ].join(' ');

  constructor(
    private ngZone: NgZone,
    private authService: AuthService
  ) {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.googleInit();
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: environment.clientId,
        scope: this.scope,
        cookiepolicy: 'single_host_origin'
      });
      window['onSignIn'] = (user) => this.ngZone.run(() => this.onSignIn(user));
    });
  }

  public onSignIn(googleUser) {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.getAuthInstance();
      this.authService.initSession(googleUser);
    });
  }
}
