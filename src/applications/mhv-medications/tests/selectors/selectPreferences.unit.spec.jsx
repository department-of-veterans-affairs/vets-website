import { expect } from 'chai';

// JavaScript
import {
  selectSortOption,
  selectFilterOption,
  selectPageNumber,
  selectFilterOpenByDefault,
} from '../../selectors/selectPreferences';

describe('mhv-medications selectors: selectPreferences', () => {
  const mockState = {
    rx: {
      preferences: {
        sortOption: 'alphabeticallyByStatus',
        filterOption: 'active',
        pageNumber: 2,
        filterOpenByDefault: true,
      },
    },
  };

  it('selectSortOption returns correct value', () => {
    expect(selectSortOption(mockState)).to.equal('alphabeticallyByStatus');
  });

  it('selectFilterOption returns correct value', () => {
    expect(selectFilterOption(mockState)).to.equal('active');
  });

  it('selectPageNumber returns correct value', () => {
    expect(selectPageNumber(mockState)).to.equal(2);
  });

  it('selectFilterOpenByDefault returns correct value', () => {
    expect(selectFilterOpenByDefault(mockState)).to.equal(true);
  });
});
