import { expect } from 'chai';

import findDuplicateIndexes from 'platform/forms-system/src/js/utilities/data/findDuplicateIndexes';

describe('duplicateIndexes', () => {
  const base = [{ x: 'one' }, { x: 'two' }, { x: 'three' }];
  it('should not find duplicates', () => {
    expect(findDuplicateIndexes(base, 'x')).to.have.lengthOf(0);
  });
  it('should not throw up when a field is empty', () => {
    const array = [...base, {}];
    expect(findDuplicateIndexes(array, 'x')).to.have.lengthOf(0);
  });
  it('should find one duplicate', () => {
    const array = [...base, { x: 'one' }];
    expect(findDuplicateIndexes(array, 'x')).to.deep.equal([3]);
  });
  it('should find two duplicates', () => {
    const array = [...base, { x: 'one' }, { x: 'one' }];
    expect(findDuplicateIndexes(array, 'x')).to.deep.equal([3, 4]);
  });
  it('should find two separate duplicates', () => {
    const array = [...base, { x: 'one' }, { x: 'two' }];
    expect(findDuplicateIndexes(array, 'x')).to.deep.equal([3, 4]);
  });
  it('should find three separate duplicates', () => {
    const array = [...base, { x: 'one' }, { x: 'two' }, { x: 'three' }];
    expect(findDuplicateIndexes(array, 'x')).to.deep.equal([3, 4, 5]);
  });
  it('should find three separate case-insensitive duplicates', () => {
    const array = [...base, { x: 'One' }, { x: 'tWo' }, { x: 'thREe' }];
    expect(findDuplicateIndexes(array, 'x')).to.deep.equal([3, 4, 5]);
  });
});
