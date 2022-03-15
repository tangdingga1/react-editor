import React, { FC, useCallback, useContext, useEffect } from 'react';
import { CommonPartProps, SpecData } from '@/interface';
import { useDrop } from 'react-dnd';
import { CanvasContext, GlobalContext, DSLContext } from '@/index';
import { SPEC_TYPE_NAME, CANVAS_ID, DEFAULT_CANVAS_IMAGE } from '@/constant';
import { getPositionInCanvas } from '@/utils';
import CanvasComponent from './canvasComponent';
import keyboardEventListener from './keyboardEventListener';
import './index.less';

const ALL_DROP_TYPE = [SPEC_TYPE_NAME];

const CANVAS_PADDING = 30;

function getCanvasBg(backgroundColor: string | undefined) {
  if (!backgroundColor) {
    return DEFAULT_CANVAS_IMAGE;
  }
  if (backgroundColor!.includes('#ffffff')) {
    return DEFAULT_CANVAS_IMAGE;
  }
  return '';
}

const Canvas: FC<CommonPartProps> = () => {
  const {
    canvas: { width, height, scale, backgroundColor },
  } = useContext(CanvasContext);
  const { prefixCls } = useContext(GlobalContext);
  const {
    dataCore,
    onAddComponent,
    onChangeComponentDataAndRecordHistory,
    onDeleteComponentAndRecordHistory,
  } = useContext(DSLContext);
  const { layer, activeComponents } = dataCore;
  const [collectedProps, drop] = useDrop(
    () => ({
      accept: ALL_DROP_TYPE,
      drop: (item: any, monitor) => {
        switch (item.type) {
          // 组件注入
          case SPEC_TYPE_NAME: {
            const { x, y } = monitor.getClientOffset() as { x: number; y: number };
            onAddComponent(item, { ...getPositionInCanvas(x, y), zIndex: layer.length });
            break;
          }
          default:
            break;
        }
      },
    }),
    [dataCore]
  );
  const keyEventListener = useCallback((event: KeyboardEvent) => {
    const [targetId] = activeComponents;
    if (targetId) {
      const target = layer.find(({ id }) => id === targetId);
      if (target) {
        keyboardEventListener(event, {
          target,
          onChange: onChangeComponentDataAndRecordHistory,
          onDelete: onDeleteComponentAndRecordHistory,
        });
      }
    }
  }, [dataCore]);
  useEffect(() => {
    document.body.addEventListener('keydown', keyEventListener);
    return () => {
      document.body.removeEventListener('keydown', keyEventListener);
    };
  }, [dataCore]);
  return (
    <div className={`${prefixCls}-canvas ${prefixCls}-canvas-width`}>
      <div
        className={`${prefixCls}-canvas-box`}
        style={{ width: width + CANVAS_PADDING * 2, padding: CANVAS_PADDING }}
      >
        <div
          className={`${prefixCls}-canvas-core`}
          style={{
            width,
            height,
            backgroundColor,
            backgroundImage: `url(${getCanvasBg(backgroundColor)})`,
          }}
          ref={drop}
          id={CANVAS_ID}
        >
          {layer.map(layerItem => <CanvasComponent componentData={layerItem} key={layerItem.id} />)}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
