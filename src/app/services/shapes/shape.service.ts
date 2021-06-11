import { Injectable } from '@angular/core';
import Konva from 'konva';

@Injectable({
  providedIn: 'root',
})
export class ShapeService {
  constructor() { }

  getUUID() {
    return '_' + Math.random().toString(36).substr(2, 5);
  };

  circle(circleObj) {
    const { radius, xAxis, yAxis, fillColor, strokeColor, isDraggable, isListening, notcheType } = circleObj;
    return new Konva.Circle({
      id: `circle${this.getUUID()}`,
      name: notcheType,//storing notchtype in the name property
      x: xAxis,
      y: yAxis,
      radius: radius,
      fill: fillColor,//'rgb(75,196,51)',
      stroke: strokeColor,
      strokeWidth: 2,
      draggable: isDraggable,
      listening: isListening
    });
  }

  line(pos, mode: string = 'brush') {
    return new Konva.Line({
      stroke: '#df4b26',
      strokeWidth: 5,
      globalCompositeOperation:
        mode === 'brush' ? 'source-over' : 'destination-out',
      points: [pos.x, pos.y],
      draggable: mode == 'brush',
    });
  }

  rectangle(rectProperties) {
    const { rectWidth, rectHeight, xAxis, yAxis, fillColor, strokeColor, isDraggable, cornerRadius, notcheType } = rectProperties

    return new Konva.Rect({
      id: `rect${this.getUUID()}`,
      name: notcheType,//storing notchtype in the name property
      x: xAxis,
      y: yAxis,
      width: rectWidth,
      height: rectHeight,
      fill: fillColor,//'rgb(147,220,133)',
      stroke: strokeColor,
      strokeWidth: 2,
      draggable: isDraggable,
      strokeScaleEnabled: false,
      cornerRadius: cornerRadius,
    });
  }

  image(imageUrl, imageObj, xAxis: number, yAxis: number) {
    var img = new Konva.Image({
      id: `image${this.getUUID()}`,
      x: xAxis,
      y: yAxis,
      image: imageObj,
      width: 100,
      height: 300,
      draggable: true
    });
    imageObj.src = imageUrl;
    return img;
  }

  text(textProps) {
    const { textString, xLoc, yLoc } = textProps;
    return new Konva.Text({
      id: `text${this.getUUID()}`,
      text: `${textString}mm`,
      x: xLoc,
      y: yLoc,
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: '#000',
      width: 100,
      padding: 5,
      align: 'center',
      verticalAlign: 'middle',
      listening: false
    });
  }
}
