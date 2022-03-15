import React, { FC } from 'react';
import { Select } from 'antd';

const { Option } = Select;


interface INumberPickerProps {
  min: number;
  max: number;
  step?: number;
  [selectProps: string]: any;
}

function renderOptions(min: number, max: number, step: number) {
  if (min > max) {
    return [];
  }

  const listLength = ((max - min) / step) | 0;

  if (listLength < 0) {
    return [];
  }

  const result = [];
  let idx = 0;
  while(idx <= listLength) {
    result.push(
      idx === listLength ?
        max
        :
        min + step * idx
    );
    idx++;
  }

  return result.map(val => <Option key={val} value={val}>{val}</Option>)
}

const NumberPicker: FC<INumberPickerProps> = ({ min, max, step = 1, ...selectProps }) => {
  return (
    <Select {...selectProps}>{renderOptions(min, max, step)}</Select>
  );
}

export default NumberPicker;
