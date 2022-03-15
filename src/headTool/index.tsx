import React, { FC, useContext, useState, useCallback } from 'react';
import { SketchPicker } from 'react-color';
import { Button } from 'antd';

import { CommonPartProps } from '@/interface';
import { CanvasContext, GlobalContext, DSLContext } from '@/index';
import IntegerNumberInput from '@/components/IntegerNumberInput';
import Icon from '@/components/Icon';
import { HistoryStack } from '@/data';
import { toAliDsl } from '@/parser';

import './index.less';

type HeadToolProps = CommonPartProps;

const HistorySetterIconStyle = { fontSize: 24, cursor: 'pointer' };

type TAdjustType = 'forward' | 'back';

function adjustDataByHistoryStack(adjustType: TAdjustType, { setLayer, setCanvas }) {
  const { canvas, dataCore } = HistoryStack[adjustType === 'forward' ? 'onHistoryForward' : 'onHistoryBack']();
  setCanvas(canvas);
  setLayer(dataCore);
}

const HistorySetter: FC = () => {
  const { setCanvas } = useContext(CanvasContext);
  const { setLayer } = useContext(DSLContext);
  return (
    <>
      <Icon type="chexiao" style={{ ...HistorySetterIconStyle, marginRight: 30 }} onClick={() => adjustDataByHistoryStack('back', { setLayer, setCanvas })} />
      <Icon type="zhongzuo" style={ HistorySetterIconStyle } onClick={() => adjustDataByHistoryStack('forward', { setLayer, setCanvas })} />
    </>
  );
}

const CanvasSetter: FC = () => {
  const {
    canvas: { width, height, backgroundColor },
    setCanvasWithRecord,
  } = useContext(CanvasContext);
  const [visible, setVisible] = useState(false);
  const { prefixCls } = useContext(GlobalContext);
  return (
    <>
      背景：
      <div className={`${prefixCls}-head-color-box`}>
        {
          backgroundColor && !backgroundColor.includes('#ffffff') ?
            <div className={`${prefixCls}-head-rect`} style={{ backgroundColor }} onClick={() => setVisible(preState => !preState)} />
            :
            <Icon className={`${prefixCls}-head-rect`} type="beijing" onClick={() => setVisible(preState => !preState)} />
        }
        <div className={`${prefixCls}-head-color-picker`}>
          {
            visible
            &&
            <SketchPicker
              onChangeComplete={({ hex }) => setCanvasWithRecord({ backgroundColor: hex })}
              color={backgroundColor}
              width={300}
              disableAlpha
            />
          }
        </div>
      </div>

      宽：
      <IntegerNumberInput className={`${prefixCls}-head-input`} onChange={width => setCanvasWithRecord({ width })} value={`${width}`} />
      <span className={`${prefixCls}-head-interval`}>px</span>
      高：
      <IntegerNumberInput className={`${prefixCls}-head-input`} onChange={height => setCanvasWithRecord({ height })} value={`${height}`} />
      px
    </>
  );
};

const SCALE_INTERVAL = 10;

const CanvasScaler: FC = () => {
  const {
    canvas: { scale },
    setCanvasWithRecord,
  } = useContext(CanvasContext);
  const { prefixCls } = useContext(GlobalContext);
  return (
    <>
      <Icon
        type="jianshao"
        className={`${prefixCls}-head-scaler-icon`}
        onClick={() => setCanvasWithRecord({ scale: scale - SCALE_INTERVAL })}
      />
      {scale}%（默认）
      <Icon
        type="zengjia"
        className={`${prefixCls}-head-scaler-icon`}
        onClick={() => setCanvasWithRecord({ scale: scale - SCALE_INTERVAL })}
      />
    </>
  );
};


const HeadTool: FC<HeadToolProps> = () => {
  const { prefixCls } = useContext(GlobalContext);
  const { dataCore: { layer } } = useContext(DSLContext);
  const { canvas } = useContext(CanvasContext);
  const save = useCallback(function () {
    toAliDsl({ canvas, layer });
  }, [canvas, layer]);
  return (
    <div className={`${prefixCls}-head-box`}>
      <div className={`${prefixCls}-head ${prefixCls}-tool-head-height`}>
        <h1 className={`${prefixCls}-head-title`}>编辑器</h1>
        <div className={`${prefixCls}-head-split-line`} />
        <HistorySetter />
        <div className={`${prefixCls}-head-split-line`} />
        <CanvasSetter />
        <div className={`${prefixCls}-head-split-line`} />
        <CanvasScaler />
      </div>
      <Button onClick={save}>保存</Button>
    </div>
  );
};

export default HeadTool;
