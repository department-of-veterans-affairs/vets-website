import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as reactRouterDom from 'react-router-dom-v5-compat';
import * as featureToggles from '~/platform/utilities/feature-toggles';

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

  describe('multi-provider functionality', () => {
    let useSearchParamsStub;
    let useFeatureToggleStub;
    let mockSearchParams;

    beforeEach(() => {
      mockSearchParams = {
        get: sinon.stub(),
      };
      useSearchParamsStub = sinon
        .stub(reactRouterDom, 'useSearchParams')
        .returns([mockSearchParams]);
    });

    afterEach(() => {
      useSearchParamsStub.restore();
      if (useFeatureToggleStub) {
        useFeatureToggleStub.restore();
      }
    });

    it('passes provider to getClaim when flag enabled and type param exists', () => {
      mockSearchParams.get.withArgs('type').returns('lighthouse');
      useFeatureToggleStub = sinon
        .stub(featureToggles, 'useFeatureToggle')
        .returns({
          TOGGLE_NAMES: { cstMultiClaimProvider: 'cst_multi_claim_provider' },
          useToggleValue: sinon.stub().returns(true),
        });

      props.getClaim = sinon.spy();

      renderWithRouter(
        <ClaimPage {...props}>
          <div />
        </ClaimPage>,
      );

      expect(props.getClaim.calledWith(1, sinon.match.any, 'lighthouse')).to.be
        .true;
    });

    it('does not pass provider to getClaim when flag disabled', () => {
      mockSearchParams.get.withArgs('type').returns('lighthouse');
      useFeatureToggleStub = sinon
        .stub(featureToggles, 'useFeatureToggle')
        .returns({
          TOGGLE_NAMES: { cstMultiClaimProvider: 'cst_multi_claim_provider' },
          useToggleValue: sinon.stub().returns(false),
        });

      props.getClaim = sinon.spy();

      renderWithRouter(
        <ClaimPage {...props}>
          <div />
        </ClaimPage>,
      );

      expect(props.getClaim.calledWith(1, sinon.match.any, null)).to.be.true;
    });

    it('passes null provider when no type param in URL', () => {
      mockSearchParams.get.withArgs('type').returns(null);
      useFeatureToggleStub = sinon
        .stub(featureToggles, 'useFeatureToggle')
        .returns({
          TOGGLE_NAMES: { cstMultiClaimProvider: 'cst_multi_claim_provider' },
          useToggleValue: sinon.stub().returns(true),
        });

      props.getClaim = sinon.spy();

      renderWithRouter(
        <ClaimPage {...props}>
          <div />
        </ClaimPage>,
      );

      expect(props.getClaim.calledWith(1, sinon.match.any, null)).to.be.true;
    });
  });
});
