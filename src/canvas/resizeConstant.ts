import { CSSProperties } from 'react';
import { DataCoreData } from '@/interface';

export type TransData = {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type ResizeCalcHandle = (
  data: {
    componentData: DataCoreData,
    componentCenterX: number;
    componentCenterY: number;
    deltaW: number;
    deltaH: number;
  }
) => Object;

type ResizeRectList = {
  style: CSSProperties;
  resizeCalcHandle: ResizeCalcHandle;
};

export const DRAG_SIZE = 20;
export const DRAG_TRANSFORM_SIZE = DRAG_SIZE / 2;
export const DRAG_SIZE_STYLE = { width: DRAG_SIZE, height: DRAG_SIZE };
// 根据坐标，得到坐标与原点连线长度
export const getCoordinateLength = (x: number, y: number) => Math.sqrt(x * x + y * y);
// 角度转弧度
export const degToRadian = (deg: number) => deg * Math.PI / 180;
const cos = (deg: number) => Math.cos(degToRadian(deg));
const sin = (deg: number) => Math.sin(degToRadian(deg));

// 旋转缩放计算参考[库](https://github.com/mockingbot/react-resizable-rotatable-draggable)
export const RESIZE_RECT_LIST: ResizeRectList[] = [
  // 左上
  {
    style: {
      ...DRAG_SIZE_STYLE,
      top: 0,
      left: 0,
      cursor: 'nw-resize',
      transform: `translateX(-${DRAG_TRANSFORM_SIZE}px) translateY(-${DRAG_TRANSFORM_SIZE}px)`,
    },
    resizeCalcHandle({ componentData, componentCenterX, componentCenterY, deltaW, deltaH }) {
      const { width, height, rotate = 0 } = componentData;

      deltaW *= -1;
      deltaH *= -1;

      const newWidth = width + deltaW;
      const newHeight = height + deltaH;

      const centerX = componentCenterX - (deltaW / 2 * cos(rotate) - deltaH / 2 * sin(rotate));
      const centerY = componentCenterY - (deltaW / 2 * sin(rotate) + deltaH / 2 * cos(rotate));

      return {
        top: centerY - newHeight / 2,
        left: centerX - newWidth / 2,
        width: newWidth,
        height: newHeight,
      };
    },
  },
  // 中上
  {
    style: {
      ...DRAG_SIZE_STYLE,
      top: 0,
      left: '50%',
      cursor: 'n-resize',
      transform: `translateX(-50%) translateY(-${DRAG_TRANSFORM_SIZE}px)`,
    },
    resizeCalcHandle({ componentData, componentCenterY, componentCenterX, deltaW, deltaH }) {
      const { width, height, rotate = 0 } = componentData;

      deltaH *= -1;

      const newHeight = height + deltaH;

      const centerX = componentCenterX + deltaH / 2 * sin(rotate);
      const centerY = componentCenterY - deltaH / 2 * cos(rotate);

      return {
        top: centerY - newHeight / 2,
        left: centerX - width / 2,
        height: newHeight,
      };

    },
  },
  // 右上
  {
    style: {
      ...DRAG_SIZE_STYLE,
      top: 0,
      right: 0,
      cursor: 'ne-resize',
      transform: `translateX(${DRAG_TRANSFORM_SIZE}px) translateY(-${DRAG_TRANSFORM_SIZE}px)`,
    },
    resizeCalcHandle({ componentData, componentCenterX, componentCenterY, deltaW, deltaH }) {
      const { width, height, rotate = 0 } = componentData;

      deltaH *= -1;

      const newWidth = width + deltaW;
      const newHeight = height + deltaH;

      const centerX = componentCenterX + (deltaW / 2 * cos(rotate) + deltaH / 2 * sin(rotate));
      const centerY = componentCenterY + (deltaW / 2 * sin(rotate) - deltaH / 2 * cos(rotate));

      return {
        left: centerX - newWidth / 2,
        top: centerY - newHeight / 2,
        width: newWidth,
        height: newHeight,
      };
    },
  },
  // 左中
  {
    style: {
      ...DRAG_SIZE_STYLE,
      top: '50%',
      left: 0,
      cursor: 'w-resize',
      transform: `translateX(-${DRAG_TRANSFORM_SIZE}px) translateY(-${DRAG_TRANSFORM_SIZE}px)`,
    },
    resizeCalcHandle({ componentData, componentCenterX, componentCenterY, deltaW, deltaH }) {
      const { width, height, rotate = 0 } = componentData;

      deltaW *= -1;

      const newWidth = width + deltaW;

      const centerX = componentCenterX - deltaW / 2 * cos(rotate);
      const centerY = componentCenterY - deltaW / 2 * sin(rotate);

      return {
        top: centerY - height / 2,
        width: newWidth,
        left: centerX - newWidth / 2,
      };
    },
  },
  // 右中
  {
    style: {
      ...DRAG_SIZE_STYLE,
      top: '50%',
      right: 0,
      cursor: 'e-resize',
      transform: `translateX(${DRAG_TRANSFORM_SIZE}px) translateY(-${DRAG_TRANSFORM_SIZE}px)`,
    },
    resizeCalcHandle({ componentData, deltaW, deltaH, componentCenterX, componentCenterY }) {
      const { width, height, rotate = 0 } = componentData;

      const newWidth = width + deltaW;

      const centerX = componentCenterX + deltaW / 2 * cos(rotate);
      const centerY = componentCenterY + deltaW / 2 * sin(rotate);

      return {
        top: centerY - height / 2,
        width: newWidth,
        left: centerX - newWidth / 2,
      };
    },
  },
  // 左下
  {
    style: {
      ...DRAG_SIZE_STYLE,
      bottom: 0,
      left: 0,
      cursor: 'sw-resize',
      transform: `translateX(-${DRAG_TRANSFORM_SIZE}px) translateY(${DRAG_TRANSFORM_SIZE}px)`,
    },
    resizeCalcHandle({ componentData, componentCenterX, componentCenterY, deltaW, deltaH }) {
      const { width, height, rotate = 0 } = componentData;

      deltaW *= -1;

      const newWidth = width + deltaW;
      const newHeight = height + deltaH;

      const centerX = componentCenterX - (deltaW / 2 * cos(rotate) + deltaH / 2 * sin(rotate));
      const centerY = componentCenterY - (deltaW / 2 * sin(rotate) - deltaH / 2 * cos(rotate));

      return {
        top: centerY - newHeight / 2,
        left: centerX - newWidth / 2,
        width: newWidth,
        height: newHeight,
      };
    },
  },
  // 中下
  {
    style: {
      ...DRAG_SIZE_STYLE,
      bottom: 0,
      left: '50%',
      cursor: 's-resize',
      transform: `translateX(-${DRAG_TRANSFORM_SIZE}px) translateY(${DRAG_TRANSFORM_SIZE}px)`,
    },
    resizeCalcHandle({ componentData, componentCenterY, componentCenterX, deltaW, deltaH }) {
      const { width, height, rotate = 0 } = componentData;

      const newHeight = height + deltaH;

      const centerX = componentCenterX - deltaH / 2 * sin(rotate);
      const centerY = componentCenterY + deltaH / 2 * cos(rotate);

      return {
        top: centerY - newHeight / 2,
        left: centerX - width / 2,
        height: newHeight,
      };
    },
  },
  // 右下
  {
    style: {
      ...DRAG_SIZE_STYLE,
      bottom: 0,
      right: 0,
      cursor: 'se-resize',
      transform: `translateX(${DRAG_TRANSFORM_SIZE}px) translateY(${DRAG_TRANSFORM_SIZE}px)`,
    },
    resizeCalcHandle({ componentData, componentCenterY, componentCenterX, deltaW, deltaH }) {
      const { width, height, rotate = 0 } = componentData;
      const newWidth = width + deltaW;
      const newHeight = height + deltaH;

      const centerX = componentCenterX + (deltaW / 2 * cos(rotate) - deltaH / 2 * sin(rotate));
      const centerY = componentCenterY + (deltaW / 2 * sin(rotate) + deltaH / 2 * cos(rotate));

      return {
        top: centerY - newHeight / 2,
        left: centerX - newWidth / 2,
        height: newHeight,
        width: newWidth,
      };
    },
  },
];
