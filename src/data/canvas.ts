import { useState } from 'react';
import { CanvasData, TCanvasContext } from '@/interface';
import historyStack from './historyStack';
import { initCanvasData } from '@/constant';

function updateCanvasData(data: Object) {
  const { canvas } = historyStack.updateHistory({
    type: 'UPDATE',
    updateType: 'canvas',
    data: data,
  });
  return canvas;
}

export const useCanvas = function (): TCanvasContext {
  const [canvas, setCanvas] = useState<CanvasData>(initCanvasData);
  return {
    canvas,

    setCanvas,

    setCanvasWithRecord(canvas) {
      setCanvas(updateCanvasData(canvas));
    },
  };
};
