import { expect } from 'chai';

import reviewErrors from '../../content/reviewErrors';
import { errorMessages } from '../../content/areaOfDisagreement';

describe('reviewErrors override', () => {
  const override = reviewErrors._override;
  it('should return null', () => {
    expect(override('')).to.be.null;
    expect(override('random')).to.be.null;
    expect(override('3')).to.be.null;
    expect(override('1', 'foo')).to.be.null;
  });
  it('should return contact info keys', () => {
    expect(override('veteran')).to.be.deep.equal({
      chapterKey: 'infoPages',
      pageKey: 'confirmContactInfo',
    });
  });
  it('should return area of disagreement page', () => {
    const error = { __errors: [errorMessages.missingDisagreement] };
    expect(override('0', error)).to.be.deep.equal({
      chapterKey: 'conditions',
      pageKey: 'areaOfDisagreementFollowUp0',
    });
    expect(override('11', error)).to.be.deep.equal({
      chapterKey: 'conditions',
      pageKey: 'areaOfDisagreementFollowUp11',
    });
  });
});
