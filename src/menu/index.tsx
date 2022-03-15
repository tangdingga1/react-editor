import React, { FC, useState, useContext } from 'react';
import { CommonPartProps, TMenuItem, CustomMenuItem, SetDsl } from '@/interface';
import Icon from '@/components/Icon';
import cs from 'classnames';
import { GlobalContext, CanvasContext, DSLContext } from '@/index';
import { mergeMenusWithDefaultSpecs } from './specs';

import './index.less';

interface IMenuProps extends CommonPartProps {
  menu?: TMenuItem[];
}

interface IPanelProps extends CustomMenuItem {
  prefixCls: string;
  isActive: boolean;
  setActiveIdx: () => void;
}

const DEFAULT_MENU: TMenuItem[] = [{ type: 'word' }];

const Panel: FC<IPanelProps> = ({ iconType, title, isActive, setActiveIdx }) => {
  const { prefixCls } = useContext(GlobalContext);
  return (
    <div
      className={`${prefixCls}-menu-icon ${isActive && `${prefixCls}-menu-icon-active`}`}
      onClick={setActiveIdx}>
      <Icon type={iconType}
    />
      {`${title}`}
    </div>
  );
};

const Menu: FC<IMenuProps> = ({ menu = DEFAULT_MENU }) => {
  const finalMenu = mergeMenusWithDefaultSpecs(menu);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isShow, setMenuShow] = useState<boolean>(true);
  const { prefixCls } = useContext(GlobalContext);
  const { canvas, setCanvasWithRecord } = useContext(CanvasContext);
  const {
    dataCore,
    onActiveComponent,
    onDeleteComponentAndRecordHistory,
    onAddComponent,
    onChangeComponentDataAndRecordHistory,
  } = useContext(DSLContext);
  const MenuItem = finalMenu[activeIdx];
  return (
    <div className={`${prefixCls}-menu ${prefixCls}-menu-width`}>
      <div className={`${prefixCls}-menu-panel`}>
        {
          finalMenu.map((menuItem: CustomMenuItem, index) => (
            <Panel
              {...menuItem}
              prefixCls={prefixCls}
              isActive={index === activeIdx}
              setActiveIdx={() => setActiveIdx(index)}
              key={menuItem.title}
            />
          ))
        }
      </div>
      <div className={cs(`${prefixCls}-menu-content`, isShow || `${prefixCls}-menu-content-hidden`)}>
        <div className={`${prefixCls}-menu-content-item`}>
          {/* 优先级 render > content */}
          {
            typeof MenuItem.render === 'function' ?
              MenuItem.render({
                canvas,
                data: dataCore,
                setCanvas: setCanvasWithRecord,
                onActiveComponent,
                onAddComponent,
                onDeleteComponent: onDeleteComponentAndRecordHistory,
                onChangeComponent: onChangeComponentDataAndRecordHistory,
              })
              :
              MenuItem.content
          }
        </div>
        <div className={`${prefixCls}-menu-arrow`} onClick={() => setMenuShow(!isShow)}>
          <Icon type="xiangshang" />
        </div>
      </div>
    </div>
  );
};

export default Menu;
