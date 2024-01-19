import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {DriveService} from '../drive/drive.service';
import {DriveDocument} from '../drive/drive-document';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss']
})
export class FileViewerComponent implements OnInit {

  fileId: string;
  safeUrl: any;
  file: any;
  markdown = null;

  constructor(private route: ActivatedRoute,
              public sanitizer: DomSanitizer,
              private driveService: DriveService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fileId = params.fileId;
      const url = 'https://docs.google.com/viewer?srcid=' + this.fileId + '&pid=explorer&efh=false&a=v&chrome=false&embedded=true';
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.fetchFile();
    });
  }

  fetchFile() {
    this.driveService.getFile(this.fileId)
      .subscribe((data) => {
        this.file = data;
        if (this.isMarkdown(this.file.fileExtension)) {
          this.fetchFileContent();
        } else {
          this.markdown = null;
        }
      });
  }

  fetchFileContent() {
    this.driveService.getFileContent(this.fileId)
      .subscribe((data) => {
        this.markdown = data.toString();
      });
  }

  isMarkdown(fileExtension: string): boolean {
    return fileExtension === 'md';
  }
}
