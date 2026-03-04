import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { ClaimPage } from '../../containers/ClaimPage';
import { renderWithReduxAndRouter } from '../utils';

const params = { id: 1 };

const props = {
  clearClaim: () => {},
  params,
};

const featureToggleName = 'cst_multi_claim_provider';

const initialState = {
  featureToggles: {
    loading: false,
    [featureToggleName]: false,
  },
};

describe('<ClaimPage>', () => {
  it('calls getClaim when it is rendered', () => {
    // Reset sinon spies / set up props
    props.getClaim = sinon.spy();

    renderWithReduxAndRouter(
      <ClaimPage {...props}>
        <div />
      </ClaimPage>,
      { initialState },
    );

    expect(props.getClaim.called).to.be.true;
  });

  it('calls clearClaim when it unmounts', () => {
    props.clearClaim = sinon.spy();

    const { unmount } = renderWithReduxAndRouter(
      <ClaimPage {...props}>
        <div />
      </ClaimPage>,
      { initialState },
    );

    unmount();
    expect(props.clearClaim.called).to.be.true;
  });
});
