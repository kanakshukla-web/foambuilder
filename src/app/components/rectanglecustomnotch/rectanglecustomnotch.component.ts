import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rectanglecustomnotch',
  templateUrl: './rectanglecustomnotch.component.html',
  styleUrls: ['./rectanglecustomnotch.component.css']
})
export class RectanglecustomnotchComponent implements OnInit {
  isCustomNotcheSelected = false;
  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '95%';
  public showCloseIcon: boolean = true;

  @ViewChild('ejTypeDialog') ejDialog: DialogComponent;
  @Output() customNotchEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  openCustomNotchDialog() {
    this.isCustomNotcheSelected = true;
  }

  closeDialog() {
    this.isCustomNotcheSelected = false;
    this.customNotchEvent.emit();
    this.ejDialog.hide();
  }

}
