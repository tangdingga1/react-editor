import React, { FC, useContext } from 'react';
import { GlobalContext, DSLContext } from '@/index';
import { CONFIGER_COMPONENT_NAME, DATA_CORE_DATA_NAME } from '@/constant';
import { SpecData } from '@/interface';
import Layer from './layer';

const ConfigerPanel: FC = () => {
  const { prefixCls } = useContext(GlobalContext);
  const { dataCore, onChangeComponentDataAndRecordHistory } = useContext(DSLContext);
  const { layer, activeComponents } = dataCore;
  // 目标不支持多选组合
  const [id] = activeComponents;
  const dataCoreData = layer.find((layerItem) => layerItem.id === id) as SpecData;
  const { [CONFIGER_COMPONENT_NAME]: Configer, [DATA_CORE_DATA_NAME]: data, name } = dataCoreData || {};
  return (
    <>
      <div className={`${prefixCls}-configer-top-panel`}>
        <div className={`${prefixCls}-configer-panel-title`}>设置-{name}</div>
        {Configer && (
          <div className={`${prefixCls}-configer-panel-content`} style={{ padding: 16 }}>
            <Configer data={data} $$onChange={(updateData: { [dataName: string]: any }) => onChangeComponentDataAndRecordHistory(id, updateData)} />
          </div>
        )}
      </div>
      <div className={`${prefixCls}-configer-bottom-panel`}>
        <div className={`${prefixCls}-configer-panel-title`}>图层</div>
        <Layer />
      </div>
    </>
  );
};

export default ConfigerPanel;
