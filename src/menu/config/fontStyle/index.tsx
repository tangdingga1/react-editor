import React, { FC, useContext, useState } from 'react';
import { Radio, Dropdown, Slider } from 'antd';
import { GlobalContext } from '@/index';

import Icon from '@/components/Icon';
import './index.less';

const { Button } = Radio;


const FontOverlay: FC = ({ style, $$onChange }) => {
  const { prefixCls } = useContext(GlobalContext);

  const { lineHeight, fontSize, letterSpacing } = style;
  return (
    <div className={`${prefixCls}-overlay`}>
      <p>行间距</p>
      <Slider
        min={0}
        max={50}
        step={1}
        onChange={value => $$onChange({ lineHeight: `${value + fontSize}px` })}
        value={parseInt(lineHeight) - fontSize}
      />
      <p>字间距</p>
      <Slider
        min={0}
        max={20}
        step={1}
        onChange={value => $$onChange({ letterSpacing: value })}
        value={letterSpacing}
      />
    </div>
  );
};

const FontStyle: FC = ({ style, $$onChange }) => {
  const { prefixCls } = useContext(GlobalContext);
  return (
    <div className={`${prefixCls}-config-item`}>
      <span className={`${prefixCls}-config-item-title`} />
      <div className={`${prefixCls}-config-item-content`}>
        <div className={`${prefixCls}-buttons`}>
          <Button
            checked={style.fontWeight === 'bold'}
            onClick={() => $$onChange({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' })}
          >
            <Icon type="jiacu" />
          </Button>
          <Button
            checked={style.fontStyle === 'italic'}
            onClick={() => $$onChange({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' })}
          >
            <Icon type="qingxie" />
          </Button>
          <Button
            checked={style.textDecorationLine === 'underline'}
            onClick={() => $$onChange({ textDecorationLine: style.textDecorationLine === 'underline' ? 'none' : 'underline' })}
          >
            <Icon type="xiahuaxian" />
          </Button>
          <Button
            checked={style.textDecorationLine === 'line-through'}
            onClick={() => $$onChange({ textDecorationLine: style.textDecorationLine === 'line-through' ? 'none' : 'line-through' })}
          >
            <Icon type="shanchuxian" />
          </Button>
        </div>
        <div className={`${prefixCls}-buttons`}>
          <Button
            checked={style.textAlign === 'left'}
            onClick={() => $$onChange({ textAlign: 'left' })}
          >
            <Icon type="zuoduiqi" />
          </Button>
          <Button
            checked={style.textAlign === 'center'}
            onClick={() => $$onChange({ textAlign: 'center' })}
          >
            <Icon type="juzhongduiqi" />
          </Button>
          <Button
            checked={style.textAlign === 'right'}
            onClick={() => $$onChange({ textAlign: 'right' })}
          >
            <Icon type="juzhongduiqi" />
          </Button>
          <Dropdown
            trigger={['click']}
            overlay={
              <FontOverlay
                style={style}
                $$onChange={$$onChange}
              />
            }
          >
            <Button>
              <Icon type="zifuyangshi" />
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};


export default FontStyle;
