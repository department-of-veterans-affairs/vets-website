import { expect } from 'chai';
import { generateFilterAndSortText } from '../../../util/helpers';
import {
  ALL_MEDICATIONS_FILTER_KEY,
  ACTIVE_FILTER_KEY,
  RECENTLY_REQUESTED_FILTER_KEY,
  RENEWAL_FILTER_KEY,
  NON_ACTIVE_FILTER_KEY,
  filterOptions,
  rxListSortingOptions,
} from '../../../util/constants';

describe('generateFilterAndSortText', () => {
  const defaultSortKey = 'alphabeticallyByStatus';
  const sortLabelLower = rxListSortingOptions[
    defaultSortKey
  ].LABEL.toLowerCase();

  const filterKeys = [
    ALL_MEDICATIONS_FILTER_KEY,
    ACTIVE_FILTER_KEY,
    RECENTLY_REQUESTED_FILTER_KEY,
    RENEWAL_FILTER_KEY,
    NON_ACTIVE_FILTER_KEY,
  ];

  it('should return correct text for each filter key when isFullList is false', () => {
    filterKeys.forEach(filterKey => {
      const isAllMeds = filterKey === ALL_MEDICATIONS_FILTER_KEY;
      const filterDisplay = filterOptions[filterKey]?.showingContentDisplayName;
      const expectedText = isAllMeds
        ? `medications, ${sortLabelLower}`
        : `${filterDisplay} medications, ${sortLabelLower}`;

      const result = generateFilterAndSortText(filterKey, defaultSortKey);
      expect(result).to.equal(expectedText);
    });
  });

  it('should return "medications" for all filter keys when isFullList is true', () => {
    filterKeys.forEach(filterKey => {
      const result = generateFilterAndSortText(filterKey, defaultSortKey, true);
      expect(result).to.equal(`medications, ${sortLabelLower}`);
    });
  });

  it('should return correct text for different sort options', () => {
    const sortKeys = ['lastFilledFirst', 'alphabeticalOrder'];

    sortKeys.forEach(sortKey => {
      const sortLabel = rxListSortingOptions[sortKey].LABEL.toLowerCase();
      const filterDisplay =
        filterOptions[ACTIVE_FILTER_KEY].showingContentDisplayName;
      const result = generateFilterAndSortText(ACTIVE_FILTER_KEY, sortKey);
      expect(result).to.equal(`${filterDisplay} medications, ${sortLabel}`);
    });
  });
});
