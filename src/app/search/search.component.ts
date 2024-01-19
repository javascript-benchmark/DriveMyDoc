import {Component, Input, OnInit} from '@angular/core';
import {DriveService} from '../drive/drive.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() searchsidenav: any;

  query: string;
  searchResult: any;

  constructor(
    private driveService: DriveService
  ) { }

  ngOnInit() {

  }

  searching(query) {
    if (query.length > 0) {
      this.driveService.searchFiles(environment.rootFolderId, query).subscribe((data) => {
        this.searchResult = data.files;
      });
    } else {
      this.searchResult = [];
    }
  }

  searchResultOnClick() {
    this.searchResult = [];
    this.query = null;
    this.searchsidenav.close();
  }
}
