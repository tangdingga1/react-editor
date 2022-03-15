import { CanvasData, SpecData, DataCoreData } from '@/interface';


const MOCK_MAJOR = {
  "algoType": "majorobject",
  "contentEditAble": true,
  "deleteAble": false,
  "dynamic": false,
  "filters": [],
  "forceEdit": false,
  "height": 800,
  "id": "566",
  "image": "http://img.alicdn.com/imgextra/i1/263664947/O1CN01lZkC0y1g3Qq4aOvkf_!!2248624086-0-selfsupportshop.jpg",
  "index": 1,
  "kind": "submajorobject",
  "layerType": "image",
  "linkId": "0",
  "name": "普通主体-majorobject|submajorobject--商品主图-请替换图片-800x800",
  "opacity": 1,
  "originHeight": 800,
  "originImage": "http://img.alicdn.com/imgextra/i1/263664947/O1CN01lZkC0y1g3Qq4aOvkf_!!2248624086-0-selfsupportshop.jpg",
  "originWidth": 800,
  "protection": false,
  "rotate": 0,
  "styleEditAble": true,
  "topLayer": false,
  "type": 1,
  "visible": true,
  "width": 800,
  "x": 0,
  "xEditable": true,
  "y": 0,
  "yEditable": true,
  "zEditable": false
};

type ToAliDslData = {
  canvas: CanvasData;
  layer: SpecData[];
}

// 数据类型参考 https://www.yuque.com/docs/share/4595f3c3-1183-468c-afb1-5f43d1875490
interface AliDsl extends AliCanvas {
  layers: Layers[];
}

type AliFillType = {
  type: 'none' | 'color' | 'image' | 'gradient';
  // #ffffff
  color?: string;
  // image url
  image?: string;
  // for image or gradient
  opacity?: number;

  // for gradient
  angle?: number;
  colors?: { color: string; opacity: number; percent: number }[];
  gradientType?: 'linear' | 'radial';
}

type AliCanvas = {
  width: number;
  height: number;
  v: string;
  fill?: AliFillType;
}

// 图层类型说明 https://www.yuque.com/docs/share/134f0310-12df-4775-95ab-4ded4046fd58
type Layers = {
  // common
  algoType: 'decoration' | 'background' | 'identlogo' | 'dynamiccharacter' | 'price' | 'majorobject';
  layerType: 'image' | 'text';
  width: number;
  height: number;
  x: number;
  y: number;
  index: number;
  rotate?: number;

  // text layer
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'bold' | 'normal';
  fontStyle?: 'italic' | 'normal';
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: 'linethrough' | 'underline';
  textType?: 'fixed' | 'auto';
  fill?: AliFillType;
}

function parseCanvas(canvas: CanvasData): AliCanvas {
  const { width, height, backgroundColor, backgroundImage } = canvas;
  const result: AliCanvas = {
    v: '2.0.3',
    width,
    height,
  };

  if (backgroundColor) {
    result.fill = {
      type: 'color',
      color: backgroundColor,
    };
  }

  if (backgroundImage) {
    result.fill = {
      type: 'image',
      image: backgroundImage,
    };
  }

  return result;
}

const textDecorationMap = {
  'line-through': 'linethrough',
  'underline': 'underline',
}

function parseTextLayer(textLayer: DataCoreData, index: number): Layers {
  const result: Layers = {
    ...textLayer,
    index,
    layerType: 'text',
    algoType: 'dynamiccharacter',
    x: textLayer.left,
    y: textLayer.top,
    // 阿里处默认 lineHeight 为 int 型，自带 px
    lineHeight: parseInt(textLayer.lineHeight, 10),
    textDecoration: textDecorationMap[textLayer.textDecorationLine],
  };

  if (textLayer.color) {
    result.fill = {
      type: 'color',
      color: textLayer.color,
    };
  }
  return result;
}

function parseLayers(layer: SpecData[]): Layers[] {
  return layer.map((item, index) => {
    const { data } = item;
    const { text, image } = data;
    if (text) {
      return parseTextLayer(data, index + 2);
    }
    if (image) {
      return data;
    }
  });
}

// 编辑器数据结构解析成阿里接口数据结构
export default function toAliDsl(data: ToAliDslData): AliDsl {
  const { canvas, layer } = data;
  const result = {
    ...parseCanvas(canvas),
    layers: [MOCK_MAJOR, ...parseLayers(layer)],
  };
  console.log(JSON.stringify(result))
  return result;
}
