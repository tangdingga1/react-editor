import React, { FC, useContext } from 'react';
import { GlobalContext, DSLContext } from '@/index';
import Void from './void';
import ConfigerPanel from './configerPanel';

import './index.less';

const Configer: FC = () => {
  const { prefixCls } = useContext(GlobalContext);
  const { dataCore, onAddComponent } = useContext(DSLContext);
  const { layer } = dataCore;
  return (
    <div className={`${prefixCls}-configer ${prefixCls}-panel-width`}>{layer.length ? <ConfigerPanel /> : <Void />}</div>
  );
};

export default Configer;
