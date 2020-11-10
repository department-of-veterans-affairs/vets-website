import liquid from 'tinyliquid';
import { expect } from 'chai';

import registerFilters from './liquid';

registerFilters();

describe('isLaterThan', () => {
  it('returns true when the left arg is a timestamp later than the right arg', () => {
    expect(liquid.filters.isLaterThan('2020-01-11', '2016-07-10')).to.be.true;
  });

  it('returns false when the left arg is a timestamp before the right arg', () => {
    expect(liquid.filters.isLaterThan('2016-12-11', '2017-01-12')).to.be.false;
  });
});

// TODO: figure out how to get this working!
describe.skip('timezoneAbbrev', () => {
  it('returns PST for Los Angeles', () => {
    expect(
      liquid.filters.timezoneAbbrev('America/Los_Angeles', '2020-11-11'),
    ).to.eq('PST');
  });

  it('returns ET for null', () => {
    expect(liquid.filters.timezoneAbbrev()).to.eq('ET');
  });
});
