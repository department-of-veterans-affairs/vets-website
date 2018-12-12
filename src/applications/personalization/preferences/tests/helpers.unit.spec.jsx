import { expect } from 'chai';

import { deduplicate } from '../helpers';

describe('deduplicate', () => {
  it('should return a list of unique items', () => {
    const uniques = deduplicate([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
    expect(uniques).to.have.members([1, 2, 3, 4, 5]);
    expect(uniques.length).to.equal(5);
  });
});
