export class Rectangle {
  constructor(
    public id: number,
    public name: string,
    public length: number,
    public width: number,
    public fingerNotch: string,
    public depth: number,
    public cornerRadius?: number
  ) { }
}

export class Circle {
  constructor(
    public id: number,
    public name: string,
    public diameter: number,
    public depth: number,
    public fingerNotch: string,
    public width?: number,
    public cornerRadius?: number
  ) { }
}

export class Settings {
  constructor(
    public id: number,
    public name: string,
    public gridSize: number,
    public nudgeSpacing: number,
    public units?: string
  ) { }
}

export class ShapeLib {
  constructor(
    public id: number,
    public keyword?: string,
    public category?: string,
    public brand?: string,
    public shapes?: string,
    public shapeImg?: string,
    public shapeDimensions?: string
  ) { }
}

export class Properties {
  constructor(
    public id: number,
    public shape_name: string,
    public length: number,
    public width: number,
    public depth: number,
    public xLoc: number,
    public yLoc: number,
    public angle: number,
    public image_Src?: string
  ) { }
}

export class AccountData {
  constructor(
    public id: number,
    public headerTitle?: string,
    public linkText?: string,
    public forgotButtonText?: string,
    public buttonText?: string
  ) { }
}

export interface CaseDescription {
  CaseID: number,
  CaseName: string;
  InteriorSize?: string;
  Length: number,
  Width: number,
  TotalDepth: number,
  BaseDepth: number,
  CornerRadius: number,
  LowerLength: number,
  LowerWidth: number
}
