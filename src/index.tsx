import React, { FC, createContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { TMenuItem, GlobalData, TCanvasContext, DataCoreContext } from '@/interface';
import { useCanvas, useDataCore } from '@/data';

import HeadTool from '@/headTool';
import Menu from '@/menu';
import Canvas from '@/canvas';
import Configer from '@/configer';

import './index.less';

export interface IEditorProps {
  menu?: TMenuItem[];
  prefixCls?: string;
}

export const GlobalContext = createContext<GlobalData>({ prefixCls: 'dx-editor' });
export const DSLContext = createContext<DataCoreContext>({} as any);
export const CanvasContext = createContext<TCanvasContext>({} as any);

const Editor: FC<IEditorProps> = ({ prefixCls = 'dx-editor', menu }) => {
  const canvasData = useCanvas();
  const dataCoreData = useDataCore();
  const GlobalData = { prefixCls };
  return (
    <GlobalContext.Provider value={GlobalData}>
      <DSLContext.Provider value={dataCoreData}>
          <div className={`${prefixCls}-editor`}>
            <CanvasContext.Provider value={canvasData}>
              <HeadTool />
            </CanvasContext.Provider>
            <DndProvider backend={HTML5Backend}>
              <div className={`${prefixCls}-editor-body`}>
                <CanvasContext.Provider value={canvasData}>
                  <Menu menu={menu} />
                  <Canvas />
                </CanvasContext.Provider>
                <Configer />
              </div>
            </DndProvider>
          </div>
      </DSLContext.Provider>
    </GlobalContext.Provider>
  );
};

export default Editor;
