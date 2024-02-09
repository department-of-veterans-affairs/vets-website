import { expect } from 'chai';

import reviewErrors from '../../content/reviewErrors';
import { PRIMARY_PHONE } from '../../constants';

describe('reviewErrors override', () => {
  const override = reviewErrors._override;
  it('should return null', () => {
    expect(override()).to.be.null;
    expect(override('')).to.be.null;
    expect(override('random')).to.be.null;
    expect(override('3')).to.be.null;
    expect(override('1', 'foo')).to.be.null;
  });

  // Shifts VA & Private evidence errors to the summary page
  it('should return evidence summary page keys', () => {
    expect(override('locations[0]')).to.be.deep.equal({
      chapterKey: 'evidence',
      pageKey: 'evidenceSummary',
    });
    expect(override('locations[2]')).to.be.deep.equal({
      chapterKey: 'evidence',
      pageKey: 'evidenceSummary',
    });
    expect(override('providerFacility[')).to.be.deep.equal({
      chapterKey: 'evidence',
      pageKey: 'evidenceSummary',
    });
  });

  it('should return contact info keys for contact info pages', () => {
    expect(override('veteran')).to.be.deep.equal({
      chapterKey: 'infoPages',
      pageKey: 'confirmContactInfo',
    });
  });

  it('should return contact info keys for primary phone question', () => {
    expect(override(PRIMARY_PHONE)).to.be.deep.equal({
      chapterKey: 'infoPages',
      pageKey: 'confirmContactInfo',
    });
  });
});
