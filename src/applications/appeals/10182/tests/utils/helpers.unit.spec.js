import { expect } from 'chai';

import { wantsToUploadEvidence } from '../../utils/helpers';

describe('wantsToUploadEvidence', () => {
  it('should return falsy value', () => {
    expect(wantsToUploadEvidence({})).to.be.false;
    expect(wantsToUploadEvidence({ boardReviewOption: 'evidence_submission' }))
      .to.be.undefined;
    expect(wantsToUploadEvidence({ 'view:additionalEvidence': true })).to.be
      .false;
    expect(
      wantsToUploadEvidence({
        boardReviewOption: 'evidence_submission',
        'view:additionalEvidence': false,
      }),
    ).to.be.false;
    expect(
      wantsToUploadEvidence({
        boardReviewOption: 'evidence_subs',
        'view:additionalEvidence': true,
      }),
    ).to.be.false;
  });
  it('should return true', () => {
    expect(
      wantsToUploadEvidence({
        boardReviewOption: 'evidence_submission',
        'view:additionalEvidence': true,
      }),
    ).to.be.true;
  });
});
