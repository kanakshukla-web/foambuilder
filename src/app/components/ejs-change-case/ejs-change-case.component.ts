import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-ejs-change-case',
  templateUrl: './ejs-change-case.component.html',
  styleUrls: ['./ejs-change-case.component.css']
})
export class EjsChangeCaseComponent implements OnInit {

  @ViewChild('ejEditDialog') ejDialog: DialogComponent;

  @Output() submitForm = new EventEmitter();
  @Input() canvasProperties;

  isEditClicked = false;
  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '98%';
  public showCloseIcon: boolean = true;

  constructor() { }

  ngOnInit(): void { }

  openDialog() {
    this.isEditClicked = true;
  }

  onSubmit(editForm) {
    this.submitForm.emit(editForm);
  }

  closeDialog() {
    this.isEditClicked = false;
    this.ejDialog.hide();
  }
}
