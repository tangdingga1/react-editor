import React, { FC, useContext, useRef } from 'react';
import cs from 'classnames';
import { GlobalContext, DSLContext } from '@/index';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { LAYER_TYPE_NAME } from '@/constant';
import { XYCoord } from 'dnd-core';
import Icon from '@/components/Icon';
import { SpecData } from '@/interface';
import { mapRight } from '@/utils';

const LAYER_ITEM_HEIGHT = 72;
const MOVE_HEIGHT = LAYER_ITEM_HEIGHT - 20;

interface ILayerItemProps {
  item: SpecData;
  id: number;
}

function getChangeIndexByOffsetY(y: number, ele: HTMLDivElement | null) {
  if (ele) {
    const { top } = ele.getBoundingClientRect();
    // 大于高度一半的时候认为想要到对应位置
    return Math.floor(
      Math.floor(y - top) / MOVE_HEIGHT
    );
  }
}


const LayerItem: FC<ILayerItemProps> = ({ item, id }) => {
  const { prefixCls } = useContext(GlobalContext);
  const { dataCore: { layer }, onChangeLayerIdx } = useContext(DSLContext);
  const index = layer.findIndex(layerItem => layerItem.id === id);
  const [{ isDragging }, drag] = useDrag({
    item: { type: LAYER_TYPE_NAME, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div
      className={`${prefixCls}-configer-layer`}
      ref={drag}
      style={{ opacity: isDragging ? 0 : 1, height: LAYER_ITEM_HEIGHT }}
    >
      <div>
        <div className={`${prefixCls}-configer-layer-show`} />
        <div>{item.name}</div>
      </div>
      <div>
        <Icon
          type="yidong"
          className={`${prefixCls}-configer-layer-move-icon`}
          onClick={() => onChangeLayerIdx(index, index + 1)}
        />
        <Icon
          type="yidong"
          className={cs(`${prefixCls}-configer-layer-move-icon`, `${prefixCls}-configer-layer-move-icon-back`)}
          onClick={() => onChangeLayerIdx(index, index - 1)}
        />
      </div>
    </div>
  )
}

function Layer() {
  const ref = useRef<HTMLDivElement>(null)
  const { prefixCls } = useContext(GlobalContext);
  const { dataCore, onChangeLayerIdx } = useContext(DSLContext);
  const { layer } = dataCore;

  const [{ isOver }, drop] = useDrop({
    accept: LAYER_TYPE_NAME,
    collect: (monitor: any) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover(item: any, monitor: DropTargetMonitor) {
      const { y } = monitor.getClientOffset() as XYCoord;
      let willChangeIndex = getChangeIndexByOffsetY(y, ref.current);
      if (typeof willChangeIndex === 'number') {
        // 边界值
        if (willChangeIndex < 0) {
          willChangeIndex = 0;
        }

        if (willChangeIndex > layer.length - 1) {
          willChangeIndex = layer.length - 1;
        }

        // 顺序反转，因此需要倒着找到准确的 index
        willChangeIndex = layer.length - 1 - willChangeIndex;

        if (willChangeIndex !== item.index) {
          onChangeLayerIdx(item.index, willChangeIndex);
          // 高频的即时更新 index，参考官方示例
          item.index = willChangeIndex;
        }
      }
    },
  }, [dataCore]);

  drop(ref);

  return (
    <div className={cs(`${prefixCls}-configer-panel-content`, isOver && `${prefixCls}-configer-panel-drag-item`)} ref={ref}>
      {/* 图层的展示的顺序为 zIndex 最小的在最底层，因此是反转过来的 */}
      {
        mapRight(layer, (item, index, originIdx) => <LayerItem item={item} id={item.id} key={item.id} />)
      }
    </div>
  );
}

export default Layer;
