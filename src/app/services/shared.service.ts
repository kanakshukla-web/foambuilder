import { ConfirmDialogComponent } from './../components/shared/confirm-dialog/confirm-dialog.component';
import { Injectable } from '@angular/core';
import { ConfirmDialogModel } from '../components/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private result: string = '';
  constructor(private dialog: MatDialog) { }

  showConfirmationDialog() {
    const message = `Are you sure you want to delete this shape?`;
    const dialogData = new ConfirmDialogModel("Confirm Delete", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });

    return dialogRef;
  }

  getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
