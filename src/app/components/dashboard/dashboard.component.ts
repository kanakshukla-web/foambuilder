import { Circle } from 'src/app/interfaces/intefaces';
import { RectanglecustomnotchComponent } from './../rectanglecustomnotch/rectanglecustomnotch.component';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import Konva from 'konva';
import { Observable, of } from 'rxjs';
import { Properties } from '../../interfaces/intefaces';
import { CanvasService } from './../../services/canvas/canvas.service';
import { ShapeService } from './../../services/shapes/shape.service';
import { SharedService } from './../../services/shared.service';
import { TextNodeService } from './../../services/textNode/text-node.service';
import { EjsChangeCaseComponent } from './../ejs-change-case/ejs-change-case.component';
import { EjsTrayBuilderComponent } from './../ejs-tray-builder/ejs-tray-builder.component';

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
  @ViewChild('customNotch') customNotchChild: RectanglecustomnotchComponent;

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

  isCanvasUpdated = false;
  isPropertiesPanelShown = false;

  propertiesObject: Properties = {
    id: 0, shape_name: '', length: 0, width: 0, depth: 0, xLoc: 0, yLoc: 0, angle: 0,
  };

  xAxis: number;
  yAxis: number;
  isShapeDragStarted: boolean = false;
  newBoundriesShape: any;

  public configStage: Observable<any> = of({
    width: this.canvasProperties.canvasUpperWidth,
    height: this.canvasProperties.canvasUpperLength,
  });

  shapes: any = [];
  stage: Konva.Stage;
  layer: Konva.Layer;
  group = new Konva.Group({
    x: 0,
    y: 0,
    rotation: 0,
    draggable: true,
  });

  shape_rect_color = '#93DC85';
  shape_circle_color = '#93DC85';
  shape_notch_color = '#B36DD1';

  activeShape;

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
  tr: Konva.Transformer;

  Points = { x1: 0, y1: 0, x2: 0, y2: 0 };
  selectionRectangle = new Konva.Rect({ fill: 'rgba(0,0,255,0.5)' });
  nodesArray = [];
  shapeDepth: number;

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
      //alert('Canvas settings updated successfully.');
      this.isCanvasUpdated = false;
    }
  }

  ngAfterViewInit(): void {
    this.initilizeCanvas();
    this.initStage();
    //this.addLineListeners();

    this.addSelectionArea();
    this.initilaizeListnersOnStage();
  }

  stageClickListener() {
    this.isPropertiesPanelShown = false;
    //this.activeShape.attrs.fill = this.shape_rect_color;
  }

  initilaizeListnersOnStage() {
    // this.touchstart();
    // this.touchmove();
    // this.touchend();
    this.tapListner();
  }

  initilizeCanvas() {

    this.canvasProperties.canvasUpperLength = this.canvasProperties.canvasUpperLength; // length = height
    this.canvasProperties.canvasUpperWidth = this.canvasProperties.canvasUpperWidth;
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
    this.ctx.rect(0, 0, this.canvasProperties.canvasUpperWidth, 30);
    //this.ctx.fillStyle = '#FFFFDA';
    this.ctx.fillStyle = '#EDEDED';
    this.ctx.fill();

    //bottom
    this.ctx.beginPath();
    this.ctx.rect(0, this.canvasProperties.canvasUpperLength - 30, this.canvasProperties.canvasUpperWidth, 55);
    this.ctx.fillStyle = '#EDEDED';
    this.ctx.fill();

    //left
    this.ctx.beginPath();
    this.ctx.rect(0, 0, 30, 555);
    this.ctx.fillStyle = '#EDEDED';
    this.ctx.fill();

    //right
    this.ctx.beginPath();
    this.ctx.rect(this.canvasProperties.canvasUpperWidth - 30, 0, 55, 555);
    this.ctx.fillStyle = '#EDEDED';
    this.ctx.fill();
  }

  closeDialog() {
    //this.isTrayClicked = false;
    this.hideBuilderTray();
    this.ejDialog.hide();
  }

  handleEdit() {
    this.changeCase.openDialog();
  }

  handleTray() {
    //this.isTrayClicked = true;
    this.trayChild.openTray();
  }

  public onOverlayClick: EmitType<object> = () => {
    this.ejDialog.hide();
  };

  onSubmit(formInput) {
    this.canvasProperties.canvasUpperLength = formInput.elements['upperlength'].value;
    this.canvasProperties.canvasUpperWidth = formInput.elements['upperwidth'].value;

    this.isCanvasUpdated = true;
    this.initilizeCanvas();
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
    this.initilizeCanvas();
    this.changeCase.closeDialog();
  }

  expandDiv(id: string) {
    switch (id) {
      case 'case-info':
        const icon = document.getElementById('expand');

        if (icon.classList.contains('fa-chevron-down')) {
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-up');
          document.getElementById('case-info').style.height = '100px';
        } else {
          icon.classList.remove('fa-chevron-up');
          icon.classList.add('fa-chevron-down');
          document.getElementById('case-info').style.height = '50px';
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

  randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  addShape(type: string, event) {
    this.clearSelection();
    this.setSelection(type);
    this.shapeDepth = +event.depth;

    switch (type) {
      case 'circle':
        const circleObj = {
          radius: +event.diameter,
          xAxis: 150,
          yAxix: 150,
          fillColor: '#4BC433',
          strokeColor: 'black',
          isDraggable: true,
          notcheType: event.fingerNotch
        }
        this.selectCircleType(circleObj);
        break;

      case 'rectangle':
        const rectObj = {
          rectWidth: +event.length,
          rectHeight: +event.width,
          xAxis: 90 + this.randomNumber(10, 50),
          yAxis: 90 + this.randomNumber(10, 50),
          notcheType: event.fingerNotch,
          cornerRadius: event.cornerRadius,
          isDraggable: false,
          fillColor: this.shape_rect_color,
          strokeColor: 'black',
        }
        this.drawRectangle(rectObj);
        break;

      case 'image':
        this.drawImage('/assets/cbimage.jpg', 350, 150);
        break;

      case 'line':
        this.drawLine();
        break;

      case 'text':
        let textProps = {
          textString: 123,
          xLoc: 100,
          yLoc: 100
        }
        this.createText(textProps);
        break;
    }
  }

  //<----------------------------------Konva Methods--------------------------------------------->

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
      //this.stage.addEventListener('click', this.stageClickListener);
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

  addShapeToKonvaLayer(shape) {
    console.log(shape);
    // this.shapes = [];
    // this.nodesArray = [];

    this.shapes.push(shape);
    this.layer.add(shape);
    this.stage.add(this.layer);
    this.addTransformerListeners();

    this.nodesArray.push(shape);
    this.tr.nodes(this.nodesArray);
    this.layer.draw();
  }

  addGroupinKonvaLayer(group, text) {
    this.tr = new Konva.Transformer();
    this.layer.add(this.tr);
    this.stage.add(this.layer);
    this.tr.nodes([this.group]);
    this.layer.draw();
    this.stage.draw();
  }

  //<--------------------------------CIRCLE--------------------------------------------->

  selectCircleType(circleObj) {

    let { radius, xAxis, yAxis } = circleObj;

    let textProps = {
      textString: this.shapeDepth,
      xLoc: xAxis + radius / 2,
      yLoc: yAxis + radius / 2
    }

    switch (circleObj.notcheType) {
      case 'Top and Bottom':
        break;

      case 'Left and Right':
        break;

      case 'None':
        let circle = this.drawCircle(circleObj);
        this.initializeListnersOnCircle(circle, circleObj.radius);
        this.addShapeToKonvaLayer(circle);
        break;

      case 'Custom Notch Replacememt': this.handleCustomNotch();
        break;

      default:
        break;
    }
  }

  drawCircle(circleProp) {
    const { radius, xAxis, yAxix, fillColor, strokeColor, isDraggable } = circleProp;
    const circle = this.shapeService.circle(radius, xAxis, yAxix, fillColor, strokeColor, isDraggable);
    //this.initializeListnersOnCircle(circle, radius);
    //this.addShapeToKonvaLayer(circle);
    return circle;
  }

  initializeListnersOnCircle(circle: Konva.Circle, radius: number) {
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
    circle.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    circle.on('mouseout', function () {
      document.body.style.cursor = 'default';
    });

    circle.addEventListener('transformstart', () => { });
    circle.addEventListener('transform', () => { });
    circle.addEventListener('transformend', () => {
      this.getNewcircleDimensions(circle, radius);
    });
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
      depth: this.shapeDepth,
      xLoc: Math.round(circle.absolutePosition().x),
      yLoc: Math.round(circle.absolutePosition().y),
      angle: rotation,
    });
  }

  //<--------------------------------RECTANGLE--------------------------------------------->

  drawRectangle(rectProps) {

    const { rectWidth, rectHeight, xAxis, yAxis, notcheType } = rectProps;
    this.initializeGroup();

    let circleObj = {
      radius: 30,
      xAxis: xAxis + rectWidth / 2,
      yAxix: yAxis,
      fillColor: this.shape_notch_color,
      strokeColor: '#B36DD1',
      isDraggable: false
    }

    let textProps = {
      textString: this.shapeDepth,
      xLoc: xAxis + rectWidth / 2,
      yLoc: yAxis + rectHeight / 2
    }

    switch (notcheType) {
      case 'Top and Bottom':
        let top_notch = this.drawCircle(circleObj); //top_notch
        circleObj.yAxix = yAxis + rectHeight;
        let bottom_notch = this.drawCircle(circleObj);//bottom_notch
        this.updateGroup(this.createRect(rectProps), top_notch, bottom_notch, this.createText(textProps));
        break;

      case 'Left and Right':
        circleObj.xAxis = xAxis;
        circleObj.yAxix = yAxis + rectHeight / 2;
        let left_notch = this.drawCircle(circleObj);//left_notch
        circleObj.xAxis = xAxis + rectWidth;
        let right_notch = this.drawCircle(circleObj); //right_notch
        this.updateGroup(this.createRect(rectProps), left_notch, right_notch, this.createText(textProps));
        break;

      case 'None':
        this.group.add(this.createRect(rectProps), this.createText(textProps));
        this.initializeListnerOnGroup(this.group);
        this.addShapeToKonvaLayer(this.group);
        break;

      case 'Custom Notch Replacememt': this.handleCustomNotch();
        break;

      default:
        rectProps.isDraggable = true;
        const default_rect = this.createRect(rectProps);
        this.initilizeListenersOnRectangle(default_rect);
        this.addShapeToKonvaLayer(default_rect);
        break;
    }
  }

  createRect(rectProps) {
    const rectangle = this.shapeService.rectangle(rectProps);
    //this.initilizeListenersOnRectangle(rectangle);
    //this.addShapeToKonvaLayer(rectangle);
    return rectangle;
  }

  handleCustomNotch() {
    this.customNotchChild.openCustomNotchDialog();
  }

  updateGroup(rect: Konva.Rect, first_notch: Konva.Circle, second_notch: Konva.Circle, center_text: Konva.Text) {
    this.group.add(rect, first_notch, second_notch, center_text);
    this.initializeListnerOnGroup(this.group);
    this.addShapeToKonvaLayer(this.group);
  }

  initializeListnerOnGroup(group: Konva.Group) {
    group.addEventListener('click', (event) => {
      this.isPropertiesPanelShown = true;
      this.activeShape = group.children[0];
      this.activeShape.attrs.fill = '#4BC433';
      this.setGroupProperties(group);
    });

    group.addEventListener('dragmove', (event) => {
      this.isShapeDragStarted = true;
      this.xAxis = Math.round(group.children[0].absolutePosition().x);
      this.yAxis = Math.round(group.children[0].absolutePosition().y);
    });

    group.addEventListener('dragend', (event) => {
      this.setGroupProperties(group);
      this.isShapeDragStarted = false;
    });

    group.children[0].addEventListener('transformstart', (event) => { });
    group.children[0].addEventListener('transform', (event) => { });
    group.children[0].addEventListener('transformend', (event) => {
      this.getNewRectDimensions(group.children[0]);
    });

    group.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });

    group.on('mouseout', function () {
      document.body.style.cursor = 'default';
    });
  }

  setGroupProperties(group: Konva.Group) {
    let condition = this.newBoundriesShape != null;

    let newHeight = condition
      ? Math.round(this.newBoundriesShape.height)
      : group.children[0].attrs.width;
    let newWidth = condition
      ? Math.round(this.newBoundriesShape.width)
      : group.children[0].attrs.height;
    let rotation = condition
      ? Math.round(this.newBoundriesShape.rotation)
      : group.children[0].rotation();

    return (this.propertiesObject = {
      id: group._id,
      shape_name: 'group',
      length: newHeight,
      width: newWidth,
      depth: this.shapeDepth,
      xLoc: Math.round(group.children[0].absolutePosition().x),
      yLoc: Math.round(group.children[0].absolutePosition().y),
      angle: rotation,
    });
  }

  initilizeListenersOnRectangle(rectangle: Konva.Rect) {

    rectangle.addEventListener('click', () => {
      this.getNewRectDimensions(rectangle);
      this.isPropertiesPanelShown = true;
      this.activeShape = rectangle;
      this.activeShape.attrs.fill = '#4BC433';
    });

    rectangle.addEventListener('dragend', (event) => {
      this.getNewRectDimensions(rectangle);
      this.isShapeDragStarted = false;
    });

    rectangle.addEventListener('transformstart', () => { console.log("transformstart rect") });
    rectangle.addEventListener('transform', () => { console.log("transform rect") });
    rectangle.addEventListener('transformend', () => {
      this.getNewRectDimensions(rectangle);
    });

    rectangle.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    rectangle.on('mouseout', function () {
      document.body.style.cursor = 'default';
    });

    rectangle.addEventListener('dragmove', (event) => {
      this.isShapeDragStarted = true;
      this.xAxis = Math.round(rectangle.absolutePosition().x);
      this.yAxis = Math.round(rectangle.absolutePosition().y);
    });
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
      depth: this.shapeDepth,
      xLoc: Math.round(rectangle.absolutePosition().x),
      yLoc: Math.round(rectangle.absolutePosition().y),
      angle: rotation,
    });
  }

  //<--------------------------------IMAGE--------------------------------------------->

  drawImage(imageUrl: string, xAxis: number, yAxix: number) {
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
        depth: this.shapeDepth,
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
        depth: this.shapeDepth,
        xLoc: Math.round(image.absolutePosition().x),
        yLoc: Math.round(image.absolutePosition().y),
        angle: 90,
        image_Src: '/assets/cbimage.jpg',
      };
      this.isShapeDragStarted = false;
    });

    image.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    image.on('mouseout', function () {
      document.body.style.cursor = 'default';
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
    //this.addTransformerListeners();
  }

  //<--------------------------------TEXT--------------------------------------------->

  createText(textProps) {
    const text = this.shapeService.text(textProps);
    text.offsetX(text.width() / 2);
    text.offsetY(text.height() / 2)
    // this.shapes.push(text.textNode);
    // this.transformers.push(text.tr);
    return text;
  }

  //<--------------------------------LINE--------------------------------------------->

  drawLine() {
    this.selectedButton['line'] = true;
  }

  //<--------------------------------Selection AREA--------------------------------------------->

  addSelectionArea() {
    // add a new feature, lets add ability to draw selection rectangle

    this.selectionRectangle.visible(false);
    this.layer.add(this.selectionRectangle);

    this.tr = new Konva.Transformer({});
    this.layer.add(this.tr);
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

  //<--------------------------------GLOBAL ACTIONS--------------------------------------------->

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

  redo() {

  }

  zoomCanvas() {

  }

  //<--------------------------------SHAPE CLONING--------------------------------------------->

  startCloning(event) {
    //console.log(event);
    switch (event.shape_name) {
      case 'rectangle':
        const rectObj = {
          rectWidth: +event.length,
          rectHeight: +event.width,
          xLocation: event.xLoc + 25,
          yLocation: event.yLoc + 24,
          notcheType: event.fingerNotch,
          cornerRadius: event.cornerRadius
        }
        this.drawRectangle(rectObj);
        break;
      case 'circle':
        let circleObj = {
          radius: event.width,
          xAxis: event.xLoc + 25,
          yAxix: event.yLoc + 24,
          fillColor: 'rgb(75,196,51)',
          strokeColor: 'black',
          isDraggable: true
        }
        this.drawCircle(circleObj);
        break;
      case 'image':
        this.drawImage(event.image_Src, event.xLoc + 25, event.yLoc + 24);
        break;
    }
  }

  //<--------------------------------Transformer Listener--------------------------------------------->

  addTransformerListeners() {
    const component = this;
    component.tr = new Konva.Transformer({
      boundBoxFunc: function (oldBoundBox, newBoundBox) {
        component.newBoundriesShape = newBoundBox;
        return newBoundBox;
      },
      anchorSize: 10,
      anchorCornerRadius: 1,
      anchorFill: 'white',
      anchorStroke: 'blue',
      anchorStrokeWidth: 2,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      // resizeEnabled: false,
    });
    this.stage.on('click', function (e) {
      if (!this.clickStartShape) {
        return;
      }
      component.transformers = [];
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
        if (component.activeShape !== null) {
          component.activeShape.attrs.fill = '#93DC85';
          component.activeShape = null;
        }
        component.propertiesObject = undefined;
      }
    });
  }

  //<--------------------------------Delete Listener--------------------------------------------->

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

  //<--------------------------------Line Listener--------------------------------------------->

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
}
