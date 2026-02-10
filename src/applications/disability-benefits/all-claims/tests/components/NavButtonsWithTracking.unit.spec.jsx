import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import * as datadogRumTracking from '../../utils/tracking/datadogRumTracking';
import { createNavButtonsWithTracking } from '../../components/NavButtonsWithTracking';

describe('NavButtonsWithTracking', () => {
  const trackingContext = {
    featureToggles: { sidenav526ezEnabled: true },
    pathname: '/test-path',
  };

  it('tracks and delegates back/continue handlers', () => {
    const trackBackStub = sinon
      .stub(datadogRumTracking, 'trackBackButtonClick')
      .returns();
    const trackContinueStub = sinon
      .stub(datadogRumTracking, 'trackContinueButtonClick')
      .returns();

    const goBack = sinon.spy();
    const goForward = sinon.spy();

    const DefaultNavButtons = ({ goBack: back, goForward: forward }) => (
      <div>
        <va-button type="button" onClick={back}>
          Back
        </va-button>
        <va-button type="button" onClick={forward}>
          Continue
        </va-button>
      </div>
    );

    const NavButtonsWithTracking = createNavButtonsWithTracking(
      () => trackingContext,
    );

    const { getByText } = render(
      <NavButtonsWithTracking
        DefaultNavButtons={DefaultNavButtons}
        goBack={goBack}
        goForward={goForward}
      />,
    );

    fireEvent.click(getByText('Back'));
    fireEvent.click(getByText('Continue'));

    expect(goBack.calledOnce).to.be.true;
    expect(goForward.calledOnce).to.be.true;
    expect(trackBackStub.calledOnce).to.be.true;
    expect(trackContinueStub.calledOnce).to.be.true;

    trackBackStub.restore();
    trackContinueStub.restore();
  });

  it('swallows tracking errors and still calls handlers', () => {
    const trackBackStub = sinon
      .stub(datadogRumTracking, 'trackBackButtonClick')
      .throws(new Error('back failed'));
    const trackContinueStub = sinon
      .stub(datadogRumTracking, 'trackContinueButtonClick')
      .throws(new Error('continue failed'));

    const goBack = sinon.spy();
    const goForward = sinon.spy();

    const DefaultNavButtons = ({ goBack: back, goForward: forward }) => (
      <div>
        <va-button type="button" onClick={back}>
          Back
        </va-button>
        <va-button type="button" onClick={forward}>
          Continue
        </va-button>
      </div>
    );

    const NavButtonsWithTracking = createNavButtonsWithTracking(
      () => trackingContext,
    );

    const { getByText } = render(
      <NavButtonsWithTracking
        DefaultNavButtons={DefaultNavButtons}
        goBack={goBack}
        goForward={goForward}
      />,
    );

    fireEvent.click(getByText('Back'));
    fireEvent.click(getByText('Continue'));

    expect(goBack.calledOnce).to.be.true;
    expect(goForward.calledOnce).to.be.true;

    trackBackStub.restore();
    trackContinueStub.restore();
  });
});
