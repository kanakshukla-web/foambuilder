import { EjsPhotoTracerComponent } from './../ejs-photo-tracer/ejs-photo-tracer.component';
import { EjsShapeLibComponent } from './../ejs-shape-lib/ejs-shape-lib.component';
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

  @Output() addShape = new EventEmitter<ShapeLib>();
  @Output() drawRectangle = new EventEmitter<Rectangle>();
  @Output() drawCircle = new EventEmitter<Circle>();
  //@Output() drawPoint = new EventEmitter<string>();
  @ViewChild('shapeLibChild') shapeLibChild: EjsShapeLibComponent;
  @ViewChild('photoTracerChild') photoTracerChild: EjsPhotoTracerComponent;

  //isLibOpened: boolean = false;
  isTracerOpened: boolean = false;
  isDrawOpened: boolean = false;

  isRectClicked: boolean = false;
  isCircleClicked: boolean = false;
  isSettingsClicked: boolean = false;

  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '95%';
  public showCloseIcon: boolean = true;

  isFileSelected: boolean = false;

  imgURL: any;

  constructor() { }

  ngOnInit(): void { }

  openLib() {
    //this.isLibOpened = true;
    this.shapeLibChild.openDialog();
  }

  openTracer() {
    this.isFileSelected = false;
    //this.isTracerOpened = true;
    this.photoTracerChild.openTracerInstrctions();
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
    //this.isLibOpened = false;
    this.shapeLibChild.closeDialog();
    //this.isTracerOpened = false;
    this.photoTracerChild.closeTracerInstrctions();
    this.isDrawOpened = false;
  }

  drawShapeOnCanvas(model) {
    this.closeDialog();
    this.addShape.emit(model);
  }

  drawRectOnCanvas(event: Rectangle) {
    this.drawRectangle.emit(event);
  }

  drawCircleOnCanvas(event: Circle) {
    this.drawCircle.emit(event);
  }

}
