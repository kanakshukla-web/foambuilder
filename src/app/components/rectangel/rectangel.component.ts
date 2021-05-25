import { Properties, Rectangle } from '../../interfaces/intefaces';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rectangel',
  templateUrl: './rectangel.component.html',
  styleUrls: ['./rectangel.component.css'],
})
export class RectangelComponent implements OnInit {
  @Output() drawRectangle = new EventEmitter<Rectangle>();

  show: boolean;
  isError: boolean = true;
  lengths = 50;
  widths = 50;
  depths = 50;
  model = new Rectangle();
  notches = [
    'Top and Bottom',
    'Left and Right',
    'Custom Notch Replacememt',
    'None',
  ];

  constructor() { }

  ngOnInit(): void { }

  onSubmit(rectangleForm) {

    if (rectangleForm.value.length > 50
      && rectangleForm.value.width > 50
      && rectangleForm.value.depth > 50) {

      this.lengths = rectangleForm.value.length;
      this.widths = rectangleForm.value.width;
      this.depths = rectangleForm.value.depth;

      this.isError = true;
    }
    else {
      if (!this.show) {
        this.model.cornerRadius = 0;
      }
      this.drawRectangle.emit(this.model);
      this.closeNav();
      this.isError = false;
      rectangleForm.controls['length'].reset();
      rectangleForm.controls['width'].reset();
      rectangleForm.controls['depth'].reset();
      //rectangleForm.controls['cornerRadius'].reset();
    }
  }

  handleCheckbox() {
    this.show = !this.show;
  }

  closeNav() {
    document.getElementById('myRectPanel').style.width = '0';
  }
}
