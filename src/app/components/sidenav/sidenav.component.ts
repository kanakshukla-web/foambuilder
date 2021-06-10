import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import { Circle, ShapeLib } from 'src/app/interfaces/intefaces';
import { Rectangle } from './../../interfaces/intefaces';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {

  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '95%';
  public showCloseIcon: boolean = true;

  @Output() drawImage = new EventEmitter<ShapeLib>();
  @Output() drawRectangle = new EventEmitter<Rectangle>();
  @Output() drawCircle = new EventEmitter<Circle>();

  isLibOpened: boolean = false;
  isTracerOpened: boolean = false;
  isDrawOpened: boolean = false;

  isRectClicked: boolean = false;
  isCircleClicked: boolean = false;
  isSettingsClicked: boolean = false;
  isFileSelected: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  handleNavClick(id: string) {
    switch (id) {
      case "Library":
        this.isLibOpened = true;
        break;
      case "PhotoTracer":
        this.isFileSelected = false;
        this.isTracerOpened = true;
        break;
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
      case "Draw": this.isDrawOpened = true;
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

  drawImageOnCanvas(model) {
    this.closeDialog();
    this.drawImage.emit(model);
  }

  drawRectOnCanvas(event: Rectangle) {
    this.drawRectangle.emit(event);
  }

  drawCircleOnCanvas(event: Circle) {
    this.drawCircle.emit(event);
  }
}
