import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Properties } from 'src/app/interfaces/intefaces';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
  @Input() properties: Properties;
  @Output() makeClone = new EventEmitter<Properties>();

  constructor() { }

  ngOnInit(): void {
  }

  handleClone(){
    this.makeClone.emit(this.properties);
  }

}
