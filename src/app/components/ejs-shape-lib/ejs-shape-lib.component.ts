import { ShapeLibraryService } from './../../services/shapeLibrary/shape-library.service';
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

  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '98%';
  public showCloseIcon: boolean = true;
  isLibOpened: boolean = false;

  ShapesList = [
    {
      ShapeID: 1,
      ShapeName: 'Generic Pistol',
      ShapeImageSrc: 'data:image/jpg;base64,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',
      ShapeDescription: 'Generic Handle Down Pistol, Handgun, Universal',
      MfrID: 'N/A',
      DefaultOrientation: 'Handle Down',
      DefaultOrientationID: 1,
      Orientation: [
        {
          ID: 1,
          Name: "Handle Down",
          IconSrc: "assets/cbimage.jpg",
          Dimension: "57 x 217 x 108"
        },
        {
          ID: 2,
          Name: "Handle Down (Long)",
          IconSrc: "https://picsum.photos/200/300",
          Dimension: "40 x 300 x 200"
        }
      ],
      ShapeCategoryType: 'Audio',
      ShapeScopeType: 'Public & Private Shapes'
    }
  ]


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

  constructor(private shapeLibService: ShapeLibraryService) { }

  ngOnInit(): void {
    this.shapeLibService.getShapeLibrayData();
  }

  openDialog() {
    this.isLibOpened = true;
  }

  closeDialog() {
    //this.close.emit('close');
    this.isLibOpened = false;
  }

  drawShapeOnCanvas() {
    this.closeDialog();
    this.addShape.emit(this.model);
  }
}
