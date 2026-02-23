import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as featureToggles from '~/platform/utilities/feature-toggles';

import { ClaimPage } from '../../containers/ClaimPage';
import { renderWithRouter } from '../utils';

const params = { id: 1 };

const props = {
  clearClaim: () => {},
  params,
};

describe('<ClaimPage>', () => {
  let useFeatureToggleStub;

  before(() => {
    useFeatureToggleStub = sinon
      .stub(featureToggles, 'useFeatureToggle')
      .returns({
        TOGGLE_NAMES: { cstMultiClaimProvider: 'cst_multi_claim_provider' },
        useToggleValue: sinon.stub().returns(false),
      });
  });

  after(() => {
    useFeatureToggleStub.restore();
  });

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
