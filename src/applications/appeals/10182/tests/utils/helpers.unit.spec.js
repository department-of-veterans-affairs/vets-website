import { expect } from 'chai';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import {
  wantsToUploadEvidence,
  noticeOfDisagreementFeature,
} from '../../utils/helpers';

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

describe('noticeOfDisagreementFeature', () => {
  it('should return undefined', () => {
    expect(noticeOfDisagreementFeature({})).to.be.undefined;
  });
  it('should return true', () => {
    const state = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.form10182Nod]: true,
      },
    };
    expect(noticeOfDisagreementFeature(state)).to.be.true;
  });
});
