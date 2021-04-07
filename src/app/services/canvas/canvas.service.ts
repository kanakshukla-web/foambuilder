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
      {
        CaseID: 1,
        CaseName: "MAX002",
        Length: 212,
        Width: 140,
        TotalDepth: 47,
        BaseDepth: 33,
        CornerRadius: 15,
        LowerLength: 205,
        LowerWidth: 131,
      }, {
        CaseID: 1,
        CaseName: "Nanuk 905",
        Length: 197,
        Width: 54,
        TotalDepth: 16,
        BaseDepth: 33,
        CornerRadius: 12,
        LowerLength: 190,
        LowerWidth: 50,
      },
      {
        CaseID: 1,
        CaseName: "Nanuk 330",
        Length: 433,
        Width: 167,
        TotalDepth: 113,
        BaseDepth: 33,
        CornerRadius: 10,
        LowerLength: 425,
        LowerWidth: 162,
      },
      {
        CaseID: 1,
        CaseName: "3I-0702-1",
        Length: 559,
        Width: 330,
        TotalDepth: 251,
        BaseDepth: 33,
        CornerRadius: 10,
        LowerLength: 555,
        LowerWidth: 325,
      },
      {
        CaseID: 1,
        CaseName: "MAX520TR",
        Length: 212,
        Width: 140,
        TotalDepth: 47,
        BaseDepth: 33,
        CornerRadius: 15,
        LowerLength: 205,
        LowerWidth: 131,
      }, {
        CaseID: 1,
        CaseName: "MAX235H155",
        Length: 212,
        Width: 140,
        TotalDepth: 47,
        BaseDepth: 33,
        CornerRadius: 15,
        LowerLength: 205,
        LowerWidth: 131,
      },
      {
        CaseID: 1,
        CaseName: "3I-0705-3",
        Length: 212,
        Width: 140,
        TotalDepth: 47,
        BaseDepth: 33,
        CornerRadius: 15,
        LowerLength: 205,
        LowerWidth: 131,
      },
      {
        CaseID: 1,
        CaseName: "3I-0907-4",
        Length: 212,
        Width: 140,
        TotalDepth: 47,
        BaseDepth: 33,
        CornerRadius: 15,
        LowerLength: 205,
        LowerWidth: 131,
      }

    ];

    CASE_DATA.forEach(element => {
      element.InteriorSize = `${element.Length}mm x ${element.Width}mm x ${element.TotalDepth}mm`
    });
    return CASE_DATA;
  }
}
