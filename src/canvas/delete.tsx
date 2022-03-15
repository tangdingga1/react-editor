import React, { useContext, FC } from 'react';
import { GlobalContext } from '@/index';
import Icon from '@/components/Icon';
import './index.less';

type Delete = {
  onClick: (e?: any) => void;
}

const Delete: FC<Delete> = function ({ onClick }) {
  const { prefixCls } = useContext(GlobalContext);
  return (
    <div className={`${prefixCls}-canvas-delete`} onClick={onClick}>
      <Icon type="shanchu" />
    </div>
  );
}

export default Delete;
