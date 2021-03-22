import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Circle } from 'src/app/interfaces/intefaces';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css'],
})
export class CircleComponent implements OnInit {
  @Output() drawCircle = new EventEmitter<Circle>();

  model = new Circle(1, 'circle', 0, 0, 'None', 10);
  notches = [
    'Top and Bottom',
    'Left and Right',
    'Custom Notch Replacememt',
    'None',
  ];

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.model);
    this.drawCircle.emit(this.model);
    this.closeNav();
  }

  /* Set the width of the sidebar to 0 (hide it) */
  closeNav() {
    document.getElementById('myCirclePanel').style.width = '0';
  }
}
