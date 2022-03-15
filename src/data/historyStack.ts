import { initCanvasData } from '@/constant';
import { CanvasData, SpecData } from '@/interface';
import { DATA_CORE_DATA_NAME } from '@/constant';
interface IStackItem {
  type: 'ADD' | 'DELETE' | 'UPDATE' | 'REPLACE',
  updateType: 'canvas' | 'dataCore';
  id?: number | string;
  data?: { [propsName:string]: any };
  dataList?: SpecData[];
}

interface IStackData {
  canvas: CanvasData;
  dataCore: SpecData[];
}

// 栈推完应该为 -1， 此时返回源数据
const MIN_STACK_IDX = -1;
class HistoryStack {
  index: number = MIN_STACK_IDX;
  size: number = 0;
  stack: IStackItem[] = [];
  originData: IStackData = { canvas: initCanvasData, dataCore: [] };
  updater: Function = () => {};
  constructor(size: number) {
    // 单例
    this.size = size;
    this.stack = [];
  }

  private next = () => {
    let newStackIdx = this.index + 1;
    if (newStackIdx < this.stack.length) {
      this.index = newStackIdx;
    }
  };

  private pre = () => {
    let newStackIdx = this.index - 1;
    if (newStackIdx >= MIN_STACK_IDX) {
      this.index = newStackIdx;
    }
  };

  // 图层相关只有可能进行数据更新
  private updateCanvas = (target: IStackData, data: Object) => {
    const { canvas } = target;
    return { ...canvas, ...data };
  };

  private updateDsl = (target: IStackData, updateData: IStackItem) => {
    const { type, data = {}, id: changeId, dataList = [] } = updateData;
    const { dataCore } = target;
    switch(type) {
      case 'ADD':
        return [...dataCore, data];
      case 'DELETE':
        return dataCore.filter(({ id }) => id !== changeId);
      case 'UPDATE':
        return dataCore.map((item: SpecData) => {
          if (item.id === changeId) {
            return {
              ...item,
              // 只有 core data 会进行更新
              [DATA_CORE_DATA_NAME]: {
                ...item[DATA_CORE_DATA_NAME],
                ...data,
              },
            };
          }
          return item;
        });
      // 替换全部的dsl，慎用
      case 'REPLACE':
        return dataList;
      default:
        throw new TypeError(`no such stack type: ${type}`);
    }
  };

  private updateDataByType = (target: IStackData, updateData: IStackItem) => {
    const { updateType, data = {} } = updateData;
    switch(updateType) {
      case 'canvas':
        return this.updateCanvas(target, data);
      case 'dataCore':
        return this.updateDsl(target, updateData);
    }
  };

  getIdx = () => this.index;

  onHistoryBack = () => {
    this.pre();
    return this.getDataByIdx();
  };

  onHistoryForward = () => {
    this.next();
    return this.getDataByIdx();
  };

  getDataByIdx = (idx = this.index) => {
    const { originData, stack } = this;
    if (idx === MIN_STACK_IDX) {
      return originData;
    }
    return stack.slice(0, idx + 1).reduce((accumulator, updateData: IStackItem) => {
      const { updateType } = updateData;
      let targetData = { ...accumulator };
      // initial
      if (!accumulator.hasOwnProperty(updateType)) {
        targetData = { ...accumulator, [updateType]: [] };
      }
      return {
        ...accumulator,
        [updateType]: this.updateDataByType(targetData, updateData),
      };
    }, originData);
  };

  updateHistory = (data: IStackItem) => {
    const { stack, index, size } = this;
    // 如果更新时，当前指针不是指在在新的记录，抛弃掉后面所有的记录
    if (stack.length > index + 1) {
      this.stack = [...stack.slice(0, index + 1), data];
      this.next();
      return this.getDataByIdx();
    // 超过最大值，那么源数据应该变为栈的第一层，栈的第一层去除
    } else if (stack.length === size) {
      this.originData = this.getDataByIdx(0);
      this.stack = [...stack.slice(1), data];
      return this.getDataByIdx();
    }
    this.stack = [...stack, data];
    this.next();
    return this.getDataByIdx();
  };
}



export default new HistoryStack(10);
