import { expect } from 'chai';
import { findNextPage } from '../pages/disagreeing';

import { pageNames } from '../pages/pageList';

describe('Disability compensation wizard -- Disagreeing page', () => {
  // This test should fail on Feb 19, 2020
  // When it does, we can remove the fileAppeal page and the associated option on the disagreeing page
  it('should return fileAppeal if the decision date was less than a year ago, but after Feb 19, 2019', () => {
    const date = {
      day: { value: '18' },
      month: { value: '2' },
      year: { value: '2019' },
    };

    expect(findNextPage(date)).to.equal(pageNames.fileAppeal);
  });
});
