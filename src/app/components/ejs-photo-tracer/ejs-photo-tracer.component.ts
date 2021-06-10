import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ejs-photo-tracer',
  templateUrl: './ejs-photo-tracer.component.html',
  styleUrls: ['./ejs-photo-tracer.component.css']
})
export class EjsPhotoTracerComponent implements OnInit {

  @Output() close = new EventEmitter<string>();
  @ViewChild('tracerCanvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D;

  isFileSelected: boolean = false;
  tracer_Img: any;

  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '95%';
  public showCloseIcon: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //this.initilizeCanvas();
  }

  initilizeCanvas() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  closeDialog() {
    this.close.emit('close');
  }

  loadFile() {
    document.getElementById('getFile').click();
  }

  handleInput(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.isFileSelected = true;
      //this.close.emit('close');
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
