import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

  constructor(
    private ngZone: NgZone,
    private router: Router
  ) { }

  initSession(googleUser: any) {
    const profile = googleUser.getBasicProfile();

    const user = {
      email: profile.getEmail(),
      name: profile.getName(),
      imageUrl: profile.getImageUrl()
    };

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', googleUser.getAuthResponse().access_token);
    localStorage.setItem('expires_at', googleUser.getAuthResponse().expires_at);
    this.ngZone.run(() => this.router.navigate(['/']));
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    window.open('/login', '_self');
  }

  getUserToken() {
    return localStorage.getItem('token');
  }

  getExpiresAt(): number {
    return +localStorage.getItem('expires_at');
  }

  validateExpiredToken() {
    if ( Date.now() > this.getExpiresAt()) {
      this.logout();
    }
  }
}
