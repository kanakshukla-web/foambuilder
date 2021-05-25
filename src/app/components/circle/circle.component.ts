import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Circle } from 'src/app/interfaces/intefaces';
import { Oval } from 'src/app/interfaces/intefaces';
@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css'],
})
export class CircleComponent implements OnInit {
  @Output() drawCircle = new EventEmitter<Circle>();

  diameters = 50;
  depths = 50;
  isError: boolean = true;
  lengths = 50;
  widths = 50;
  depthsoval = 50;

  options: boolean;
  // msgshowhide = false;
  model = new Circle();
  modeloval = new Oval();
  notches = [
    'Top and Bottom',
    'Left and Right',
    'Custom Notch Replacememt',
    'None',
  ];

  constructor() { }

  ngOnInit(): void { }

  onSubmit1(ovalForm) {

    console.log(ovalForm.value)
    if (ovalForm.value.length > 50) {
      this.lengths = ovalForm.value.length;
    }
    if (ovalForm.value.depth > 60) {
      this.depthsoval = ovalForm.value.depth;
    }
    if (ovalForm.value.width > 50) {
      this.widths = ovalForm.value.width;
    }
    else {
      this.drawCircle.emit(this.model);
      this.closeNav();
      ovalForm.reset()
    }

  }
  onSubmit(circleForm) {

    if (circleForm.value.diameter > 60) {

      this.diameters = circleForm.value.diameter;
      //  setTimeout(() => {
      //   console.log('hide');
      //   this.msgshowhide = false;
      // }, 4000);
      this.isError = true;
    }
    if (circleForm.value.depth > 60) {

      this.depths = circleForm.value.depth
      this.isError = true;

    }
    else {
      this.drawCircle.emit(this.model);
      this.closeNav();
      this.isError = false;

      circleForm.controls['diameter'].reset();
      circleForm.controls['depth'].reset()


    }




  }

  /* Set the width of the sidebar to 0 (hide it) */
  closeNav() {
    document.getElementById('myCirclePanel').style.width = '0';
  }
}
