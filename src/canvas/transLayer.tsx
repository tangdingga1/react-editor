import React from 'react';

import Icon from '@/components/Icon';
import { DataCoreData, CoordinatePoint } from '@/interface';
import './index.less';
import {
  TransData,
  ResizeCalcHandle,
  RESIZE_RECT_LIST,
  getCoordinateLength,
  degToRadian,
} from './resizeConstant';

type TransLayerProps = {
  isActive: boolean;
  prefixCls: string;
  onRecord: (data: { [dataName: string]: any }) => void;
  componentData: DataCoreData;
};

export default class TransLayer extends React.Component<TransLayerProps, {}> {
  startData: null | TransData = null;
  startPoint: null | CoordinatePoint = null;
  container: null | HTMLDivElement = null;
  componentCenterPoint: null | CoordinatePoint = null;
  componentCenterCoordinate: null | CoordinatePoint = null;
  dragHandle: null | ResizeCalcHandle = null;
  startAngle = 0;
  initAngle = 0;
  /**
   * 由于react的合并state更新机制，使用data来改变的话，会在操作时产生明显的顿卡感
   * 此处操作dom的方式来改变宽高和定位
   * **定位** 在外部的 component 容器上面，**宽高**在子元素上面
   * 操作完毕之后修正最后修正一下 data 的数据
   */
  onChangeContainerStyle = (componentData: Object) => {
    const parentEle = this.container?.parentElement as HTMLElement;
    const childEle = this.container?.lastChild?.lastChild as HTMLElement;
    for(let i in componentData) {
      let target = childEle;
      if (i === 'left' || i === 'top') {
        target = parentEle;
      }
      target.style[i as any] = `${componentData[i]}px`;
    }
  };

