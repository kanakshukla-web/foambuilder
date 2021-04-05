import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-global-button-menu',
  templateUrl: './global-button-menu.component.html',
  styleUrls: ['./global-button-menu.component.css']
})
export class GlobalButtonMenuComponent implements OnInit {

  @Output() clearEvent = new EventEmitter<string>();
  @Output() setEvent = new EventEmitter<string>();
  @Output() revertEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  clearSelection(){
    this.clearEvent.emit();
  }

  setSelection(id)
  {
    this.setEvent.emit(id);
  }

  undo(){
    this.revertEvent.emit();
  }

}
