import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ejs-chnage-case-menu',
  templateUrl: './ejs-chnage-case-menu.component.html',
  styleUrls: ['./ejs-chnage-case-menu.component.css']
})
export class EjsChnageCaseMenuComponent implements OnInit {

  @Input() canvasProperties;
  @Output() editEvent = new EventEmitter<string>();
  @Output() expandEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  handleEdit() {
    this.editEvent.emit();
  }

  expandDiv(id) {
    this.expandEvent.emit(id);
  }
}
