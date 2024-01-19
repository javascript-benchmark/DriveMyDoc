import {Component, NgZone, OnInit} from '@angular/core';
import {DriveService} from '../drive/drive.service';
import {DriveFolder} from '../drive/drive-folder';
import {DriveFile} from '../drive/drive-file';
import {DriveDocument} from '../drive/drive-document';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  files: DriveFile[] = [];
  folders: DriveFolder[] = [];

  constructor(
    private driveService: DriveService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.checkIfAuthentified();
    this.getFilesRoot();
  }

  getFilesRoot() {
    this.driveService.getFiles(environment.rootFolderId)
      .subscribe((data) => {
      data.files.forEach((document) => {
        if (document.name[0] !== '.') {
          if (document.mimeType === 'application/vnd.google-apps.folder') {
            this.folders.push(document as DriveFolder);
          } else {
            this.files.push(document as DriveFile);
          }
        }
      });
    });
  }

  checkIfAuthentified() {
    this.authService.validateExpiredToken();
  }
}
