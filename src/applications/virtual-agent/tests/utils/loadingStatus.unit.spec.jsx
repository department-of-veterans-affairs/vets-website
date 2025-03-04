import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  combineLoadingStatus,
  LOADING,
  ERROR,
  COMPLETE,
} from '../../utils/loadingStatus';

describe('combineLoadingStatus', () => {
  it('should return ERROR if either statusA or statusB is ERROR', () => {
    expect(combineLoadingStatus(ERROR, LOADING)).to.equal(ERROR);
    expect(combineLoadingStatus(LOADING, ERROR)).to.equal(ERROR);
    expect(combineLoadingStatus(ERROR, COMPLETE)).to.equal(ERROR);
  });

  it('should return LOADING if either statusA or statusB is LOADING', () => {
    expect(combineLoadingStatus(LOADING, COMPLETE)).to.equal(LOADING);
    expect(combineLoadingStatus(COMPLETE, LOADING)).to.equal(LOADING);
    expect(combineLoadingStatus(LOADING, LOADING)).to.equal(LOADING);
  });

  it('should return COMPLETE if both statusA and statusB are COMPLETE', () => {
    expect(combineLoadingStatus(COMPLETE, COMPLETE)).to.equal(COMPLETE);
  });

  it('should throw an error for invalid loading status', () => {
    expect(() => combineLoadingStatus('INVALID', COMPLETE)).to.throw(
      'Invalid loading status statusA: INVALID statusB: complete',
    );
    expect(() => combineLoadingStatus(COMPLETE, 'INVALID')).to.throw(
      'Invalid loading status statusA: complete statusB: INVALID',
    );
    expect(() => combineLoadingStatus('INVALID', 'INVALID')).to.throw(
      'Invalid loading status statusA: INVALID statusB: INVALID',
    );
  });
});
