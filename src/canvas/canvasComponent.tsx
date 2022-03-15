import React, { useContext, FC, useEffect } from 'react';
import { CANVAS_COMPONENT_NAME, DATA_CORE_DATA_NAME } from '@/constant';
import { SpecData, DataCoreData } from '@/interface';
import { GlobalContext, DSLContext } from '@/index';
import TransLayer from './transLayer';
import Delete from './delete';


const CanvasComponent: FC<{ componentData: SpecData }> = ({ componentData }) => {
  const { prefixCls } = useContext(GlobalContext);
  const {
    dataCore: { activeComponents },
    onActiveComponent,
    onChangeComponentDataAndRecordHistory,
    onDeleteComponentAndRecordHistory,
  } = useContext(DSLContext);

  const { [CANVAS_COMPONENT_NAME]: Component, [DATA_CORE_DATA_NAME]: data, id } = componentData;
  const { left, top, zIndex } = data;
  const isActive = activeComponents.includes(id);

  return (
    <div
      className={`${prefixCls}-canvas-component`}
      style={{ left, top, zIndex }}
      onClick={() => onActiveComponent(id)}
    >
      {
        isActive
        &&
        <Delete onClick={() => onDeleteComponentAndRecordHistory(id)} />
      }
      <TransLayer
        key={id}
        isActive={isActive}
        prefixCls={prefixCls}
        onRecord={data => onChangeComponentDataAndRecordHistory(id, data)}
        componentData={data}
      >
        <div className={`${prefixCls}-canvas-component-drag-layer`}>
          <Component key={id} data={{ ...data, transform: isActive ? '' : data.transform }} />
        </div>
      </TransLayer>
    </div>
  );
};

export default CanvasComponent;
