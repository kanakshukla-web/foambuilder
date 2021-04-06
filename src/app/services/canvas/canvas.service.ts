import { Injectable } from '@angular/core';
import { CaseDescription } from '../../interfaces/intefaces';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  constructor() { }

  getInitialConfigurations() {
    let canvasProperties = {
      case_name: 'Custom',
      foam_base: '33',
      canvasUpperLength: 475,
      canvasUpperWidth: 700,
      canvasDepth: 100,
      canvasLowerLength: 200,
      canvasLowerWidth: 120,
      canvasRadius: 25,
    };

    return JSON.stringify(canvasProperties);
  }

  getCaseDimensionsList() {
    const CASE_DATA: CaseDescription[] = [
      { CaseName: '3I-0702-1', InteriorSize: '197mm x 54mm x 16mm' },
      { CaseName: '3I-0705-3', InteriorSize: '191mm x 127mm x 70mm' },
      { CaseName: '3I-0806-3', InteriorSize: '216mm x 152mm x 81mm' },
      { CaseName: '3I-0907-4', InteriorSize: '241mm x 187mm x 73mm' },
      { CaseName: '3I-0907-6', InteriorSize: '241mm x 187mm x 125mm' },
      { CaseName: '3I-0702-1', InteriorSize: '197mm x 54mm x 16mm' },
      { CaseName: '3I-0705-3', InteriorSize: '191mm x 127mm x 70mm' },
      { CaseName: '3I-0806-3', InteriorSize: '216mm x 152mm x 81mm' },
      { CaseName: '3I-0907-4', InteriorSize: '241mm x 187mm x 73mm' },
      { CaseName: '3I-0907-6', InteriorSize: '241mm x 187mm x 125mm' },
      { CaseName: '3I-0702-1', InteriorSize: '197mm x 54mm x 16mm' },
      { CaseName: '3I-0705-3', InteriorSize: '191mm x 127mm x 70mm' },
      { CaseName: '3I-0806-3', InteriorSize: '216mm x 152mm x 81mm' },
      { CaseName: '3I-0907-4', InteriorSize: '241mm x 187mm x 73mm' },
      { CaseName: '3I-0907-6', InteriorSize: '241mm x 187mm x 125mm' },
    ];
    return CASE_DATA;
  }
}
