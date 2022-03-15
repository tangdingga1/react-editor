import React, { FC, useContext } from 'react';
import { MenuConfig } from '@/interface';
import { GlobalContext } from '@/index';
import { Select } from 'antd';

type TFontFamily = {
  value: string;
  $$onChange: (data: Object) => void;
}

const FontFamilyList = [
  { label: '方正卓越体简繁 Medium', value: 'FZZHUOYTJF_ZHUN--GBK1-0-MA' },
  { label: '方正卓越体简繁 DemiBold', value: 'FZZHUOYTJF_ZHONG--GBK1-0-MA' },
  { label: '方正卓越体简繁 Light', value: 'FZZHUOYTJF_XI--GBK1-0-MA' },
];

const FontFamily: FC<TFontFamily> = ({ value, $$onChange }) => {
  const { prefixCls } = useContext(GlobalContext);
  return (
    <div className={`${prefixCls}-specs-word-item`}>
      <span className={`${prefixCls}-specs-word-item-title`}>字体</span>
      <div className={`${prefixCls}-specs-word-item-content`}>
        <Select
          style={{ width: '100%' }}
          onChange={fontFamily => { $$onChange({ fontFamily }); }}
          value={value}
          options={FontFamilyList}
        />
      </div>
    </div>
  );
};

export default FontFamily;
