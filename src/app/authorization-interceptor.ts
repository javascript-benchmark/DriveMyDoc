import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DriveService} from './drive/drive.service';
import {AuthService} from './auth.service';


@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  accessToken: string;

  constructor(private authService: AuthService) {
    this.accessToken = this.authService.getUserToken();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.validateExpiredToken();
    // let modifiedRequest: any;
    // const newHeaders = req.headers.set('Authorization', 'Bearer ' + this.accessToken);
    // modifiedRequest = req.clone({ headers: newHeaders, url: req.url, body: req.body });
    return next.handle(req);
  }
}
