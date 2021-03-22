import { Rectangle } from './../../interfaces/intefaces';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ShapeLib, Circle } from 'src/app/interfaces/intefaces';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawCanvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D;

  @Output() addShape = new EventEmitter<ShapeLib>();
  @Output() drawRectangle = new EventEmitter<Rectangle>();
  @Output() drawCircle = new EventEmitter<Circle>();
  //@Output() drawPoint = new EventEmitter<string>();

  isLibOpened: boolean = false;
  isTracerOpened: boolean = false;
  isDrawOpened: boolean = false;

  isRectClicked: boolean = false;
  isCircleClicked: boolean = false;
  isSettingsClicked: boolean = false;

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

  isFileSelected: boolean = false;
  tracer_Img: any;
  imgURL: any;

  constructor() {}

  ngOnInit(): void {}

  initilizeCanvas() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  openLib() {
    this.isLibOpened = true;
  }

  openTracer() {
    this.isFileSelected = false;
    this.isTracerOpened = true;
  }

  openDrawShape() {
    this.isDrawOpened = true;
  }

  openNav(id) {
    switch (id) {
      case 'Rect':
        this.isRectClicked = true;
        this.isCircleClicked = false;
        this.isSettingsClicked = false;
        document.getElementById('myRectPanel').style.width = '250px';
        document.getElementById('myCirclePanel').style.width = '0';
        document.getElementById('mySettingsPanel').style.width = '0';
        break;
      case 'Circle':
        this.isCircleClicked = true;
        this.isRectClicked = false;
        this.isSettingsClicked = false;
        document.getElementById('myCirclePanel').style.width = '250px';
        document.getElementById('mySettingsPanel').style.width = '0';
        document.getElementById('myRectPanel').style.width = '0';

        break;
      case 'Settings':
        this.isSettingsClicked = true;
        this.isCircleClicked = false;
        this.isRectClicked = false;
        document.getElementById('mySettingsPanel').style.width = '250px';
        document.getElementById('myCirclePanel').style.width = '0';
        document.getElementById('myRectPanel').style.width = '0';
        break;
    }
  }

  closeDialog() {
    this.isLibOpened = false;
    this.isTracerOpened = false;
    this.isDrawOpened = false;
  }

  // startDrawPoint(){
  //   this.drawPoint.emit("stratDrawPoint")
  // }

  drawShapeOnCanvas() {
    this.closeDialog();
    this.addShape.emit(this.model);
  }

  drawRectOnCanvas(event: Rectangle) {
    this.drawRectangle.emit(event);
  }

  drawCircleOnCanvas(event: Circle) {
    this.drawCircle.emit(event);
  }

  loadFile() {
    document.getElementById('getFile').click();
  }

  handleInput(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.isFileSelected = true;
      this.isTracerOpened = false;
      this.addImageToCanvas();
    }
  }

  addImageToCanvas() {
    this.initilizeCanvas();
    this.tracer_Img = new Image();
    this.tracer_Img.src = '/assets/cbimage.jpg';
    this.tracer_Img.onload = () => {
      this.ctx.drawImage(this.tracer_Img, 50, 50);
    };
  }
}
