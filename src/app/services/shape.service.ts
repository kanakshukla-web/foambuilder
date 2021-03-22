import { Injectable } from '@angular/core';
import Konva from 'konva';

@Injectable({
  providedIn: 'root',
})
export class ShapeService {
  constructor() {}

  circle(radius: number, xAxis: number, yAxis: number) {
    return new Konva.Circle({
      x: xAxis,
      y: yAxis,
      radius: radius,
      fill: 'rgb(75,196,51)',
      stroke: 'black',
      strokeWidth: 2,
      draggable: true,
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

  rectangle(
    rectWidth: number,
    rectHeight: number,
    xAxis: number,
    yAxis: number
  ) {
    return new Konva.Rect({
      x: xAxis,
      y: yAxis,
      width: rectHeight,
      height: rectWidth,
      fill: 'rgb(75,196,51)',
      stroke: 'black',
      strokeWidth: 2,
      draggable: true,
      strokeScaleEnabled: false,
    });
  }

  image(imageUrl, imageObj, xAxis: number, yAxis: number) {
    var img = new Konva.Image({
      x: xAxis,
      y: yAxis,
      image: imageObj,
      width: 100,
      height: 300,
      draggable:true
    });
    imageObj.src = imageUrl;
    return img;
  }
}
