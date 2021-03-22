import { ShapeLib } from './../../interfaces/intefaces';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ejs-shape-lib',
  templateUrl: './ejs-shape-lib.component.html',
  styleUrls: ['./ejs-shape-lib.component.css'],
})
export class EjsShapeLibComponent implements OnInit {
  @Output() close = new EventEmitter<string>();
  @Output() addShape = new EventEmitter<ShapeLib>();

  public typeDialogWidth: string = '95%';
  public typeDialogHeight: string = '95%';
  public showCloseIcon: boolean = true;

  model = new ShapeLib(
    1,
    '',
    'Category',
    'Brand',
    'Public & Private Shapes Only'
  );
  categories = [
    'Audio',
    'Binoculars',
    'Bottles',
    'Bows/Crossbows',
    'Camera',
    'Camera Lenses',
    'Computers/Tablets',
    'Drones',
  ];
  brands = ['Audio', 'Binoculars'];
  shapes = [
    'Public & Private Shapes Only',
    'Public Shapes Only',
    'Private Shapes Only',
  ];

  constructor() {}

  ngOnInit(): void {}

  closeDialog() {
    this.close.emit('close');
  }

  drawShapeOnCanvas() {
    this.closeDialog();
    this.addShape.emit(this.model);
  }
}
