import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-ejs-draw-shape',
  templateUrl: './ejs-draw-shape.component.html',
  styleUrls: ['./ejs-draw-shape.component.css'],
})
export class EjsDrawShapeComponent implements OnInit {
  @Output() close = new EventEmitter<string>();
  //@Output() drawPoint = new EventEmitter<string>();
  @ViewChild('drawCanvas', { static: false })
  canvas: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D;

  public typeDialogWidth: string = '95%';
  public typeDialogHeight: string = '95%';
  public showCloseIcon: boolean = true;

  Points = [];
  counter = 0;
  stPoint = [];
  endPoint;

  mouseClickPosition = { x: 0, y: 0 };
  lastClickPosition = { x: 0, y: 0 };
  lineCoordinates = { x: 0, y: 0 };
  isDrawStart = false;

  roof = null;
  roofPoints = [];
  lines = [];
  lineCounter = 0;
  drawingObject = { type: '', background: '', border: '' };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.addEventListener('click', this.clickListener);
    this.canvas.nativeElement.addEventListener('mousemove', this.moveListner);
  }

  clickListener = (event) => {
    this.counter++;
    if (this.counter == 1) this.isDrawStart = true;

    this.mouseClickPosition = this.getClientOffset(event);
    this.Points.push({
      x: this.mouseClickPosition.x,
      y: this.mouseClickPosition.y,
      clickCount: this.counter,
    });
    console.log(this.mouseClickPosition);

    if (this.counter > 1) {
      // this.Points.forEach((point, index) => {
      this.ctx.beginPath();
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = 'red';
      this.ctx.moveTo(this.mouseClickPosition.x, this.mouseClickPosition.y);
      this.ctx.lineTo(this.lastClickPosition.x, this.lastClickPosition.y);
      this.ctx.stroke();
      // });
    }
    this.lastClickPosition = this.mouseClickPosition;
    //this.drawDots();
  };

  moveListner = (event) => {
    if (!this.isDrawStart) return;

    this.lineCoordinates = this.getClientOffset(event);
    this.clearCanvas();
    this.drawLine();
    //this.Update();
  };

  mouseupListener = (event) => {
    this.isDrawStart = false;
  };

  getClientOffset = (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    return { x, y };
  };

  drawLine = () => {
    this.ctx.beginPath();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'red';
    this.ctx.moveTo(this.mouseClickPosition.x, this.mouseClickPosition.y);
    this.ctx.lineTo(this.lineCoordinates.x, this.lineCoordinates.y);
    this.ctx.stroke();
  };

  clearCanvas = () => {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
  };

  closeDialog() {
    this.close.emit('close');
  }

  initDrawPoint(): void {
    //this.drawPoint.emit('draw');
    //this.Update('draw Point');
  }

  drawDots() {
    // Draw the dots, this should be done last due to then they are above the path
    this.ctx.fillStyle = '#000';
    this.Points.forEach((point, index, arr) => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      this.ctx.fill();
    });
  }

  Update() {
    //this.clearCanvas();

    // Draw the shape
    this.ctx.beginPath();
    this.Points.forEach((point, index, arr) => {
      if (arr.length > 0) {
        if (index == 0) this.ctx.moveTo(point.x, point.y);

        if (index != arr.length - 1)
          this.ctx.lineTo(arr[index + 1].x, arr[index + 1].y);
      }
    });
    this.ctx.fillStyle = '#ddf7f7'; //this is the shapes color
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    this.drawDots();
  }

  //==========================

  Point = (x, y) => {
    // this.x = x;
    // this.y = y;
  };
}
