import React, { FC, useContext } from 'react';
import { DragSpecWarper } from '@/components/DragSpecWarper';
import { Input, Slider } from 'antd';
import { ComponentProps, ComponentConfigerProps } from '@/interface';
import { GlobalContext } from '@/index';
import NumberPicker from '@/components/NumberPicker';
import { Color, FontStyle, FontFamily } from '@/menu/config';
import './index.less';

const { TextArea } = Input;

const TextComponent: FC<ComponentProps> = ({ data }) => {
  const { text, color } = data;
  return (
    <div style={{ ...data, textDecorationColor: color }}>{text}</div>
  );
}

const TextConfiger: FC<ComponentConfigerProps> = ({ data, $$onChange }) => {
  const { prefixCls } = useContext(GlobalContext);
  const { text, opacity, fontSize, color, fontFamily } = data;
  return (
    <>
      <div className={`${prefixCls}-specs-word-item`}>
        <span className={`${prefixCls}-specs-word-item-title`}>文本</span>
        <div className={`${prefixCls}-specs-word-item-content`}>
          <TextArea
            value={text}
            onChange={e => { $$onChange({ text: e.target.value }); }}
          />
        </div>
      </div>
      <FontFamily value={fontFamily} $$onChange={$$onChange} />
      <div className={`${prefixCls}-specs-word-item`}>
        <span className={`${prefixCls}-specs-word-item-title`}>字号</span>
        <div className={`${prefixCls}-specs-word-item-content`}>
          <NumberPicker
            min={12}
            max={40}
            style={{ width: 120 }}
            onChange={fontSize => { $$onChange({ fontSize }); }}
            value={fontSize}
          />
        </div>
      </div>
      <Color $$onChange={color => $$onChange({ color })} value={color} />
      <FontStyle style={data} $$onChange={$$onChange} />
      <div className={`${prefixCls}-specs-word-item`}>
        <span className={`${prefixCls}-specs-word-item-title`}>透明</span>
        <div className={`${prefixCls}-specs-word-item-content`}>
          <Slider
            min={0}
            max={10}
            step={1}
            onChange={value => $$onChange({ opacity: value / 10 })}
            value={opacity * 10}
          />
        </div>
      </div>
    </>
  );
}

const commonStyle: React.CSSProperties = {
  color: '#333333',
  fontStyle: 'normal',
  fontWeight: 'bold',
  textDecorationLine: 'none',
  textAlign: 'left',
  letterSpacing: 0,
  opacity: 1,
  fontFamily: 'MicrosoftYaHei',
};

const WordList: { text: string; defaultData: React.CSSProperties }[] = [
  {
    text: '一级标题',
    defaultData: {
      ...commonStyle,
      width: 112,
      height: 37,
      fontSize: 28,
      lineHeight: '37px',
    },
  },
  {
    text: '二级标题',
    defaultData: {
      ...commonStyle,
      width: 88,
      height: 30,
      fontSize: 22,
      lineHeight: '30px',
    },
  },
  {
    text: '三级标题',
    defaultData: {
      ...commonStyle,
      width: 64,
      height: 21,
      fontSize: 16,
      lineHeight: '21px',
    },
  },
  {
    text: '普通文本',
    defaultData: {
      ...commonStyle,
      width: 56,
      height: 19,
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: '19px',
    },
  }
];

function WordPanel() {
  const { prefixCls } = useContext(GlobalContext);
  return (
    <div className={`${prefixCls}-specs-word-panel`}>
      {
        WordList.map(({ text, defaultData }) => {
          return (
            <div className={`${prefixCls}-specs-word-panel-item`}>
              <DragSpecWarper
                name={text}
                Component={TextComponent}
                Configer={TextConfiger}
                defaultData={{ ...defaultData, text }}
              >
                <div style={{ ...defaultData, width: '100%' }}>{text}</div>
              </DragSpecWarper>
            </div>
          );
        })
      }
    </div>
  );
}

export default {
  title: '文字',
  iconType: 'wenzi',
  content: <WordPanel />,
};
