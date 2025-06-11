import { expect } from 'chai';

import {
  canUploadEvidence,
  needsHearingType,
  wantsToUploadEvidence,
  isDirectReview,
} from '../../utils/helpers';

describe('canUploadEvidence', () => {
  it('should return false', () => {
    expect(canUploadEvidence({ boardReviewOption: '' })).to.be.false;
    expect(canUploadEvidence({ boardReviewOption: 'nope' })).to.be.false;
    expect(canUploadEvidence({ boardReviewOption: 'direct_review' })).to.be
      .false;
    expect(canUploadEvidence({ boardReviewOption: 'hearing' })).to.be.false;
  });
  it('should return true', () => {
    expect(canUploadEvidence({ boardReviewOption: 'evidence_submission' })).to
      .be.true;
  });
});

describe('needsHearingType', () => {
  it('should return false', () => {
    expect(needsHearingType({ boardReviewOption: '' })).to.be.false;
    expect(needsHearingType({ boardReviewOption: 'nope' })).to.be.false;
    expect(needsHearingType({ boardReviewOption: 'direct_review' })).to.be
      .false;
    expect(needsHearingType({ boardReviewOption: 'evidence_submission' })).to.be
      .false;
  });
  it('should return true', () => {
    expect(needsHearingType({ boardReviewOption: 'hearing' })).to.be.true;
  });
});

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

describe('isDirectReview', () => {
  it('should return false', () => {
    expect(isDirectReview({ boardReviewOption: '' })).to.be.false;
    expect(isDirectReview({ boardReviewOption: 'nope' })).to.be.false;
    expect(isDirectReview({ boardReviewOption: 'hearing' })).to.be.false;
    expect(isDirectReview({ boardReviewOption: 'evidence_submission' })).to.be
      .false;
  });
  it('should return true', () => {
    expect(isDirectReview({ boardReviewOption: 'direct_review' })).to.be.true;
  });
});
