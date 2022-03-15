import React from 'react';
import ReactDOM from 'react-dom';

// for lib
import Editor, { IEditorProps } from './index';

export default Editor;

// 外部引入 react 版本不相同或者不存在 react 时，需要使用这种形式来进行编辑器渲染
export function createEditor(container: Element) {
  return {
    render(props: IEditorProps) {
      ReactDOM.render(<Editor {...props} />, container);
    },
    unmount() {
      ReactDOM.unmountComponentAtNode(container);
    },
  };
}

export { DragSpecWarper } from '@/components/DragSpecWarper';
export type { ComponentSpecWarperProps } from '@/interface';
