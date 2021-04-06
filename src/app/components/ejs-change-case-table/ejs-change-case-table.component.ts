import { CanvasService } from './../../services/canvas/canvas.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CaseDescription } from 'src/app/interfaces/intefaces';

@Component({
  selector: 'app-ejs-change-case-table',
  templateUrl: './ejs-change-case-table.component.html',
  styleUrls: ['./ejs-change-case-table.component.css']
})
export class EjsChangeCaseTableComponent implements OnInit {

  CASE_DATA: CaseDescription[] = [];
  displayedColumns: string[] = ['select', 'CaseName', 'InteriorSize', 'UseCaseButton'];
  dataSource = new MatTableDataSource<CaseDescription>(this.CASE_DATA);
  selection = new SelectionModel<CaseDescription>(true, []);

  constructor(private canvasService: CanvasService) { }

  ngOnInit(): void {
    this.CASE_DATA = this.canvasService.getCaseDimensionsList();
    this.dataSource = new MatTableDataSource<CaseDescription>(this.CASE_DATA);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: CaseDescription): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.CaseName + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCase(name) {
    alert(name);
  }

}
