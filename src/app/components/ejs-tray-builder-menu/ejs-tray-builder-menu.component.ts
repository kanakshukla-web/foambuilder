import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ejs-tray-builder-menu',
  templateUrl: './ejs-tray-builder-menu.component.html',
  styleUrls: ['./ejs-tray-builder-menu.component.css']
})
export class EjsTrayBuilderMenuComponent implements OnInit {

  @Input() canvasProperties;
  @Output() trayEvent = new EventEmitter<string>();
  @Output() expandEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  handleTray() {
    this.trayEvent.emit();
  }

  expandDiv(id) {
    this.expandEvent.emit(id);
  }

}
