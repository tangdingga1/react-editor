import React, { FC, CSSProperties, FunctionComponent, ComponentClass } from 'react';
import { useDrag } from 'react-dnd';
import { SPEC_TYPE_NAME } from '@/constant';
import { ComponentSpecWarperProps } from '@/interface';

const specWarperStyle: CSSProperties = {
  cursor: 'pointer',
};

export const DragSpecWarper: FC<ComponentSpecWarperProps> = ({ children, ...props }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    item: { type: SPEC_TYPE_NAME, ...props, },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));
  return (
    <div ref={drag} style={specWarperStyle}>
      <div>{children}</div>
    </div>
  );
};
