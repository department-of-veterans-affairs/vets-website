import { expect } from 'chai';

import claimDetail from '../../reducers/claim-detail';
import {
  SET_CLAIM_DETAIL,
  GET_CLAIM_DETAIL,
  CLEAR_CLAIM_DETAIL,
} from '../../actions/types';

describe('Claim detail reducer', () => {
  it('should set detail', () => {
    const claim = {};
    const state = claimDetail(undefined, {
      type: SET_CLAIM_DETAIL,
      claim,
    });

    expect(state.detail).to.eql(claim);
    expect(state.loading).to.be.false;
  });
  it('should clear detail', () => {
    const state = claimDetail(
      { detail: 'test', loading: false },
      { type: CLEAR_CLAIM_DETAIL },
    );
    expect(state.detail).to.eql(null);
    expect(state.loading).to.eql(true);
  });
  it('should set loading', () => {
    const state = claimDetail(undefined, {
      type: GET_CLAIM_DETAIL,
    });

    expect(state.loading).to.be.true;
  });
});
