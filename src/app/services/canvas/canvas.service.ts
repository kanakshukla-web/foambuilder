import { ShapeService } from './../shapes/shape.service';
import { Injectable } from '@angular/core';
import Konva from 'konva';
import { CaseDescription } from '../../interfaces/intefaces';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  canvasProps = {
    case_name: 'Custom',
    foam_base: '33',
    upperLength: 470,//470
    upperWidth: 690,//690
    depth: 100,
    lowerLength: 200,
    lowerWidth: 120,
    radius: 0,
    zoomScaleValue: 0.01
  };
  stage: Konva.Stage;
  layer: Konva.Layer;
  group = new Konva.Group({
    x: 0,
    y: 0,
    rotation: 0,
    draggable: true,
  });
  Points = { x1: 0, y1: 0, x2: 0, y2: 0 };
  selectionRectangle = new Konva.Rect({ fill: 'rgba(0,0,255,0.5)' });
  tr: Konva.Transformer;
  transformers: Konva.Transformer[] = [];

  erase: boolean = false;
  selectedButton: any = {
    circle: false,
    rectangle: false,
    line: false,
    undo: false,
    erase: false,
    text: false,
    image: false,
  };

  constructor() { }

  initStage() {
    if (this.stage == null) {
      this.stage = new Konva.Stage({
        container: 'konvaContainer',
        width: this.canvasProps.upperWidth,
        height: this.canvasProps.upperLength,
      });
      this.layer = new Konva.Layer();
      this.fillKonvaContainerBorder();
      this.stage.add(this.layer);
      this.drawKonvaGrid();
    }
  }

  drawKonvaGrid() {
    let blockSnapSize = 35;
    var gridLayer = new Konva.Layer();
    var padding = blockSnapSize;

    for (var i = 0; i < this.canvasProps.upperWidth / padding; i++) {
      gridLayer.add(new Konva.Line({
        points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, this.canvasProps.upperLength],
        stroke: 'lightblue',
        strokeWidth: 1.2,
        listening: false
      }));
    }

    gridLayer.add(new Konva.Line({ points: [0, 0, 10, 10] }));
    for (var j = 0; j < this.canvasProps.upperLength / padding; j++) {
      gridLayer.add(new Konva.Line({
        points: [0, Math.round(j * padding), this.canvasProps.upperWidth, Math.round(j * padding)],
        stroke: 'lightblue',
        strokeWidth: 1.2,
        listening: false
      }));
    }
    this.stage.add(gridLayer);
    this.stage.add(this.layer);
  }

  fillKonvaContainerBorder() {
    let thickness: number = 35;
    let borderSize: number = 45;
    let fillColor = "white"

    //top
    var topRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.canvasProps.upperWidth,
      height: thickness,
      fill: fillColor,
      opacity: 0.5,
      cornerRadius: [borderSize, borderSize, 0, 0],
      listening: false
    })
    this.layer.add(topRect);

    //bottom
    var bottomRect = new Konva.Rect({
      x: 0,
      y: this.canvasProps.upperLength - thickness,
      width: this.canvasProps.upperWidth,
      height: thickness,
      fill: fillColor,
      opacity: 0.5,
      cornerRadius: [0, 0, borderSize, borderSize],
      listening: false
    })
    this.layer.add(bottomRect);

    //left
    var leftRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: thickness,
      height: this.canvasProps.upperLength,
      fill: fillColor,
      opacity: 0.5,
      cornerRadius: [borderSize, borderSize, 0, borderSize],
      listening: false
    })
    this.layer.add(leftRect);

    //right
    var rightRect = new Konva.Rect({
      x: this.canvasProps.upperWidth - thickness,
      y: 0,
      width: thickness,
      height: this.canvasProps.upperLength,
      fill: fillColor,
      opacity: 0.5,
      cornerRadius: [borderSize, borderSize, borderSize, 0],
      listening: false
    })
    this.layer.add(rightRect);
  }

  getInitialConfigurations() {
    return JSON.stringify(this.canvasProps);
  }

  initializeGroup() {
    const thisRef = this;
    this.group = new Konva.Group({
      x: 0,
      y: 0,
      rotation: 0,
      draggable: true,
      width: 150,
      height: 100,
      dragBoundFunc: function (pos) {
        var newX = pos.x < -150 ? -150 : pos.x;
        var newY = pos.y < -200 ? -200 : pos.y;
        return {
          x: newX,
          y: newY,
        };
      },
    });
  }

  initilaizeListnersOnStage() {
    // this.touchstart();
    // this.touchmove();
    // this.touchend();
    this.tapListner();
  }

  //<--------------------------------KONVA STAGE LISTENERS--------------------------------------------->
  touchstart() {
    this.stage.on('mousedown touchstart', (e) => {
      // do nothing if we mousedown on eny shape
      if (e.target !== this.stage) {
        return;
      }
      this.Points.x1 = this.stage.getPointerPosition().x;
      this.Points.y1 = this.stage.getPointerPosition().y;
      this.Points.x2 = this.stage.getPointerPosition().x;
      this.Points.y2 = this.stage.getPointerPosition().y;

      this.selectionRectangle.visible(true);
      this.selectionRectangle.width(0);
      this.selectionRectangle.height(0);
      this.layer.draw();
    });
  }

  touchmove() {
    this.stage.on('mousemove touchmove', () => {
      // no nothing if we didn't start selection
      if (this.selectionRectangle === undefined) {
        return;
      }
      if (!this.selectionRectangle.visible()) {
        return;
      }
      this.Points.x2 = this.stage.getPointerPosition().x;
      this.Points.y2 = this.stage.getPointerPosition().y;

      this.selectionRectangle.setAttrs({
        x: Math.min(this.Points.x1, this.Points.x2),
        y: Math.min(this.Points.y1, this.Points.y2),
        width: Math.abs(this.Points.x2 - this.Points.x1),
        height: Math.abs(this.Points.y2 - this.Points.y1),
      });
      this.layer.batchDraw();
    });
  }

  touchend() {
    this.stage.on('mouseup touchend', () => {
      // no nothing if we didn't start selection
      if (!this.selectionRectangle.visible()) {
        return;
      }
      // update visibility in timeout, so we can check it in click event
      setTimeout(() => {
        this.selectionRectangle.visible(false);
        this.layer.batchDraw();
      });

      //console.log(this.tr.nodes());
      var shapes = this.stage.find('.rect').toArray();
      var box = this.selectionRectangle.getClientRect();
      var selected = shapes.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );
      this.tr.nodes(selected);
      this.layer.batchDraw();
    });
  }

  tapListner() {
    // clicks should select/deselect shapes
    this.stage.on('click tap', (e) => {
      // if we are selecting with rect, do nothing
      if (this.selectionRectangle.visible()) {
        return;
      }

      // if click on empty area - remove all selections
      if (e.target === this.stage) {
        this.tr.nodes([]);
        this.layer.draw();
        return;
      }

      // do nothing if clicked NOT on our rectangles
      if (!e.target.hasName('rect')) {
        return;
      }

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = this.tr.nodes().indexOf(e.target) >= 0;

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        this.tr.nodes([e.target]);
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        const nodes = this.tr.nodes().slice(); // use slice to have new copy of array
        // remove node from array
        nodes.splice(nodes.indexOf(e.target), 1);
        this.tr.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        const nodes = this.tr.nodes().concat([e.target]);
        this.tr.nodes(nodes);
      }
      this.layer.draw();
    });
  }

  //<--------------------------------Selection AREA--------------------------------------------->

  clearSelection() {
    Object.keys(this.selectedButton).forEach((key) => {
      this.selectedButton[key] = false;
    });
  }

  setSelection(type: string) {
    this.selectedButton[type] = true;
  }

  addSelectionArea() {
    this.selectionRectangle.visible(false);
    this.layer.add(this.selectionRectangle);
    this.tr = new Konva.Transformer({});
    this.layer.add(this.tr);
  }

  //<--------------------------------Konva Line Listener--------------------------------------------->

  addLineListeners(shapeService: ShapeService) {
    const component = this;
    let lastLine;
    let isPaint;
    this.stage.on('mousedown touchstart', function (e) {
      if (!component.selectedButton['line'] && !component.erase) {
        return;
      }
      isPaint = true;
      let pos = component.stage.getPointerPosition();
      const mode = component.erase ? 'erase' : 'brush';
      lastLine = shapeService.line(pos, mode);
      //component.shapes.push(lastLine);
      component.layer.add(lastLine);
    });
    this.stage.on('mouseup touchend', function () {
      isPaint = false;
    });
    // and core function - drawing
    this.stage.on('mousemove touchmove', function () {
      if (!isPaint) {
        return;
      }
      const pos = component.stage.getPointerPosition();
      var newPoints = lastLine.points().concat([pos.x, pos.y]);
      lastLine.points(newPoints);
      component.layer.batchDraw();
    });
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
      },
      {
        CaseID: 2,
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
        CaseID: 3,
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
        CaseID: 4,
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
        CaseID: 5,
        CaseName: "MAX520TR",
        Length: 212,
        Width: 140,
        TotalDepth: 47,
        BaseDepth: 33,
        CornerRadius: 15,
        LowerLength: 205,
        LowerWidth: 131,
      },
      {
        CaseID: 6,
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
        CaseID: 7,
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
        CaseID: 8,
        CaseName: "3I-0907-4",
        Length: 212,
        Width: 140,
        TotalDepth: 47,
        BaseDepth: 33,
        CornerRadius: 15,
        LowerLength: 205,
        LowerWidth: 131,
      },
      {
        CaseID: 9,
        CaseName: "Custom",
        Length: 470,
        Width: 690,
        TotalDepth: 33,
        BaseDepth: 33,
        CornerRadius: 25,
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
