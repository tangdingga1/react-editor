import React from 'react';
import { Button } from 'antd';
import './index.less';
import { CustomMenuRenderProps, ComponentProps, ComponentConfigerProps } from '@/interface';

const SRC = 'https://img.alicdn.com/imgextra/i4/373575809/O1CN01LEtaD41smZSSo2xKO_!!373575809-2-isvtu.png';

const ImageComponent: FC<ComponentProps> = ({ data }) => {
  const { width, height, left, top, src } = data;
  return (
    <img
      style={{ width, height, left, top }}
      src={src}
      draggable={false}
    />
  );
}

const ImageConfiger: FC<ComponentConfigerProps> = ({ data, $$onChange }) => {
  return <div />
};

class Image extends React.Component<CustomMenuRenderProps, {}> {
  onUpload = () => {
    const { onAddComponent } = this.props;
    onAddComponent({
      name: '图片',
      defaultData: { width: 200, height: 200, src: SRC },
      Component: ImageComponent,
      Configer: ImageConfiger,
    });
  };

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '24px 0' }}>
        <Button style={{ width: 200, height: 40 }} onClick={this.onUpload}>本地上传</Button>
      </div>
    );
  }
}

export default {
  title: '上传',
  iconType: 'wenjianshangchuan-fill',
  render: (props: CustomMenuRenderProps) =>  <Image {...props} />,
}
