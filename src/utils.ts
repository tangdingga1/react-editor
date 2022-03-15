import { CANVAS_ID } from '@/constant';

const UNIQUE_ID_MAP: { [id: number]: boolean } = {};

export const getUniqueId = (wantedId?: number): number => {
  const id = wantedId || Date.now();
  if (UNIQUE_ID_MAP[id]) {
    return getUniqueId(id + 1);
  }
  UNIQUE_ID_MAP[id] = true;
  return id;
}

interface IMapRight<T> {
  (list: T[], handle: (item: T, index: number, originIdx: number) => T): T[];
}

export const mapRight: IMapRight<any> = (list, handle) => {
  const result = [];
  for (let i = list.length - 1, originIdx = 0; i > -1; i--, originIdx++) {
    result.push(
      handle(list[i], i, originIdx)
    );
  }
  return result;
}

export function getCanvasInfo(): DOMRect {
  const canvas = document.querySelector(`#${CANVAS_ID}`);
  if (canvas) {
    return canvas.getBoundingClientRect();
  }
  return document.body.getBoundingClientRect();
}

export function getPositionInCanvas(x: number, y: number) {
  const { left, top } = getCanvasInfo();
  return {
    left: parseInt(`${x - left}`, 10),
    top: parseInt(`${y - top}`, 10),
  };
}

// 角度转弧度
function toRadianByAngle(angle: number) {
  return angle * Math.PI / 180
}
