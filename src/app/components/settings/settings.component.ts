import { Settings } from './../../interfaces/intefaces';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  model = new Settings(1, 'settings', 0, 0);

  constructor() {}

  ngOnInit(): void {}
  onSubmit() {
    console.log(this.model);
  }

  /* Set the width of the sidebar to 0 (hide it) */
  closeNav() {
    document.getElementById('mySettingsPanel').style.width = '0';
  }
}
