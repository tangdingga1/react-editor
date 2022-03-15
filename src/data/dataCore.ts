import { useState } from 'react';
import { DataCoreContext, ComponentSpecWarperProps, DataCore, SpecData, ExtendsDslData } from '@/interface';
import { getUniqueId } from '@/utils';
import { DATA_CORE_DATA_NAME } from '@/constant';
import HistoryStack from './historyStack';

export const initialDataCore = {
  // 层级
  layer: [],
  // 选中元素集
  activeComponents: [],
};

const initialDataCoreData = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};

function initialData(componentData: ComponentSpecWarperProps, assignProps?: { [propName: string]: string | number }): SpecData {
  const { defaultData = {} } = componentData;
  return {
    ...componentData,
    id: getUniqueId(),
    [DATA_CORE_DATA_NAME]: {
      ...initialDataCoreData,
      ...assignProps,
      ...defaultData,
    },
  };
}

export function useDataCore(): DataCoreContext {
  const [dataCore, setDataCore] = useState<DataCore>(initialDataCore);
  return {
    dataCore,

    setLayer(layer) {
      setDataCore((preDataCoreData) => {
        return { ...preDataCoreData, layer };
      });
    },

    onAddComponent(componentData: ComponentSpecWarperProps, assignProps?: { [propName: string]: string | number }) {
      const { dataCore } = HistoryStack.updateHistory({
        type: 'ADD',
        updateType: 'dataCore',
        data: initialData(componentData, assignProps),
      });
      setDataCore((preDataCoreData) => ({
        ...preDataCoreData,
        layer: dataCore,
      }));
    },

    onActiveComponent(id: number) {
      setDataCore((preDataCoreData) => {
        return {
          ...preDataCoreData,
          activeComponents: [id],
        };
      });
    },

    onReplaceComponentDataAndRecordHistory(layer) {
      const { dataCore } = HistoryStack.updateHistory({
        type: 'REPLACE',
        updateType: 'dataCore',
        dataList: layer,
      });
      setDataCore(preDataCore => {
        return { ...preDataCore, layer: dataCore };
      });
    },

    onChangeComponentDataAndRecordHistory(id: number, data: ExtendsDslData) {
      const { dataCore } = HistoryStack.updateHistory({
        type: 'UPDATE',
        updateType: 'dataCore',
        id,
        data,
      });
      setDataCore((preDataCoreData) => ({
        ...preDataCoreData,
        layer: dataCore,
      }));
    },

    onDeleteComponentAndRecordHistory(id: number) {
      const { dataCore } = HistoryStack.updateHistory({
        type: 'DELETE',
        updateType: 'dataCore',
        id,
        data: {},
      });
      setDataCore(preDataCoreData => ({
        ...preDataCoreData,
        layer: dataCore,
      }));
    },

    onChangeLayerIdx(from: number, to: number) {
      if (to < 0 || to > dataCore.layer.length - 1) {
        return;
      }
      setDataCore((preDataCoreData) => {
        const { layer } = preDataCoreData;
        const updateLayer = layer.slice();
        [updateLayer[from], updateLayer[to]] = [updateLayer[to], updateLayer[from]];
        const resultLayer = updateLayer.map((updateItem, index) => ({
          ...updateItem,
          [DATA_CORE_DATA_NAME]: {
            // 对应的图层等级也要调整
            ...updateItem[DATA_CORE_DATA_NAME],
            zIndex: index,
          }
        }));
        const { dataCore } = HistoryStack.updateHistory({
          type: 'REPLACE',
          updateType: 'dataCore',
          dataList: resultLayer,
        });
        return {
          ...preDataCoreData,
          layer: dataCore,
        };
      });
    },
  };
}
