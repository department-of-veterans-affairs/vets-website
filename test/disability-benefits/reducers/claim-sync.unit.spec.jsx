import { expect } from 'chai';

import claimSync from '../../../src/js/disability-benefits/reducers/claim-sync';
import { SET_CLAIMS, SET_CLAIM_DETAIL, SET_UNAVAILABLE } from '../../../src/js/disability-benefits/actions';

describe('Claim sync reducer', () => {
  it('should set unavailable', () => {
    const state = claimSync(undefined, {
      type: SET_UNAVAILABLE
    });

    expect(state.available).to.be.false;
  });

  it('should set out of sync', () => {
    const state = claimSync(undefined, {
      type: SET_CLAIM_DETAIL,
      claim: {
        attributes: {
          updatedAt: 'test',
          successfulSync: false
        }
      }
    });

    expect(state.synced).to.be.false;
    expect(state.syncedDate).to.equal('test');
    expect(state.available).to.true;
  });

  it('should set out of sync on list request', () => {
    const state = claimSync(undefined, {
      type: SET_CLAIMS,
      claims: [
        {
          attributes: {
            successfulSync: false,
            updatedAt: 'test'
          }
        }
      ]
    });

    expect(state.synced).to.be.false;
    expect(state.syncedDate).to.equal('test');
    expect(state.available).to.true;
  });
});