  onStartMove = (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (this.startPoint) {
      return;
    }
    const { nativeEvent } = event;
    const { clientX, clientY } = nativeEvent;
    this.startPoint = [clientX, clientY];
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onEndMove);
  };

  onMove = (event: MouseEvent) => {
    if (!this.startPoint) {
      return {};
    }
    const { clientX, clientY } = event;
    const { startPoint } = this;
    const { left, top } = this.props.componentData;
    const result = {
      left: left + clientX - startPoint[0],
      top: top + clientY - startPoint[1],
    };
    this.onChangeContainerStyle(result);
    return result;
  };

  onEndMove = (event: MouseEvent) => {
    if (!this.startPoint) {
      return;
    }
    this.props.onRecord(this.onMove(event));
    this.startPoint = null;
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('mouseup', this.onEndMove);
  };

  onStartSpin = (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (this.startPoint) {
      return;
    }
    const { nativeEvent } = event;
    const { clientX, clientY } = nativeEvent;
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
    const { rotate } = this.props.componentData;
    this.startPoint = [clientX, clientY];
    /**
     * 1. 获得组件的中心点坐标 `componentCenterPoint`，作为坐标中的原点。因为旋转过程中中心是不变的
     * 2. 根据组件中心点坐标，获得点击旋转的起始点的坐标 `startPoint`
     * 3. 获得上次旋转剩余的角度
     */
    const { left, top, width, height } = this.container!.getBoundingClientRect();
    this.componentCenterPoint = [left + width / 2, top + height / 2];
    this.startPoint = [clientX - this.componentCenterPoint[0], clientY - this.componentCenterPoint[1]];
    if (rotate) {
      this.initAngle = rotate;
    }
    document.addEventListener('mousemove', this.onSpin);
    document.addEventListener('mouseup', this.onEndSpin);
  };

  onSpin = (event: MouseEvent) => {
    if (!this.startPoint) {
      return;
    }
    const { clientX, clientY } = event;
    const { componentCenterPoint, startPoint } = this;
    const [componentCenterX, componentCenterY] = componentCenterPoint as CoordinatePoint;
    const [startPointX, startPointY] = startPoint;
    // 当前鼠标于组件中心点的坐标
    const rotateVectorX = clientX - componentCenterX;
    const rotateVectorY = clientY - componentCenterY;
    // 计算旋转之后的角度
    // @todo 搞清楚向量计算的公式 (x1 * x2 + y1 * y2, x1 * y2 - y1 * x2)，把(x1,y1)作为原点，计算(x2,y2)的坐标
    const rotateAngel = Math.atan2(
      startPointX * rotateVectorY - startPointY * rotateVectorX
      ,
      startPointX * rotateVectorX + startPointY * rotateVectorY
    ) * 180 / Math.PI;
    const rotate = Math.round(this.initAngle + rotateAngel) % 360;
    // @todo 仅仅操作rotate，而不是改变整个 transform
    this.container!.style.transform = `rotate(${rotate}deg)`;
    return rotate;
  };

  onEndSpin = (event: MouseEvent) => {
    if (!this.startPoint) {
      return;
    }
    const rotate = this.onSpin(event);
    this.props.onRecord({
      transform: this.container!.style.transform,
      rotate,
    });
    this.startPoint = null;
    this.componentCenterPoint = null;
    document.removeEventListener('mousemove', this.onSpin);
    document.removeEventListener('mouseup', this.onEndSpin);
  };

  onStartResize = (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>, dragHandle: ResizeCalcHandle) => {
    if (this.componentCenterCoordinate) {
      return;
    }
    // 阻止拖拽
    const { nativeEvent } = event;
    nativeEvent.preventDefault();
    const { clientX, clientY } = nativeEvent;
    const { componentData: { left, top, width, height } } = this.props;
    this.startPoint = [clientX, clientY];
    this.dragHandle = dragHandle;
    // 计算组件中心点的坐标
    this.componentCenterCoordinate = [
      left + width / 2,
      top + height / 2,
    ];
    document.addEventListener('mousemove', this.onResize);
    document.addEventListener('mouseup', this.onEndResize);
  };

  onResize = (event: MouseEvent) => {
    if (!this.componentCenterCoordinate) {
      return {};
    }
    const { clientX, clientY } = event;
    const { rotate = 0 } = this.props.componentData;
    const [startX, startY] = this.startPoint as CoordinatePoint;
    const [componentCenterX, componentCenterY] = this.componentCenterCoordinate as CoordinatePoint;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    const alpha = Math.atan2(deltaY, deltaX);
    const beta = alpha - degToRadian(rotate);

    const deltaL = getCoordinateLength(deltaX, deltaY);
    const deltaW = deltaL * Math.cos(beta);
    const deltaH = deltaL * Math.sin(beta);
    const result = this.dragHandle!({
      componentData: this.props.componentData,
      deltaW,
      deltaH,
      componentCenterX,
      componentCenterY,
    });
    this.onChangeContainerStyle(result);
    return result;
  };

  onEndResize = (event: MouseEvent) => {
    if (!this.componentCenterCoordinate) {
      return;
    }
    this.props.onRecord(this.onResize(event));
    this.dragHandle = null;
    this.startPoint = null;
    this.componentCenterCoordinate = null;
    document.removeEventListener('mousemove', this.onResize);
    document.removeEventListener('mouseup', this.onEndResize);
  };

  render() {
    const { children, prefixCls, isActive, componentData } = this.props;
    if (!isActive) {
      return children;
    }
    return (
      <div
        ref={container => this.container = container}
        className={`${prefixCls}-canvas-trans-layer`}
        style={{ transform: componentData.transform }}
        onMouseDown={this.onStartMove}
      >
        <div
          className={`${prefixCls}-canvas-trans-layer-rotate-container`}
          onMouseDown={this.onStartSpin}
        >
          <Icon type="xuanzhuan" />
          <div></div>
        </div>
        {
          RESIZE_RECT_LIST.map(({ style, resizeCalcHandle }) => (
            <div
              className={`${prefixCls}-canvas-trans-layer-drag-react`}
              key={style.cursor}
              style={style}
              onMouseDown={(e) => this.onStartResize(e, resizeCalcHandle)}
            >
              <div className={`${prefixCls}-canvas-trans-layer-drag-visible-react`} />
            </div>
          ))
        }
        { children }
      </div>
    );
  }
};
