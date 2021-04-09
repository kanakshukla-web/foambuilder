import { SharedService } from './../../services/shared.service';
import { ConfirmDialogComponent } from './../shared/confirm-dialog/confirm-dialog.component';
import { TextNodeService } from './../../services/textNode/text-node.service';
import { CanvasService } from './../../services/canvas/canvas.service';
import { ShapeService } from './../../services/shapes/shape.service';
import { EjsChangeCaseComponent } from './../ejs-change-case/ejs-change-case.component';
import { EjsTrayBuilderComponent } from './../ejs-tray-builder/ejs-tray-builder.component';
import { Properties, Rectangle } from '../../interfaces/intefaces';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { Observable, of } from 'rxjs';
import Konva from 'konva';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('myCanvas', { static: false })
  canvas: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D;

  @ViewChild('ejEditDialog') ejDialog: DialogComponent;
  public targetElement: HTMLElement;
  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '95%';
  public showCloseIcon: boolean = true;

  @ViewChild('trayChild') trayChild: EjsTrayBuilderComponent;
  @ViewChild('changeCase') changeCase: EjsChangeCaseComponent;

  img_Src: any;
  panelOpenState = false;

  // canvas properties
  canvasProperties = {
    case_name: '',
    foam_base: '',
    canvasUpperLength: 0,
    canvasUpperWidth: 0,
    canvasDepth: 0,
    canvasLowerLength: 0,
    canvasLowerWidth: 0,
    canvasRadius: 0,
  };

  isEditClicked = false;
  isCanvasUpdated = false;
  isPropertiesPanelShown = false;

  propertiesObject: Properties = {
    id: 1,
    shape_name: 'rectangle',
    length: 100,
    width: 200,
    depth: 50,
    xLoc: 150,
    yLoc: 150,
    angle: 90,
  };

  xAxis: number;
  yAxis: number;
  isShapeDragStarted: boolean = false;
  newBoundriesShape: any;

  public configStage: Observable<any> = of({
    width: this.canvasProperties.canvasUpperWidth,
    height: this.canvasProperties.canvasUpperLength,
  });
  // public configCircle: Observable<any> = of({
  //   x: 200,
  //   y: 200,
  //   radius: 70,
  //   fill: 'red',
  //   draggable: true,
  //   stroke: 'black',
  //   strokeWidth: 4,
  // });

  shapes: any = [];
  stage: Konva.Stage;
  layer: Konva.Layer;
  selectedButton: any = {
    circle: false,
    rectangle: false,
    line: false,
    undo: false,
    erase: false,
    text: false,
    image: false,
  };
  erase: boolean = false;
  transformers: Konva.Transformer[] = [];
  openTrayCount = 0;
  //isTrayClicked = false;
  tr: Konva.Transformer;

  x1: number;
  y1: number;
  x2: number;
  y2: number;
  selectionRectangle = new Konva.Rect({
    fill: 'rgba(0,0,255,0.5)',
  });
  nodesArray = [];

  constructor(
    private shapeService: ShapeService,
    private canvasService: CanvasService,
    private textNodeService: TextNodeService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.canvasProperties = JSON.parse(this.canvasService.getInitialConfigurations());
  }

  ngAfterViewChecked() {
    if (this.isCanvasUpdated) {
      this.fillCanvasBorder();
      this.drawBoard();
      alert('Canvas settings updated successfully.');
      this.isCanvasUpdated = false;
    }
  }

  ngAfterViewInit(): void {
    this.initilizeCanvas(this.canvasProperties.canvasUpperLength, this.canvasProperties.canvasUpperWidth);
    this.initStage();
    this.addLineListeners();

    this.addSelectionRect();
    this.initilaizeListnersOnStage();
  }

  initilaizeListnersOnStage() {
    this.touchstart();
    this.touchmove();
    this.touchend();
    this.tapListner();
  }

  initilizeCanvas(length, width) {
    this.canvasProperties.canvasUpperLength = length; // length = height
    this.canvasProperties.canvasUpperWidth = width;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = this.canvasProperties.canvasUpperWidth;
    this.canvas.nativeElement.height = this.canvasProperties.canvasUpperLength;

    this.fillCanvasBorder();
    this.drawBoard();
  }

  drawBoard() {
    // canvas grid
    var bw = this.canvasProperties.canvasUpperWidth; // Box width
    var bh = this.canvasProperties.canvasUpperLength; // Box height
    var p = 0; // Padding

    for (var x = 0; x <= bw; x += 30) {
      this.ctx.moveTo(0.5 + x + p, p);
      this.ctx.lineTo(0.5 + x + p, bh + p);
    }

    for (var x = 0; x <= bh; x += 30) {
      this.ctx.moveTo(p, 0.5 + x + p);
      this.ctx.lineTo(bw + p, 0.5 + x + p);
    }
    this.ctx.strokeStyle = 'lightblue';
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();
  }

  fillCanvasBorder() {
    // fill grid colors to canvas
    //top
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvasProperties.canvasUpperWidth, 55);
    this.ctx.fillStyle = '#FFFFDA';
    this.ctx.fill();

    //bottom
    this.ctx.beginPath();
    this.ctx.rect(0, this.canvasProperties.canvasUpperLength - 50, this.canvasProperties.canvasUpperWidth, 55);
    this.ctx.fillStyle = '#FFFFDA';
    this.ctx.fill();

    //left
    this.ctx.beginPath();
    this.ctx.rect(0, 0, 55, 555);
    this.ctx.fillStyle = '#FFFFDA';
    this.ctx.fill();

    //right
    this.ctx.beginPath();
    this.ctx.rect(this.canvasProperties.canvasUpperWidth - 55, 0, 55, 555);
    this.ctx.fillStyle = '#FFFFDA';
    this.ctx.fill();
  }

  closeDialog() {
    this.isEditClicked = false;
    //this.isTrayClicked = false;
    this.hideBuilderTray();
    this.ejDialog.hide();
  }

  handleEdit() {
    //this.isEditClicked = true;
    this.changeCase.openDialog();
  }

  handleTray() {
    //this.isTrayClicked = true;
    this.trayChild.openTray();
  }

  public onOverlayClick: EmitType<object> = () => {
    this.ejDialog.hide();
  };

  addImageToCanvas() {
    this.img_Src = new Image();
    this.img_Src.src = '/assets/web.jpg';
    this.img_Src.onload = () => {
      this.ctx.drawImage(this.img_Src, 80, 80);
    };
  }

  onSubmit(formInput) {
    this.canvasProperties.canvasUpperLength = formInput.elements['upperlength'].value;
    this.canvasProperties.canvasUpperWidth = formInput.elements['upperwidth'].value;

    this.isCanvasUpdated = true;
    this.initilizeCanvas(this.canvasProperties.canvasUpperLength, this.canvasProperties.canvasUpperWidth);
    //this.closeDialog();
    this.changeCase.closeDialog();
  }

  updateCanvasFormArea(CaseObj) {
    //alert(`I am from Dashboard Component. Your CaseName ${CaseObj.CaseName} && Dimensions ${CaseObj.CaseDimensions}`);
    let { CaseName, CornerRadius, LowerLength, LowerWidth, TotalDepth, Length, Width } = CaseObj[0];

    this.canvasProperties.case_name = CaseName;
    this.canvasProperties.canvasRadius = CornerRadius;
    this.canvasProperties.canvasLowerLength = LowerLength;
    this.canvasProperties.canvasLowerWidth = LowerWidth;
    this.canvasProperties.foam_base = TotalDepth;

    this.canvasProperties.canvasUpperLength = Length;
    this.canvasProperties.canvasUpperWidth = Width;
    this.isCanvasUpdated = true;
    this.initilizeCanvas(this.canvasProperties.canvasUpperLength, this.canvasProperties.canvasUpperWidth);
    this.changeCase.closeDialog();
  }

  expandDiv(id) {
    switch (id) {
      case 'case-info':
        const icon = document.getElementById('expand');

        if (icon.classList.contains('fa-chevron-down')) {
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-up');
          document.getElementById('case-info').style.height = '90px';
        } else {
          icon.classList.remove('fa-chevron-up');
          icon.classList.add('fa-chevron-down');
          document.getElementById('case-info').style.height = '40px';
        }
        break;
      case 'tray-builder':
        this.openTrayCount == 0
          ? this.showBuilderTray()
          : this.hideBuilderTray();
        break;
    }
  }

  showBuilderTray() {
    document.getElementById('hidden-tray').style.display = 'block';
    this.openTrayCount++;
  }

  hideBuilderTray() {
    document.getElementById('hidden-tray').style.display = 'none';
    this.openTrayCount = 0;
  }

  confirmDialog(shape): void {
    let dialogRef = this.sharedService.showConfirmationDialog();
    dialogRef.afterClosed().subscribe(dialogResult => {
      (dialogResult) ? this.deleteShape(shape) : null;
    });
  }

  deleteShape(shape) {
    const removedShape = this.shapes.pop();
    this.transformers.forEach((t) => {
      t.detach();
    });
    if (removedShape) {
      removedShape.remove();
    }
    this.layer.draw();
    this.isPropertiesPanelShown = false;
  }

  //<---------Konva Methods------------------->

  initStage() {
    if (this.stage == null) {
      let width = this.canvasProperties.canvasUpperWidth;
      let height = this.canvasProperties.canvasUpperLength;
      this.stage = new Konva.Stage({
        container: 'konvaContainer',
        width: width,
        height: height,
      });
      this.layer = new Konva.Layer();
      this.stage.add(this.layer);
    }
  }

  clearSelection() {
    Object.keys(this.selectedButton).forEach((key) => {
      this.selectedButton[key] = false;
    });
  }

  setSelection(type: string) {
    this.selectedButton[type] = true;
  }

  addShape(type: string, event) {
    this.clearSelection();
    this.setSelection(type);

    switch (type) {
      case 'circle':
        this.drawCircle(+event.diameter, 150, 150);
        break;
      case 'rectangle':
        this.drawRectangle(+event.length, +event.width, 90, 90);
        break;
      case 'image':
        this.renderImage('/assets/cbimage.jpg', 350, 150);
        break;
      case 'line':
        this.drawLine();
        break;
      case 'text':
        this.createText();
        break;
    }
  }

  // draws circle on the canvas area
  drawCircle(radius: number, xAxis: number, yAxix: number) {
    const circle = this.shapeService.circle(radius, xAxis, yAxix);

    //<----- add listners to circle--------->
    circle.addEventListener('click', () => {
      this.getNewcircleDimensions(circle, radius);
      this.isPropertiesPanelShown = true;
    });

    circle.addEventListener('dragend', () => {
      this.getNewcircleDimensions(circle, radius);
      this.isShapeDragStarted = false;
    });

    circle.addEventListener('dragmove', (event) => {
      this.isShapeDragStarted = true;
      this.xAxis = Math.round(circle.absolutePosition().x);
      this.yAxis = Math.round(circle.absolutePosition().y);
    });

    circle.addEventListener('transformstart', () => { });
    circle.addEventListener('transform', () => { });
    circle.addEventListener('transformend', () => {
      this.getNewcircleDimensions(circle,radius);
    });

    this.shapes.push(circle);
    this.layer.add(circle);
    this.stage.add(this.layer);
    this.addTransformerListeners();

    this.nodesArray.push(circle);
    this.tr.nodes(this.nodesArray);
    this.layer.draw();
  }

  getNewcircleDimensions(circle, radius) {
    let condition = this.newBoundriesShape != null;

    let newHeight = condition
      ? Math.round(this.newBoundriesShape.height)
      : circle.getSelfRect().height;
    let newWidth = condition
      ? Math.round(this.newBoundriesShape.width)
      : circle.getSelfRect().width;
    let rotation = condition
      ? Math.round(this.newBoundriesShape.rotation)
      : circle.rotation();

    return (this.propertiesObject = {
      id: 2,
      shape_name: 'circle',
      length: newHeight,
      width: newWidth,
      depth: 50,
      xLoc: Math.round(circle.absolutePosition().x),
      yLoc: Math.round(circle.absolutePosition().y),
      angle: rotation,
    });
  }


  //draws rectangle on the canvas
  drawRectangle(
    rectWidth: number,
    rectHeight: number,
    xLocation: number,
    yLocation: number
  ) {
    const rectangle = this.shapeService.rectangle(
      rectWidth,
      rectHeight,
      xLocation,
      yLocation
    );

    //<----- add listners to rectangle--------->
    rectangle.addEventListener('click', () => {
      this.getNewRectDimensions(rectangle);
      this.isPropertiesPanelShown = true;
    });

    rectangle.addEventListener('dragend', (event) => {
      this.getNewRectDimensions(rectangle);
      this.isShapeDragStarted = false;
    });

    rectangle.addEventListener('transformstart', () => { });
    rectangle.addEventListener('transform', () => { });
    rectangle.addEventListener('transformend', () => {
      this.getNewRectDimensions(rectangle);
    });

    rectangle.addEventListener('dragmove', (event) => {
      this.isShapeDragStarted = true;
      this.xAxis = Math.round(rectangle.absolutePosition().x);
      this.yAxis = Math.round(rectangle.absolutePosition().y);
    });

    this.shapes.push(rectangle);
    this.layer.add(rectangle);
    this.stage.add(this.layer);
    this.addTransformerListeners();

    this.nodesArray.push(rectangle);
    this.tr.nodes(this.nodesArray);
    this.layer.draw();
  }

  createText() {
    const text = this.textNodeService.textNode(this.stage, this.layer);
    this.shapes.push(text.textNode);
    this.transformers.push(text.tr);
  }

  getNewRectDimensions(rectangle) {
    let condition = this.newBoundriesShape != null;

    let newHeight = condition
      ? Math.round(this.newBoundriesShape.height)
      : rectangle.getSelfRect().height;
    let newWidth = condition
      ? Math.round(this.newBoundriesShape.width)
      : rectangle.getSelfRect().width;
    let rotation = condition
      ? Math.round(this.newBoundriesShape.rotation)
      : rectangle.rotation();

    return (this.propertiesObject = {
      id: 2,
      shape_name: 'rectangle',
      length: newHeight,
      width: newWidth,
      depth: 50,
      xLoc: Math.round(rectangle.absolutePosition().x),
      yLoc: Math.round(rectangle.absolutePosition().y),
      angle: rotation,
    });
  }

  renderImage(imageUrl: string, xAxis: number, yAxix: number) {
    var imageObj = new Image();
    const image = this.shapeService.image(imageUrl, imageObj, xAxis, yAxix);

    imageObj.onload = function () {
      image;
    };

    image.addEventListener('click', () => {
      this.propertiesObject = {
        id: 3,
        shape_name: 'image',
        length: image.getHeight(),
        width: image.getWidth(),
        depth: 50,
        xLoc: Math.round(image.absolutePosition().x),
        yLoc: Math.round(image.absolutePosition().y),
        angle: 90,
        image_Src: '/assets/cbimage.jpg',
      };
      this.isPropertiesPanelShown = true;
    });

    image.addEventListener('dragend', (event) => {
      this.propertiesObject = {
        id: 3,
        shape_name: 'image',
        length: image.getHeight(),
        width: image.getWidth(),
        depth: 50,
        xLoc: Math.round(image.absolutePosition().x),
        yLoc: Math.round(image.absolutePosition().y),
        angle: 90,
        image_Src: '/assets/cbimage.jpg',
      };
      this.isShapeDragStarted = false;
    });

    image.addEventListener('dragmove', (event) => {
      this.isShapeDragStarted = true;
      this.xAxis = Math.round(image.absolutePosition().x);
      this.yAxis = Math.round(image.absolutePosition().y);
    });

    this.shapes.push(image);
    this.layer.add(image);
    this.layer.batchDraw();
    this.stage.add(this.layer);
    this.addTransformerListeners();
  }

  drawLine() {
    this.selectedButton['line'] = true;
  }

  addSelectionRect() {
    // add a new feature, lets add ability to draw selection rectangle

    this.selectionRectangle.visible(false);
    this.layer.add(this.selectionRectangle);

    this.tr = new Konva.Transformer({});
    this.layer.add(this.tr);
  }

  touchstart() {
    this.stage.on('mousedown touchstart', (e) => {
      // do nothing if we mousedown on eny shape
      if (e.target !== this.stage) {
        return;
      }
      this.x1 = this.stage.getPointerPosition().x;
      this.y1 = this.stage.getPointerPosition().y;
      this.x2 = this.stage.getPointerPosition().x;
      this.y2 = this.stage.getPointerPosition().y;

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
      this.x2 = this.stage.getPointerPosition().x;
      this.y2 = this.stage.getPointerPosition().y;

      this.selectionRectangle.setAttrs({
        x: Math.min(this.x1, this.x2),
        y: Math.min(this.y1, this.y2),
        width: Math.abs(this.x2 - this.x1),
        height: Math.abs(this.y2 - this.y1),
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

  undo() {
    const removedShape = this.shapes.pop();
    this.transformers.forEach((t) => {
      t.detach();
    });
    if (removedShape) {
      removedShape.remove();
    }
    this.layer.draw();
  }

  startCloning(event) {
    //console.log(event);
    switch (event.shape_name) {
      case 'rectangle':
        this.drawRectangle(
          event.length,
          event.width,
          event.xLoc + 25,
          event.yLoc + 24
        );
        break;
      case 'circle':
        this.drawCircle(event.width, event.xLoc + 25, event.yLoc + 24);
        break;
      case 'image':
        this.renderImage(event.image_Src, event.xLoc + 25, event.yLoc + 24);
        break;
    }
  }

  addLineListeners() {
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
      lastLine = component.shapeService.line(pos, mode);
      component.shapes.push(lastLine);
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

  addTransformerListeners() {
    const component = this;
    component.tr = new Konva.Transformer({
      boundBoxFunc: function (oldBoundBox, newBoundBox) {
        component.newBoundriesShape = newBoundBox;
        console.log(component.newBoundriesShape);
        return newBoundBox;
      },
    });
    this.stage.on('click', function (e) {
      if (!this.clickStartShape) {
        return;
      }
      if (e.target._id == this.clickStartShape._id) {
        component.addDeleteListener(e.target);
        component.layer.add(component.tr);
        component.tr.attachTo(e.target);
        component.transformers.push(component.tr);
        component.layer.draw();
      } else {
        component.tr.detach();
        component.layer.draw();
        component.isPropertiesPanelShown = false;
        component.propertiesObject = undefined;
      }
    });
  }

  addDeleteListener(shape) {
    const component = this;
    window.addEventListener('keydown', function (e) {
      if (e.keyCode === 46) {
        shape.remove();
        component.transformers.forEach((t) => {
          t.detach();
        });
        const selectedShape = component.shapes.find((s) => s._id == shape._id);
        selectedShape.remove();
        e.preventDefault();
      }
      component.layer.batchDraw();
    });
  }
}
