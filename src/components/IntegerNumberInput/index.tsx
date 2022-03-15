import React, { FC, useContext } from 'react';
import { InputNumber } from 'antd';
import { GlobalContext } from '@/index';
import cs from 'classnames';

interface IIntegerNumberInputProps {
  onChange: (value: number) => void;
  className?: string;
  [propName: string]: any;
  value: string;
}

const IntegerNumberInput: FC<IIntegerNumberInputProps> = ({ onChange, className, value, ...restProps }) => {
  const { prefixCls } = useContext(GlobalContext);
  return (
    <InputNumber
      { ...restProps }
      className={cs(`${prefixCls}-head-input`, className)}
      min={1}
      precision={0}
      value={value}
      onBlur={({ target: { value } }) => {
        if (value) {
          onChange(parseInt(value, 10))
        }
      }}
    />
  );
}

export default IntegerNumberInput;
