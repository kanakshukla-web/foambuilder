import { Properties, Rectangle } from '../../interfaces/intefaces';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rectangel',
  templateUrl: './rectangel.component.html',
  styleUrls: ['./rectangel.component.css'],
})
export class RectangelComponent implements OnInit {
  @Output() drawRectangle = new EventEmitter<Rectangle>();

  model = new Rectangle();
  notches = [
    'Top and Bottom',
    'Left and Right',
    'Custom Notch Replacememt',
    'None',
  ];

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    this.drawRectangle.emit(this.model);
    this.closeNav();
  }

  closeNav() {
    document.getElementById('myRectPanel').style.width = '0';
  }
}
