import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Other food'
  }, {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussel sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {
            name: 'Vegetables',
            children: [
              {
                name: 'Green',
                children: [
                  {name: 'Broccoli'},
                  {name: 'Brussel sprouts'},
                ]
              }, {
                name: 'Orange',
                children: [
                  {name: 'Pumpkins'},
                  {name: 'LAST Carrots'},
                ]
              },
            ]
          }
        ]
      },
    ]
  },
];

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  source: any;
}

@Component({
  selector: 'app-folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.scss']
})

export class FolderItemComponent implements OnInit {

  @Input() documents: any;
  treeControl: FlatTreeControl<FlatNode>;
  treeFlattener: any;
  dataSource: any;

  // treeControl = new FlatTreeControl<FlatNode>(
  //   node => node.level, node => node.expandable);
  //
  // treeFlattener = new MatTreeFlattener(
  //   this.transformer, node => node.level, node => node.expandable, node => node.files);
  //
  // dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnInit() {
    // console.log(this.documents);
    // this.initTreeControl();

    // this.initTreeControl();
    // this.dataSource.data = this.documents;
    // @ViewChild('')
  }

  initTreeControl() {
    this.treeControl = new FlatTreeControl<FlatNode>(
      node => node.level, node => node.expandable);

    this.treeFlattener = new MatTreeFlattener(
      this.transformer, node => node.level, node => node.expandable, node => node.files);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = this.documents;
  }

  transformer(node: any, level: number) {
    return {
      expandable: !!node.files && node.files.length > 0,
      name: node.name,
      level: level,
      source: node
    };
  }

  constructor() {

  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

}
