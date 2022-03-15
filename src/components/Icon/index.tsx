import React, { ReactElement } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/font_2631144_9q1g6usomwu.js'],
});

export default ({ type, ...props }: { type: string, [propName: string]: any }): ReactElement => <IconFont type={`icon-${type}`} {...props} />;
