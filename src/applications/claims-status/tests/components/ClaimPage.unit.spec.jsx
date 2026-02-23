import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { ClaimPage } from '../../containers/ClaimPage';
import { renderWithRouter } from '../utils';

const params = { id: 1 };

const props = {
  clearClaim: () => {},
  params,
};

describe('<ClaimPage>', () => {
  it('calls getClaim when it is rendered', () => {
    // Reset sinon spies / set up props
    props.getClaim = sinon.spy();

    renderWithRouter(
      <ClaimPage {...props}>
        <div />
      </ClaimPage>,
    );

    expect(props.getClaim.called).to.be.true;
  });

  it('calls clearClaim when it unmounts', () => {
    props.clearClaim = sinon.spy();

    const { unmount } = renderWithRouter(
      <ClaimPage {...props}>
        <div />
      </ClaimPage>,
    );

    unmount();
    expect(props.clearClaim.called).to.be.true;
  });
});
