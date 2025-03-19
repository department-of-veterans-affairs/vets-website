import { expect } from 'chai';

import {
  MEB_FETCH_CLAIM_STATUS,
  MEB_FETCH_CLAIM_STATUS_SUCCESS,
  MEB_FETCH_CLAIM_STATUS_FAILED,
  TOE_FETCH_CLAIM_STATUS_SUCCESS,
  TOE_FETCH_CLAIM_STATUS_FAILED,
  TOE_FETCH_CLAIM_STATUS,
} from '../../actions';

import reducer from '../../reducers/index';

const eligible = {
  response: {
    data: {
      attributes: {
        claimStatus: {
          claimStatus: 'ELIGIBLE',
        },
      },
    },
  },
};

const denied = {
  response: {
    data: {
      attributes: {
        claimStatus: {
          claimStatus: 'DENIED',
        },
      },
    },
  },
};

describe('MEB: Fetching claim status api', () => {
  it('should wait and fetch a MEB claim status api', () => {
    const state = reducer.data(undefined, { type: MEB_FETCH_CLAIM_STATUS });
    expect(state.MEBClaimStatusFetchInProgress).to.be.true;
  });

  it('should fetch a successful MEB claim status api', () => {
    const mockAction = {
      type: MEB_FETCH_CLAIM_STATUS_SUCCESS,
      ...eligible,
    };
    const state = reducer.data(undefined, mockAction);
    expect(state.MEBClaimStatus.claimStatus.claimStatus).to.eq('ELIGIBLE');
    expect(state.MEBClaimStatus.claimStatus.claimStatus).to.not.eq('DENIED');
    expect(state.MEBClaimStatusFetchInProgress).to.be.false;
    expect(state.MEBClaimStatusFetchComplete).to.be.true;
  });

  it('should load a failed MEB claim status api', () => {
    const mockAction = {
      type: MEB_FETCH_CLAIM_STATUS_FAILED,
      ...denied,
    };
    const state = reducer.data(undefined, mockAction);
    expect(state.MEBClaimStatus.claimStatus.claimStatus).to.eq('DENIED');
    expect(state.MEBClaimStatus.claimStatus.claimStatus).to.not.eq('ELIGIBLE');
    expect(state.MEBClaimStatusFetchInProgress).to.be.false;
    expect(state.MEBClaimStatusFetchComplete).to.be.true;
  });
});

describe('TOE: Fetching claim status api', () => {
  it('should wait and fetch a TOE claim status api', () => {
    const state = reducer.data(undefined, { type: TOE_FETCH_CLAIM_STATUS });
    expect(state.TOEClaimStatusFetchInProgress).to.be.true;
  });

  it('should fetch a successful TOE claim status api', () => {
    const mockAction = {
      type: TOE_FETCH_CLAIM_STATUS_SUCCESS,
      ...eligible,
    };
    const state = reducer.data(undefined, mockAction);
    expect(state.TOEClaimStatus.claimStatus.claimStatus).to.eq('ELIGIBLE');
    expect(state.TOEClaimStatus.claimStatus.claimStatus).to.not.eq('DENIED');
    expect(state.TOEClaimStatusFetchInProgress).to.be.false;
    expect(state.TOEClaimStatusFetchComplete).to.be.true;
  });

  it('should load a failed TOE claim status api', () => {
    const mockAction = {
      type: TOE_FETCH_CLAIM_STATUS_FAILED,
      ...denied,
    };
    const state = reducer.data(undefined, mockAction);
    expect(state.TOEClaimStatus.claimStatus.claimStatus).to.eq('DENIED');
    expect(state.TOEClaimStatus.claimStatus.claimStatus).to.not.eq('ELIGIBLE');
    expect(state.TOEClaimStatusFetchInProgress).to.be.false;
    expect(state.TOEClaimStatusFetchComplete).to.be.true;
  });
});
