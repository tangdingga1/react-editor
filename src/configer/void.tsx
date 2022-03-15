import React, { FC, useContext } from 'react';
import { GlobalContext } from '@/index';
import Icon from '@/components/Icon';

const Void: FC = () => {
  const { prefixCls } = useContext(GlobalContext);
  return (
    <div className={`${prefixCls}-configer-panel-content-void`}>
      <Icon type="kongzhuangtai" />
      <p>请添加图片或文字进行编辑</p>
    </div>
  );
};

export default Void;
