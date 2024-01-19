import {Component, Injectable, Input, OnInit} from '@angular/core';
import {DriveFolder} from '../../drive/drive-folder';
import {DriveService} from '../../drive/drive.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {CollectionViewer, SelectionChange} from '@angular/cdk/collections';
import {map} from 'rxjs/operators';

interface FlatNode {
  isExpandable: boolean;
  name: string;
  level: number;
  isLoading: boolean;
  source: any;
}

@Injectable()
export class DynamicDataSource {

  dataChange: BehaviorSubject<FlatNode[]> = new BehaviorSubject<FlatNode[]>([]);

  get data(): FlatNode[] { return this.dataChange.value; }
  set data(value: FlatNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(private treeControl: FlatTreeControl<FlatNode>,
              private driveService: DriveService,
              private folderId: string) {
    this.fetchFiles(folderId, null, true);
  }

  connect(collectionViewer: CollectionViewer): Observable<FlatNode[]> {
    this.treeControl.expansionModel.onChange!.subscribe(change => {
      if ((change as SelectionChange<FlatNode>).added ||
        (change as SelectionChange<FlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<FlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  handleTreeControl(change: SelectionChange<FlatNode>) {
    if (change.added) {
      change.added.forEach((node) => this.fetchFiles(node.source.id, node, true));
    }
    if (change.removed) {
      change.removed.reverse().forEach((node) => this.fetchFiles(node.source.id, node, false));
    }
  }

  fetchFiles(folderId: string, node: FlatNode, expand: boolean) {
    let level = 0;
    if (node) { level = node.level + 1; }
    const index = this.data.indexOf(node);
    if (!expand) { return this.removeFiles(node, index); }
    if (expand && node && node.source.files.length > 0) {
      const childrenDocument = node.source.files;
      return this.addFiles(node, childrenDocument, level);
    }
    if (node) { node.isLoading = true; }
    this.driveService.getFiles(folderId)
      .subscribe((data) => {
        const children = data.files.map((document) => {
          if (document.name[0] !== '.') {
            if (document.mimeType === 'application/vnd.google-apps.folder') {
              document.files = [];
            }
            return document;
          }
        });
        this.addFiles(node, children, level);
        if (node) { node.isLoading = false; }
      });
  }

  addFiles(node: FlatNode, childrenFiles: any, level: number) {
    const index = this.data.indexOf(node);
    const childrenFlatNode = childrenFiles.map((document) => this.documentToFlatNode(document, level));
    if (node == null) {
      this.data = childrenFlatNode;
    } else {
      node.source.files = childrenFiles;
      this.data.splice(index + 1, 0, ...childrenFlatNode);
    }
    this.dataChange.next(this.data);
  }

  removeFiles(node: FlatNode, index) {
    const nodeToStop = this.data.find((aNode, aNodeIndex) => {
      return (aNodeIndex > index && aNode.level === node.level);
    });
    const indexSinceToKeep = this.data.indexOf(nodeToStop);
    this.data = this.data.filter((aNode, aNodeindex) => {
      if ((aNodeindex < index || aNode.level <= node.level) || aNodeindex >= indexSinceToKeep) {
        return true;
      }
    });
    this.dataChange.next(this.data);
  }

  documentToFlatNode(document: any, level: number): FlatNode {
    if (document.mimeType === 'application/vnd.google-apps.folder') {
      document.files = [];
      return { isExpandable: true, name: document.name, level, source: document } as FlatNode;
    } else {
      return { isExpandable: false, name: document.name, level, source: document } as FlatNode;
    }
  }
}

@Component({
  selector: 'app-first-level-folder',
  templateUrl: './first-level-folder.component.html',
  styleUrls: ['./first-level-folder.component.scss']
})
export class FirstLevelFolderComponent implements OnInit {

  @Input() folder: DriveFolder;
  currentSelectedFileId: string;

  dataSource: DynamicDataSource;
  treeControl: FlatTreeControl<FlatNode>;

  constructor(private driveService: DriveService,
              private route: ActivatedRoute) {
  }

  getLevel = (node: FlatNode) => node.level;
  isExpandable = (node: FlatNode) => node.isExpandable;

  ngOnInit() {
    this.treeControl = new FlatTreeControl<FlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, this.driveService, this.folder.id);

    this.route.queryParams.subscribe(params => {
      this.currentSelectedFileId = params.fileId;
    });
  }

  hasChild = (_: number, nodeData: FlatNode) => nodeData.isExpandable;

  removeExtension(fileName): string {
    const splitted = fileName.split('.');
    if (splitted.length > 1) {
      return splitted.slice(0, -1).join('.');
    }
    return fileName;
  }
}

// To create a search filter
// https://stackblitz.com/edit/angular-yb37gh?file=app%2Ftree-checklist-example.html
// https://stackblitz.com/angular/bqnqjjvgjym?file=app%2Ftree-dynamic-example.css
