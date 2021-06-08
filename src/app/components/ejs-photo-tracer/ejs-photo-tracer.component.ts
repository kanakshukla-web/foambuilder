import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ejs-photo-tracer',
  templateUrl: './ejs-photo-tracer.component.html',
  styleUrls: ['./ejs-photo-tracer.component.css']
})
export class EjsPhotoTracerComponent implements OnInit {
  @ViewChild('ejTracerDialog') ejDialog: DialogComponent;
  @ViewChild('drawCanvas', { static: false })
  canvas: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D;

  isTracerOpened: boolean = false;
  isFileSelected: boolean = false;
  tracer_Img: any;

  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '95%';
  public showCloseIcon: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initilizeCanvas();
  }

  initilizeCanvas() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  openTracerInstrctions() {
    this.isTracerOpened = true;;
  }

  closeTracerInstrctions() {
    this.isTracerOpened = false;
    this.ejDialog.hide();
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
