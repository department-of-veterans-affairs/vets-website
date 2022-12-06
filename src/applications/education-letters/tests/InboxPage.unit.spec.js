import React from 'react';
import { expect } from 'chai';
import InboxPage from '../containers/InboxPage';
import { TOEClaimStatus, MEBClaimStatus } from './fixtures/claimStatus.json';

describe('Render MEB or TOE claim status', () => {
  const initialState = {
    TOEClaimStatus,
    MEBClaimStatus,
    claimStatus: {
      ...MEBClaimStatus,
    },
    getClaimStatus: () => {},
    user: { login: { currentlyLoggedIn: true } },
    MEBClaimStatusFetchInProgress: false,
    MEBClaimStatusFetchComplete: true,
    TOEClaimStatusFetchInProgress: false,
    TOEClaimStatusFetchComplete: true,
  };

  it('renders the letter depending on claim status', async () => {
    expect(<InboxPage {...initialState} />);
  });
});
