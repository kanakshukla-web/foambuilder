import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-ejs-tray-builder',
  templateUrl: './ejs-tray-builder.component.html',
  styleUrls: ['./ejs-tray-builder.component.css'],

})
export class EjsTrayBuilderComponent implements OnInit {
  @ViewChild('ejTypeDialog') ejDialog: DialogComponent;
  @Output() toggleTray = new EventEmitter<string>();
  @Input() canvasProperties;

  isTrayClicked = false;
  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '95%';
  public showCloseIcon: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  openTray(){
    this.isTrayClicked = true;
  }

  closeDialog() {
    this.isTrayClicked = false;
    this.toggleTray.emit();
    this.ejDialog.hide();
  }
}
