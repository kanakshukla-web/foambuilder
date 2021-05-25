import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Properties } from 'src/app/interfaces/intefaces';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {

  isTools: boolean = true;
  isAlign: boolean = false;

  @Input() properties: Properties;
  @Output() makeClone = new EventEmitter<Properties>();
  @Output() deleteShape = new EventEmitter<Properties>();

  constructor() { }

  ngOnInit(): void {
  }

  handleClone() {
    this.makeClone.emit(this.properties);
  }

  handleDeleteShape() {
    this.deleteShape.emit(this.properties);
  }

  isAlignfun() {
    this.isAlign = true;
    this.isTools = false;
  }
  isToolsFun() {
    this.isTools = true;
    this.isAlign = false;
  }

}
