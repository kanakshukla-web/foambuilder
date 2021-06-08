import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import Konva from 'konva';
import { Properties } from '../../interfaces/intefaces';
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
  @ViewChild('ejEditDialog') ejDialog: DialogComponent;
  public targetElement: HTMLElement;
  public typeDialogWidth: string = '98%';
  public typeDialogHeight: string = '95%';
  public showCloseIcon: boolean = true;

  @ViewChild('trayChild') trayChild: EjsTrayBuilderComponent;
  @ViewChild('changeCase') changeCase: EjsChangeCaseComponent;
  @ViewChild('customNotch') customNotchChild: RectanglecustomnotchComponent;

  isCanvasUpdated = false;
  isPropertiesPanelShown = false;

  propertiesObject: Properties = {
    id: 0, shape_name: '', length: 0, width: 0, depth: 0, xLoc: 0, yLoc: 0, angle: 0,
  };

  xAxis: number;
  yAxis: number;
  isShapeDragStarted: boolean = false;
  newBoundriesShape: any;
  shapes: any = [];

  shape_rect_color = '#93DC85';
  shape_circle_color = '#93DC85';
  shape_notch_color = '#B36DD1';

  activeShape;

  transformers: Konva.Transformer[] = [];
  openTrayCount = 0;
  //tr: Konva.Transformer;

  nodesArray = [];
  shapeDepth: number;
  activeGroup;

  constructor(
    private shapeService: ShapeService,
    public canvasService: CanvasService,
    private sharedService: SharedService
  ) { }

  //<-------------------lifecycle methods--------------------------->

  ngOnInit(): void {
    this.canvasService.canvasProperties = JSON.parse(this.canvasService.getInitialConfigurations());
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
    //this.canvasService.addLineListeners(this.shapeService);
  }

  //<----------------------------------------------->

  closeDialog() {
    this.hideBuilderTray();
    this.ejDialog.hide();
  }

  handleEdit() {
    this.changeCase.openDialog();
  }

  handleTray() {
    this.trayChild.openTray();
  }

  public onOverlayClick: EmitType<object> = () => {
    this.ejDialog.hide();
  };

  onSubmit(formInput) {
    this.canvasService.canvasProperties.canvasUpperLength = formInput.elements['upperlength'].value;
    this.canvasService.canvasProperties.canvasUpperWidth = formInput.elements['upperwidth'].value;

    this.isCanvasUpdated = true;
    this.changeCase.closeDialog();
  }

  updateCanvasFormArea(CaseObj) {
    //alert(`I am from Dashboard Component. Your CaseName ${CaseObj.CaseName} && Dimensions ${CaseObj.CaseDimensions}`);
    let { CaseName, CornerRadius, LowerLength, LowerWidth, TotalDepth, Length, Width } = CaseObj[0];

    this.canvasService.canvasProperties.case_name = CaseName;
    this.canvasService.canvasProperties.canvasRadius = CornerRadius;
    this.canvasService.canvasProperties.canvasLowerLength = LowerLength;
    this.canvasService.canvasProperties.canvasLowerWidth = LowerWidth;
    this.canvasService.canvasProperties.foam_base = TotalDepth;

    this.canvasService.canvasProperties.canvasUpperLength = Length;
    this.canvasService.canvasProperties.canvasUpperWidth = Number((Width * 3.7).toFixed(0)); // 1 mm = 3.7px converting to px
    this.isCanvasUpdated = true;

    this.canvasService.stage = null;
    this.canvasService.initStage();
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
          isDraggable: false,
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
          fillColor: this.shape_rect_color,
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
    this.isPropertiesPanelShown = false;
  }

  addShapeToKonvaLayer(shape) {
    // this.shapes = [];
    // this.nodesArray = [];

    this.shapes.push(shape);
    this.canvasService.layer.add(shape);
    this.canvasService.stage.add(this.canvasService.layer);
    this.addTransformerListeners();

    this.nodesArray.push(shape);
    this.canvasService.tr.nodes(this.nodesArray);
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
        this.canvasService.group.add(this.drawCircle(circleObj), this.createText(textProps));
        this.initializeListnerOnGroup(this.canvasService.group, 'circle');
        this.addShapeToKonvaLayer(this.canvasService.group);
        break;

      case 'Custom Notch Replacememt': this.handleCustomNotch();
        break;

      default:
        break;
    }
  }

  drawCircle(circleProp) {
    const { radius, xAxis, yAxis, fillColor, strokeColor, isDraggable } = circleProp;
    const circle = this.shapeService.circle(radius, xAxis, yAxis, fillColor, strokeColor, isDraggable);
    return circle;
  }

  //<--------------------------------RECTANGLE--------------------------------------------->

  drawRectangle(rectProps) {

    const { rectWidth, rectHeight, xAxis, yAxis, notcheType } = rectProps;
    this.canvasService.initializeGroup();

    let circleObj = {
      radius: 30,
      xAxis: xAxis + rectWidth / 2,
      yAxis: yAxis,
      fillColor: this.shape_notch_color,
      strokeColor: '#B36DD1',
      isDraggable: false,
      type: 'circle'
    }

    let textProps = {
      textString: this.shapeDepth,
      xLoc: xAxis + rectWidth / 2,
      yLoc: yAxis + rectHeight / 2
    }

    switch (notcheType) {
      case 'Top and Bottom':
        let top_notch = this.drawCircle(circleObj); //top_notch
        circleObj.yAxis = yAxis + rectHeight;
        let bottom_notch = this.drawCircle(circleObj);//bottom_notch
        this.updateGroup(this.createRect(rectProps), top_notch, bottom_notch, this.createText(textProps), 'rect');
        break;

      case 'Left and Right':
        circleObj.xAxis = xAxis;
        circleObj.yAxis = yAxis + rectHeight / 2;
        let left_notch = this.drawCircle(circleObj);//left_notch
        circleObj.xAxis = xAxis + rectWidth;
        let right_notch = this.drawCircle(circleObj); //right_notch
        this.updateGroup(this.createRect(rectProps), left_notch, right_notch, this.createText(textProps), 'rect');
        break;

      case 'None':
        this.canvasService.group.add(this.createRect(rectProps), this.createText(textProps));
        this.initializeListnerOnGroup(this.canvasService.group, 'rect');
        this.addShapeToKonvaLayer(this.canvasService.group);
        break;

      case 'Custom Notch Replacememt': this.handleCustomNotch();
        break;

      default:
        this.canvasService.group.add(this.createRect(rectProps), this.createText(textProps));
        this.initializeListnerOnGroup(this.canvasService.group, 'rect');
        this.addShapeToKonvaLayer(this.canvasService.group);
        break;
    }
  }

  createRect(rectProps) {
    const rectangle = this.shapeService.rectangle(rectProps);
    //this.addShapeToKonvaLayer(rectangle);
    return rectangle;
  }

  handleCustomNotch() {
    this.customNotchChild.openCustomNotchDialog();
  }

  updateGroup(rect: Konva.Rect, first_notch: Konva.Circle, second_notch: Konva.Circle, center_text: Konva.Text, rootNode: string) {
    this.canvasService.group.add(rect, first_notch, second_notch, center_text);
    this.initializeListnerOnGroup(this.canvasService.group, rootNode);
    this.addShapeToKonvaLayer(this.canvasService.group);
  }

  initializeListnerOnGroup(group: Konva.Group, rootNode: string) {
    group.addEventListener('click', (event) => {
      this.isPropertiesPanelShown = true;
      this.activeShape = group.children[0];
      this.activeShape.attrs.fill = '#4BC433';
      this.activeGroup = group;
      rootNode === 'rect' ? this.setGroupProperties(group) : this.setGroupPropertiesForCircle(group);
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

    return (this.propertiesObject = {
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

    return (this.propertiesObject = {
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
      this.activeGroup = image;
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
    this.canvasService.selectedButton['line'] = true;
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
    this.canvasService.layer.draw();
  }

  redo() { }

  zoomCanvas() {
    var scaleBy = .1;
    this.canvasService.canvasProperties.canvasUpperLength += Number((this.canvasService.canvasProperties.canvasUpperLength * scaleBy).toFixed(0));
    this.canvasService.canvasProperties.canvasUpperWidth += Number((this.canvasService.canvasProperties.canvasUpperWidth * scaleBy).toFixed(0));

    this.isCanvasUpdated = true;
    this.canvasService.stage = null;
    this.canvasService.initStage();
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
          cornerRadius: event.cornerRadius
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
        this.drawCircle(circleObj);
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
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      // resizeEnabled: false,
    });
    this.canvasService.stage.on('click', function (e) {
      if (!this.clickStartShape) {
        return;
      }
      component.transformers = [];
      if (e.target._id == this.clickStartShape._id) {
        //component.addDeleteListener(e.target);
        component.canvasService.layer.add(component.canvasService.tr);
        component.canvasService.tr.attachTo(e.target);
        component.transformers.push(component.canvasService.tr);
        component.canvasService.layer.draw();
      } else {
        component.canvasService.tr.detach();
        component.canvasService.layer.draw();
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
      component.canvasService.layer.batchDraw();
    });
  }
}
