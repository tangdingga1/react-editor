import { ReactElement, FunctionComponent, ComponentClass } from 'react';

// --- data ---
export type GlobalData = {
  prefixCls: string;
}

export type CanvasData = {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  scale: number;
}

export type TCanvasContext = {
  canvas: CanvasData;
  setCanvas: (data: CanvasData) => void;
  setCanvasWithRecord: (
    data: { width?: number, height?: number, backgroundColor?: string, backgroundImage?: string, scale?: number }
  ) => void;
}

export type DataCoreData = {
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex?: number;
  [props: string]: any;
}

export type SpecData = ComponentSpecWarperProps & {
  // 生成的全局唯一id
  id: number;
  data: DataCoreData;
}

export type DataCore = {
  layer: SpecData[];
  activeComponents: number[];
}

export type ExtendsDslData = {
  [propName: string]: string | number;
}

export type DataCoreContext = {
  dataCore: DataCore;
  setLayer: (data: SpecData[]) => void;
  onAddComponent: (componentData: ComponentSpecWarperProps, assignProps?: { [propName: string]: string | number }) => void;
  onActiveComponent: (id: number) => void;
  onChangeComponentDataAndRecordHistory: (id: number, data: ExtendsDslData) => void;
  onReplaceComponentDataAndRecordHistory: (layer: SpecData[]) => void;
  onChangeLayerIdx: (from: number, to: number) => void;
  onDeleteComponentAndRecordHistory: (id: number) => void;
}

// --- props ---
export type CommonPartProps = {
  prefixCls?: string;
}

export type DefaultMenuItem = {
  type: 'word' | 'image' | 'price';
}


export type CustomMenuRenderProps = {
  data: DataCore;
  canvas: CanvasData;
  setCanvas: (data: CanvasData) => void;
  onAddComponent: (componentData: ComponentSpecWarperProps, assignProps?: { [propName: string]: string | number }) => void;
  onActiveComponent: (id: number) => void;
  onChangeComponent: (id: number, data: ExtendsDslData) => void;
  onDeleteComponent: (id: number) => void;
}

export type CustomMenuItem = {
  iconType: string;
  title: string;
  // 自定义的菜单文件
  content?: ReactElement;
  //
  render?: (props: CustomMenuRenderProps) => ReactElement;
}

export type TMenuItem = DefaultMenuItem | CustomMenuItem;

export type ComponentSpecWarperProps = {
  // 用于展示在右侧面板组件名称
  name: string;
  // 中间部分的组件
  Component: FunctionComponent<any> | ComponentClass<any>;
  Configer: (FunctionComponent<any> | ComponentClass<any>);
  // 初始数据
  defaultData?: { [propsName: string]: number | string };
}


// outside interface
export type ComponentProps = {
  data: DataCoreData;
}

export type ComponentConfigerProps = {
  data: DataCoreData;
  $$onChange: (data: { [dataName: string]: any }) => void;
}

export type MenuConfig = {
  value: any;
  $$onChange: (data: { [dataName: string]: any }) => void;
  label?: 'text';
}

// 坐标类型 [x, y]
export type CoordinatePoint = [number, number];
