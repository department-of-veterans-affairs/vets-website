import { expect } from 'chai';

import readableList from '../../../src/js/utilities/data/readableList';

describe('readableList', () => {
  it('should return an empty string', () => {
    expect(readableList([])).to.eq('');
    expect(readableList(['', null, 0])).to.eq('');
  });
  it('should return a combined list with commas with "and" for the last item', () => {
    expect(readableList(['one'])).to.eq('one');
    expect(readableList(['', 'one', null])).to.eq('one');
    expect(readableList(['one', 'two'])).to.eq('one and two');
    expect(readableList([1, 2, 'three'])).to.eq('1, 2, and three');
    expect(readableList(['v', null, 'w', 'x', '', 'y', 'z'])).to.eq(
      'v, w, x, y, and z',
    );
    it('should return a combined list with commas with different joiners for the last item', () => {
      expect(readableList(['v', null, 'w', 'x', '', 'y', 'z'], 'or')).to.eq(
        'v, w, x, y, or z',
      );
    });
  });
});
