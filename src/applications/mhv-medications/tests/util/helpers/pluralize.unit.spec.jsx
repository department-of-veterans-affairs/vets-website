import { expect } from 'chai';
import pluralize from '../../../util/helpers/pluralize';

describe('pluralize', () => {
  it('should return singular form when count is 1', () => {
    expect(pluralize(1, 'medication', 'medications')).to.eq('medication');
  });

  it('should return plural form when count is 0', () => {
    expect(pluralize(0, 'medication', 'medications')).to.eq('medications');
  });

  it('should return plural form when count is greater than 1', () => {
    expect(pluralize(2, 'medication', 'medications')).to.eq('medications');
    expect(pluralize(10, 'item', 'items')).to.eq('items');
  });

  it('should handle phrase variations', () => {
    expect(pluralize(1, 'this medication', 'these medications')).to.eq(
      'this medication',
    );
    expect(pluralize(5, 'this medication', 'these medications')).to.eq(
      'these medications',
    );
  });
});
