import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from '../auth.service';
import {map} from 'rxjs/operators';

@Injectable()

export class DriveService {

  DRIVE_API_URL = 'https://content.googleapis.com/drive/v3/';
  FIELDS = 'files(id, name, parents, webViewLink, iconLink, mimeType)';

  headers: HttpHeaders;
  accessToken: string;

  constructor(private http: HttpClient,
              private authService: AuthService) {
    this.accessToken = this.authService.getUserToken();
    this.headers = new HttpHeaders({ Authorization: 'Bearer ' + this.accessToken });
  }

  getFiles(parentId: string): any {
    const params = {
      q: '\'' + parentId + '\'' + ' in parents and trashed = false',
      orderBy: 'folder',
      fields: this.FIELDS,
      pageSize: '1000',
      includeTeamDriveItems: 'true',
      includeItemsFromAllDrives: 'true',
      supportsAllDrives: 'true',
      supportsTeamDrives: 'true'
    };

    return this.http.get(this.DRIVE_API_URL + 'files', { headers: this.headers, params });
  }

  getFile(fileId: string): any {
    const params = {
      fields: '*',
      includeTeamDriveItems: 'true',
      includeItemsFromAllDrives: 'true',
      supportsAllDrives: 'true',
      supportsTeamDrives: 'true'
    };

    return this.http.get(this.DRIVE_API_URL + 'files/' + fileId, { headers: this.headers, params });
  }

  searchFiles(parentId: string, query: string) {
    const batchUrl = 'https://www.googleapis.com/batch/drive/v3';
    this.headers = new HttpHeaders(
      { Authorization: 'Bearer ' + this.accessToken, 'Content-Type': 'multipart/mixed; boundary=END_OF_PART' }
      );

    const queryString = new HttpParams().set('q', `fullText contains '"${ query }"' and '${ parentId }' in parents`).toString();
    let body =
      `--END_OF_PART
content-type: application/http
content-id: 1

GET /drive/v3/files?${ queryString }
Content-Type: application/json
--END_OF_PART--`;

    return this.http.post(batchUrl, body, { headers: this.headers, responseType: 'text' }).pipe(map((data) => {
      const text = data.replace(/\n\r/g, '\n')
        .replace(/\r/g, '\n')
        .split(/\n{2,}/g);
      return JSON.parse(text[text.length - 3]);
    })
  );
  }

  fileContentUrl(fileId: string) {
    return this.DRIVE_API_URL + 'files/' + fileId + '?alt=media';
  }

  getFileContent(fileId: string) {
    return this.http.get(this.fileContentUrl(fileId), { headers: this.headers, responseType: 'text' });
  }
}
