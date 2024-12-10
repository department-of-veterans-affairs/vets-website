export const arrayBuilderOptions = {
  arrayPath: 'childrenToAdd',
  nounSingular: 'child',
  nounPlural: 'children',
  required: true,
  isItemComplete: _item => {
    return true;
  },
  maxItems: 10,
  text: {
    getItemName: _item => {
      return 'Item name';
    },
    cardDescription: _item => {
      return 'Card Desc';
    },
  },
};
