import { Injectable } from '@angular/core';
import Konva from 'konva';

@Injectable({
  providedIn: 'root',
})
export class ShapeService {
  constructor() { }

  circle(radius: number, xAxis: number, yAxis: number, fillColor: string, strokeColor: string, isDraggable: boolean) {
    return new Konva.Circle({
      x: xAxis,
      y: yAxis,
      radius: radius,
      fill: fillColor,//'rgb(75,196,51)',
      stroke: strokeColor,
      strokeWidth: 2,
      draggable: isDraggable,
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
    const { rectWidth, rectHeight, xAxis, yAxis, fillColor, strokeColor, isDraggable, cornerRadius } = rectProperties
    return new Konva.Rect({
      x: xAxis,
      y: yAxis,
      width: rectWidth,
      height: rectHeight,
      fill: fillColor,//'rgb(147,220,133)',
      stroke: strokeColor,
      strokeWidth: 2,
      draggable: isDraggable,
      strokeScaleEnabled: false,
      cornerRadius: cornerRadius
    });
  }

  image(imageUrl, imageObj, xAxis: number, yAxis: number) {
    var img = new Konva.Image({
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
      text: textString,
      x: xLoc,
      y: yLoc,
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: '#000',
      width: 100,
      padding: 5,
      align: 'center',
      verticalAlign: 'middle',
    });
  }
}
