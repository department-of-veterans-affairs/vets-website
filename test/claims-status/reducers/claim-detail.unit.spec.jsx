import { expect } from 'chai';

import claimDetail from '../../../src/js/claims-status/reducers/claim-detail';
import { SET_CLAIM_DETAIL, GET_CLAIM_DETAIL } from '../../../src/js/claims-status/actions';

describe('Claim detail reducer', () => {
  it('should set detail', () => {
    const claim = {};
    const state = claimDetail(undefined, {
      type: SET_CLAIM_DETAIL,
      claim
    });

    expect(state.detail).to.eql(claim);
    expect(state.loading).to.be.false;
  });
  it('should set loading', () => {
    const state = claimDetail(undefined, {
      type: GET_CLAIM_DETAIL
    });

    expect(state.loading).to.be.true;
  });
});
