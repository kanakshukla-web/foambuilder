import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ShapeLib } from './../../interfaces/intefaces';
import { ShapeLibraryService } from './../../services/shapeLibrary/shape-library.service';

@Component({
  selector: 'app-ejs-shape-lib',
  templateUrl: './ejs-shape-lib.component.html',
  styleUrls: ['./ejs-shape-lib.component.css'],
})
export class EjsShapeLibComponent implements OnInit {
  //@ViewChild('ejLibDialog') ejDialog: DialogComponent;
  @Output() close = new EventEmitter<string>();
  @Output() addShape = new EventEmitter<ShapeLib>();

  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '98%';
  public showCloseIcon: boolean = true;
  isLibOpened: boolean = false;

  ShapesList = [];
  totalResults = 0;

  model = new ShapeLib(
    1,
    '',
    'Category',
    'Brand',
    'Public & Private Shapes Only'
  );
  categories = [];
  brands = [];
  shapes = [];

  constructor(private shapeLibService: ShapeLibraryService) { }

  ngOnInit(): void {
    let response = this.shapeLibService.getShapeLibrayData();
    if (response.Code === '200' && response.Status === 'OK') {
      this.ShapesList = response.ShapesList;
      this.totalResults = response.shapesLength;
    }
    let result = this.shapeLibService.getHeaderData();
    let { categories, brands, shapes } = result;
    this.categories = categories;
    this.brands = brands;
    this.shapes = shapes;
  }

  openDialog() {
    this.isLibOpened = true;
  }

  closeDialog() {
    this.close.emit('close');
    this.isLibOpened = false;
    //this.ejDialog.hide();
  }

  drawShapeOnCanvas() {
    this.closeDialog();
    this.addShape.emit(this.model);
  }
}
