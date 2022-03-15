import { CustomMenuItem, TMenuItem } from '@/interface';
import './index.less';
import Word from './word';
import Image from './image';
import WatermarkPrice from './watermarkPrice';


export const DEFAULT_MAP = {
  word: Word,
  image: Image,
  price: WatermarkPrice,
};


export function mergeMenusWithDefaultSpecs(menus: TMenuItem[]): any[] {
  return menus.map(menu => {
    const { type } = menu as { [propName: string]: any };
    if (type) {
      return DEFAULT_MAP[type];
    }
    return menu;
  });
}
