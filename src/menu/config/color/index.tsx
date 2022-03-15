import React, { FC, useCallback, useContext } from 'react';
import { MenuConfig } from '@/interface';
import { GlobalContext } from '@/index';
import { Select } from 'antd';
import { SketchPicker } from 'react-color';

import './index.less';

const Color: FC<MenuConfig> = function ({ label = '颜色', value, $$onChange }) {
  const { prefixCls } = useContext(GlobalContext);
  const dropdownRender = useCallback(function () {
    return (
      <SketchPicker
        color={value}
        onChangeComplete={(color) => $$onChange(color.hex)}
        width={'90%'}
        disableAlpha
      />
    );
  }, [value]);
  const tagRender = useCallback(function (props) {
    return (
      <div
        className={`${prefixCls}-config-color-box`}
        style={{ backgroundColor: value }}
      />
    );
  }, [value]);
  return (
    <div className={`${prefixCls}-config-item`}>
    <span className={`${prefixCls}-config-item-title`}>{label}</span>
      <div className={`${prefixCls}-config-item-content`}>
        <Select
          style={{ width: '100%' }}
          mode="multiple"
          showArrow
          showSearch={false}
          value={value}
          tagRender={tagRender}
          dropdownRender={dropdownRender}
        />
      </div>
    </div>
  );
}

export default Color;
