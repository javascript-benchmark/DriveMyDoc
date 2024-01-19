import {Component, Input, OnInit} from '@angular/core';
import {DriveDocument} from '../drive/drive-document';
import {DriveFolder} from '../drive/drive-folder';
import {DriveFile} from '../drive/drive-file';

@Component({
  selector: 'app-side-bar-navigator',
  templateUrl: './side-bar-navigator.component.html',
  styleUrls: ['./side-bar-navigator.component.scss']
})
export class SideBarNavigatorComponent implements OnInit {

  @Input() folders: DriveFolder[];
  @Input() files: DriveFile[];

  constructor() { }

  ngOnInit() {

  }
}
