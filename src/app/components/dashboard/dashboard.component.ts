import { Component, OnInit, ViewChild } from '@angular/core';
import Konva from 'konva';
import { CanvasService } from './../../services/canvas/canvas.service';
import { ShapeService } from './../../services/shapes/shape.service';
import { SharedService } from './../../services/shared.service';
import { EjsChangeCaseComponent } from './../ejs-change-case/ejs-change-case.component';
import { EjsTrayBuilderComponent } from './../ejs-tray-builder/ejs-tray-builder.component';
import { RectanglecustomnotchComponent } from './../rectanglecustomnotch/rectanglecustomnotch.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  public targetElement: HTMLElement;
  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '95%';
  public showCloseIcon: boolean = true;

  @ViewChild('trayChild') trayChild: EjsTrayBuilderComponent;
  @ViewChild('changeCase') changeCaseChild: EjsChangeCaseComponent;
  @ViewChild('customNotch') customNotchChild: RectanglecustomnotchComponent;

  isCanvasUpdated = false;
  propsVisibility = false;
  canvasProperties: {};

  xAxis: number;
  yAxis: number;
  isDragging: boolean = false;
  newBoundriesShape: any;
  shapes: any = [];
  activeShape: any;

  openTrayCount = 0;

  nodesArray = [];
  shapeDepth: number;
  activeGroup: any;

  modifiedUpperLength
  modifiedUpperWidth
  constructor(
    private shapeService: ShapeService,
    public canvasService: CanvasService,
    private sharedService: SharedService
  ) { }

  //<-------------------lifecycle methods------------------------------------->

  ngOnInit(): void {
    this.canvasService.canvasProps = JSON.parse(this.canvasService.getInitialConfigurations());
    this.modifiedUpperLength= this.canvasService.canvasProps.upperLength
this.modifiedUpperWidth=this.canvasService.canvasProps.upperWidth
  }

  ngAfterViewChecked() {
    if (this.isCanvasUpdated) {
      this.isCanvasUpdated = false;
    }
  }

  ngAfterViewInit(): void {
    this.canvasService.initStage();
    this.canvasService.addSelectionArea();
    this.canvasService.initilaizeListnersOnStage();
  }

  //<-------------------------------------------------------------------------->

  closeDialog() {
    this.hideBuilderTray();
  }

  handleEdit() {
    this.changeCaseChild.openDialog();
  }

  handleTray() {
    this.trayChild.openTray();
  }

  onSubmit(formInput) {
    this.canvasService.canvasProps.upperLength = formInput.elements['upperlength'].value;
    this.canvasService.canvasProps.upperWidth = formInput.elements['upperwidth'].value;

    this.isCanvasUpdated = true;
    this.changeCaseChild.closeDialog();
  }

  updateCanvasFormArea(CaseObj) {
    let { CaseName, CornerRadius, LowerLength, LowerWidth, TotalDepth, Length, Width } = CaseObj[0];

    this.canvasService.canvasProps.case_name = CaseName;
    this.canvasService.canvasProps.radius = CornerRadius;
    this.canvasService.canvasProps.lowerLength = LowerLength;
    this.canvasService.canvasProps.lowerWidth = LowerWidth;
    this.canvasService.canvasProps.foam_base = TotalDepth;

    this.canvasService.canvasProps.upperLength = Length;
    this.canvasService.canvasProps.upperWidth = Number((Width * 3.7).toFixed(0)); // 1 mm = 3.7px converting to px
    this.modifiedUpperLength=Length;
    this.modifiedUpperWidth=Number((Width * 3.7).toFixed(0));
    this.isCanvasUpdated = true;

    this.canvasService.stage = null;
    this.canvasService.initStage();
    this.changeCaseChild.closeDialog();
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
    this.canvasService.clearSelection();
    this.canvasService.setSelection(type);
    this.shapeDepth = +event.depth;

    switch (type) {
      case 'circle':
        const circleObj = {
          radius: +event.diameter,
          xAxis: 150,
          yAxis: 150,
          fillColor: '#4BC433',
          strokeColor: 'black',
          isDraggable: true,
          isListening: true,
          notcheType: event.fingerNotch,
          type: type
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
          fillColor: '#93DC85',
          strokeColor: 'black',
          type: type
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

  deleteShape(shape) {
    this.activeGroup.destroy();
    this.canvasService.tr.detach();
    this.canvasService.layer.draw();
    this.propsVisibility = false;
  }

  addShapeToKonvaLayer(shape) {
    // this.shapes = [];
    // this.nodesArray = [];

    this.shapes.push(shape);
    this.canvasService.layer.add(shape);
    this.canvasService.stage.add(this.canvasService.layer);
    this.addTransformerListeners();

    this.nodesArray.push(shape);
    //this.canvasService.tr.nodes(this.nodesArray);
    this.canvasService.layer.draw();
  }

  //<--------------------------------CIRCLE--------------------------------------------->

  selectCircleType(circleObj) {
    let { xAxis, yAxis } = circleObj;

    let textProps = {
      textString: this.shapeDepth,
      xLoc: xAxis,
      yLoc: yAxis
    }

    switch (circleObj.notcheType) {
      case 'Top and Bottom':
        break;

      case 'Left and Right':
        break;

      case 'None':
        this.canvasService.group.add(this.shapeService.circle(circleObj), this.createText(textProps));
        this.initializeListnerOnGroup(this.canvasService.group, 'circle');
        this.addShapeToKonvaLayer(this.canvasService.group);
        break;

      case 'Custom Notch Replacememt': this.handleCustomNotch();
        break;

      default:
        break;
    }
  }

  //<--------------------------------RECTANGLE--------------------------------------------->

  drawRectangle(rectProps) {

    const { rectWidth, rectHeight, xAxis, yAxis, notcheType } = rectProps;
    this.canvasService.initializeGroup();

    let circleObj = {
      radius: 30,
      xAxis: xAxis + rectWidth / 2,
      yAxis: yAxis,
      fillColor: '#B36DD1',
      strokeColor: '#B36DD1',
      isDraggable: false,
      type: 'circle',
      isListening: false
    }

    let textProps = {
      textString: this.shapeDepth,
      xLoc: xAxis + rectWidth / 2,
      yLoc: yAxis + rectHeight / 2
    }

    let groupProps = {}

    switch (notcheType) {
      case 'Top and Bottom':
        let top_notch = this.shapeService.circle(circleObj); //top_notch
        circleObj.yAxis = yAxis + rectHeight;
        let bottom_notch = this.shapeService.circle(circleObj);//bottom_notch
        groupProps = {
          rect: this.shapeService.rectangle(rectProps),
          first_notch: top_notch,
          second_notch: bottom_notch,
          center_text: this.createText(textProps),
          rootNode: 'rect'
        }
        this.updateGroup(groupProps);
        break;

      case 'Left and Right':
        circleObj.xAxis = xAxis;
        circleObj.yAxis = yAxis + rectHeight / 2;
        let left_notch = this.shapeService.circle(circleObj);//left_notch
        circleObj.xAxis = xAxis + rectWidth;
        let right_notch = this.shapeService.circle(circleObj); //right_notch
        groupProps = {
          rect: this.shapeService.rectangle(rectProps),
          first_notch: left_notch,
          second_notch: right_notch,
          center_text: this.createText(textProps),
          rootNode: 'rect'
        }
        this.updateGroup(groupProps);
        break;

      case 'None':
        this.canvasService.group.add(this.shapeService.rectangle(rectProps), this.createText(textProps));
        this.initializeListnerOnGroup(this.canvasService.group, 'rect');
        this.addShapeToKonvaLayer(this.canvasService.group);
        break;

      case 'Custom Notch Replacememt': this.handleCustomNotch();
        break;

      default:
        this.canvasService.group.add(this.shapeService.rectangle(rectProps), this.createText(textProps));
        this.initializeListnerOnGroup(this.canvasService.group, 'rect');
        this.addShapeToKonvaLayer(this.canvasService.group);
        break;
    }
  }

  handleCustomNotch() {
    this.customNotchChild.openCustomNotchDialog();
  }

  updateGroup(groupProps) {
    const { rect, first_notch, second_notch, center_text, rootNode } = groupProps;
    this.canvasService.group.add(rect, first_notch, second_notch, center_text);
    this.initializeListnerOnGroup(this.canvasService.group, rootNode);
    this.addShapeToKonvaLayer(this.canvasService.group);
  }

  initializeListnerOnGroup(group: Konva.Group, rootNode: string) {
    group.addEventListener('click', (event) => {
      this.propsVisibility = true;
      this.activeShape = group.children[0];
      this.activeShape.attrs.fill = '#4BC433';
      this.activeGroup = group;
      rootNode === 'rect' ? this.setGroupProperties(group) : this.setGroupPropertiesForCircle(group);
    });

    group.addEventListener('dragmove', (event) => {
      this.isDragging = true;
      this.xAxis = Math.round(group.children[0].absolutePosition().x);
      this.yAxis = Math.round(group.children[0].absolutePosition().y);
    });

    group.addEventListener('dragend', (event) => {
      this.setGroupProperties(group);
      this.isDragging = false;
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

    return (this.canvasProperties = {
      id: 1,
      shape_name: 'rectangle',
      length: newHeight,
      width: newWidth,
      depth: this.shapeDepth,
      xLoc: Math.round(group.children[0].absolutePosition().x),
      yLoc: Math.round(group.children[0].absolutePosition().y),
      angle: rotation,
    });
  }

  setGroupPropertiesForCircle(group: Konva.Group) {
    let condition = this.newBoundriesShape != null;

    let newHeight = condition
      ? Math.round(this.newBoundriesShape.height)
      : group.children[0].attrs.radius;
    let newWidth = condition
      ? Math.round(this.newBoundriesShape.height)
      : group.children[0].attrs.radius;
    let rotation = condition
      ? Math.round(this.newBoundriesShape.rotation)
      : group.children[0].rotation();

    return (this.canvasProperties = {
      id: 2,
      shape_name: 'circle',
      length: newHeight,
      width: newWidth,
      depth: this.shapeDepth,
      xLoc: Math.round(group.children[0].absolutePosition().x),
      yLoc: Math.round(group.children[0].absolutePosition().y),
      angle: rotation,
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

    return (this.canvasProperties = {
      id: 1,
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

  drawImage(imageUrl: string, xAxis: number, yAxis: number) {
    var imageObj = new Image();
    const image = this.shapeService.image(imageUrl, imageObj, xAxis, yAxis);

    imageObj.onload = function () {
      image;
    };
    this.shapes.push(image);
    this.canvasService.layer.add(image);
    this.canvasService.layer.batchDraw();
    this.canvasService.stage.add(this.canvasService.layer);
    this.addListnersOnImage(image);
    this.addTransformerListeners();
  }

  addListnersOnImage(image) {
    image.addEventListener('click', () => {
      this.canvasProperties = {
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
      this.activeGroup = image;
      this.propsVisibility = true;
    });

    image.addEventListener('dragend', (event) => {
      this.canvasProperties = {
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
      this.isDragging = false;
    });

    image.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    image.on('mouseout', function () {
      document.body.style.cursor = 'default';
    });

    image.addEventListener('dragmove', (event) => {
      this.isDragging = true;
      this.xAxis = Math.round(image.absolutePosition().x);
      this.yAxis = Math.round(image.absolutePosition().y);
    });
  }

  //<--------------------------------TEXT--------------------------------------------->

  createText(textProps) {
    const text = this.shapeService.text(textProps);
    text.offsetX(text.width() / 2);
    text.offsetY(text.height() / 2)
    // this.shapes.push(text.textNode);
    // this.canvasService.transformers.push(text.tr);
    return text;
  }

  //<--------------------------------LINE--------------------------------------------->

  drawLine() {
    this.canvasService.selectedButton['line'] = true;
  }

  //<--------------------------------GLOBAL ACTIONS--------------------------------------------->

  undo() {
    const removedShape = this.shapes.pop();
    this.canvasService.transformers.forEach((t) => {
      t.detach();
    });
    if (removedShape) {
      removedShape.remove();
    }
    this.canvasService.layer.draw();
  }

  redo() { }

  zoomCanvas(event) {
    let scaleBy = this.canvasService.canvasProps.zoomScaleValue;
  
    if(event=='ZoomIn'){
    //   this.canvasService.canvasProps.upperLength += Number((this.canvasService.canvasProps.upperLength * scaleBy).toFixed(0));
    // this.canvasService.canvasProps.upperWidth += Number((this.canvasService.canvasProps.upperWidth * scaleBy).toFixed(0));
   
    this.modifiedUpperLength += Number((  this.modifiedUpperLength * scaleBy).toFixed(0));
    this.modifiedUpperWidth += Number((this.modifiedUpperWidth * scaleBy).toFixed(0));
       this.canvasService.stage.height(this.modifiedUpperLength);
       this.canvasService.stage.width(this.modifiedUpperWidth);
    }
    else  if(event=='ZoomOut'){
    //   this.canvasService.canvasProps.upperLength -= Number((this.canvasService.canvasProps.upperLength * scaleBy).toFixed(0));
    // this.canvasService.canvasProps.upperWidth -= Number((this.canvasService.canvasProps.upperWidth * scaleBy).toFixed(0));
    
    this.modifiedUpperLength -= Number((  this.modifiedUpperLength * scaleBy).toFixed(0));
    this.modifiedUpperWidth -= Number((this.modifiedUpperWidth * scaleBy).toFixed(0));
      this.canvasService.stage.height(this.modifiedUpperLength);
       this.canvasService.stage.width(this.modifiedUpperWidth);
    }
    this.updateShapeOnKonva(scaleBy,event);
    this.isCanvasUpdated = true;
  }

  updateShapeOnKonva(scaleBy: number,type:string) {
    if(type=='ZoomIn'){
      var scaleX = this.canvasService.stage.getAbsoluteScale().x;
      let scale = scaleX + scaleBy
      this.canvasService.stage.scale({ x: scale, y: scale });
      this.canvasService.stage.draw();
    }
    else  if(type=='ZoomOut'){
      var scaleX = this.canvasService.stage.getAbsoluteScale().x;
      let scale = scaleX - scaleBy
      this.canvasService.stage.scale({ x: scale, y: scale });
      this.canvasService.layer.draw();
     // this.canvasService.stage.draw();
    }
 // this.canvasService.fillKonvaContainerBorder();
 // this.canvasService.drawKonvaGrid();
  }

  //<--------------------------------SHAPE CLONING--------------------------------------------->

  startCloning(event) {

    switch (event.id) {
      case 1:
        const rectObj = {
          rectWidth: +event.length,
          rectHeight: +event.width,
          xLocation: event.xLoc + 25,
          yLocation: event.yLoc + 24,
          notcheType: event.fingerNotch,
          cornerRadius: event.cornerRadius,
          isDraggable: false,
          fillColor: '#93DC85',
          strokeColor: 'black',
          type: 'rectangle'
        }
        this.drawRectangle(rectObj);
        break;
      case 2:
        let circleObj = {
          radius: event.width,
          xAxis: event.xLoc + 25,
          yAxis: event.yLoc + 24,
          fillColor: 'rgb(75,196,51)',
          strokeColor: 'black',
          isDraggable: true
        }
        this.shapeService.circle(circleObj);
        break;
      case 3:
        this.drawImage(event.image_Src, event.xLoc + 25, event.yLoc + 24);
        break;
    }
  }

  //<--------------------------------Transformer Listener--------------------------------------------->

  addTransformerListeners() {
    const component = this;
    component.canvasService.tr = new Konva.Transformer({
      boundBoxFunc: function (oldBoundBox, newBoundBox) {
        component.newBoundriesShape = newBoundBox;
        return newBoundBox;
      },
      anchorSize: 10,
      anchorCornerRadius: 1,
      anchorFill: 'white',
      anchorStroke: 'blue',
      anchorStrokeWidth: 2,
      enabledAnchors: [
        'top-left', 'top-center', 'top-right',
        'middle-left', 'middle-right', 'bottom-left',
        'bottom-center', 'bottom-right'],
      // resizeEnabled: false,
    });
    this.canvasService.stage.on('click', function (e) {
      if (!this.clickStartShape) {
        return;
      }
      component.canvasService.transformers = [];
      if (e.target._id == this.clickStartShape._id) {
        //component.addDeleteListener(e.target);
        component.canvasService.layer.add(component.canvasService.tr);
        // component.canvasService.tr.attachTo(e.target);
        // component.canvasService.transformers.push(component.canvasService.tr);
        component.canvasService.tr.nodes([this.clickStartShape.parent]);
        component.canvasService.layer.draw();
      } else {
        component.canvasService.tr.detach();
        component.canvasService.layer.draw();
        component.propsVisibility = false;
        if (component.activeShape !== null && component.activeShape !== undefined) {
          component.activeShape.attrs.fill = '#93DC85';
          component.activeShape = null;
        }
        component.canvasProperties = undefined;
      }
    });
  }

  //<--------------------------------Delete Listener--------------------------------------------->

  addDeleteListener(shape) {
    const component = this;
    window.addEventListener('keydown', function (e) {
      if (e.keyCode === 46) {
        shape.remove();
        component.canvasService.transformers.forEach((t) => {
          t.detach();
        });
        const selectedShape = component.shapes.find((s) => s._id == shape._id);
        selectedShape.remove();
        e.preventDefault();
      }
      component.canvasService.layer.batchDraw();
    });
  }
}
