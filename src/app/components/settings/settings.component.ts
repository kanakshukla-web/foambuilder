import { CanvasService } from './../../services/canvas/canvas.service';
import { Settings } from './../../interfaces/intefaces';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  model = new Settings(1, 'settings', 0, 0);

  constructor(private canvasService: CanvasService) { }

  ngOnInit(): void { }

  onSubmit() {

    console.log(this.model);
    this.handleGridSize();
    this.closeNav();
  }

  handleGridSize() {
    this.canvasService.blockSnapSize = this.model.gridSize;
    this.canvasService.stage.children[1].destroy();
    this.canvasService.stage.draw();
    this.canvasService.drawKonvaGrid();
  }

  /* Set the width of the sidebar to 0 (hide it) */
  closeNav() {
    document.getElementById('mySettingsPanel').style.width = '0';
  }

  changeStatusOfGrid() {
    if (this.canvasService.stage.children[1].getCanvas()._canvas.style.display == "block") {
      this.canvasService.stage.children[1].getCanvas()._canvas.style.display = "none"
    }
    else if (this.canvasService.stage.children[1].getCanvas()._canvas.style.display == "none") {
      this.canvasService.stage.children[1].getCanvas()._canvas.style.display = "block"
    }
  }
}
