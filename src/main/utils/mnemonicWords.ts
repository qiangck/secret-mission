import cnchar from 'cnchar';
import cncharIdiom from 'cnchar-idiom';

cnchar.use(cncharIdiom);

export default class CreateMnemonicWords {
  count: number;

  constructor(count?: number) {
    this.count = count || 3;
  }

  private getIdiom(strCountArr: number[]) {
    const data = cnchar.idiom(strCountArr, 'stroke') || [];
    // 只要四字成语
    return data.filter((str) => str.length === 4);
  }

  private randomConut() {
    return Math.round(Math.random() * 5) + 1;
  }

  create(arr?: any[]): any[] {
    if (!Array.isArray(arr)) arr = [];

    if (arr.length < this.count) {
      const arrCount = [
        this.randomConut(),
        this.randomConut(),
        this.randomConut(),
        this.randomConut(),
      ];

      const idiom = this.getIdiom(arrCount);

      return this.create(arr.concat(idiom));
    } else {
      return arr.slice(0, this.count);
    }
  }
}
