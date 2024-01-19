import {Component, Input, OnInit} from '@angular/core';
import {DriveFile} from '../../drive/drive-file';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent implements OnInit {

  @Input() file: DriveFile;
  currentSelectedFileId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentSelectedFileId = params.fileId;
    });
  }

  removeExtension(fileName): string {
    const splitted = fileName.split('.');
    if (splitted.length > 1) {
      return splitted.slice(0, -1).join('.');
    }
    return fileName;
  }
}
