import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import sinon from 'sinon';
import recordEvent from 'platform/monitoring/record-event';
import { hasSession } from 'platform/user/profile/utilities';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import VerifyApp from '../../containers/VerifyApp';
// import AuthenticatedVerify from '../components/AuthenticatedVerify';
// import UnauthenticatedVerify from '../components/UnauthenticatedVerify';

describe('VerifyApp', () => {
  let recordEventSpy;
  let hasSessionStub;
  let originalIsProduction;

  beforeEach(() => {
    recordEventSpy = sinon.spy(recordEvent);
    hasSessionStub = sinon.stub(hasSession);
    originalIsProduction = environment.isProduction;
  });

  afterEach(() => {
    sinon.restore();
    environment.isProduction = originalIsProduction;
  });

  it('renders the unauthenticated component when user is unauthenticated and not in production', () => {
    hasSessionStub.returns(false);
    environment.isProduction = false;

    const { getByTestId } = renderInReduxProvider(<VerifyApp />);

    expect(getByTestId('unauthenticatedVerify')).to.exist;
    expect(recordEventSpy.calledWith({ event: 'verify-prompt-displayed' })).to
      .be.true;
  });

  it('redirects to the home page if unauthenticated and in production', () => {
    hasSessionStub.returns(false);
    environment.isProduction = true;

    const replaceSpy = sinon.spy();
    window.location.replace = replaceSpy;

    renderInReduxProvider(<VerifyApp />);

    expect(replaceSpy.calledWith('/')).to.be.true;
    expect(recordEventSpy.calledWith({ event: 'verify-prompt-displayed' })).to
      .be.true;
  });

  it('renders the authenticated component when user is authenticated', () => {
    hasSessionStub.returns(true);
    const initialState = {
      user: {
        profile: { verified: true },
      },
    };

    const { getByTestId } = renderInReduxProvider(<VerifyApp />, {
      initialState,
    });

    expect(getByTestId('authenticatedVerify')).to.exist;
    expect(recordEventSpy.calledWith({ event: 'verify-prompt-displayed' })).to
      .be.true;
  });

  it('sets the document title to "Verify your identity"', () => {
    hasSessionStub.returns(true);
    renderInReduxProvider(<VerifyApp />);

    expect(document.title).to.equal('Verify your identity');
  });

  it('renders the unauthenticated component if `hasSession` returns false and user is not verified', () => {
    hasSessionStub.returns(false);
    environment.isProduction = false;

    const { getByTestId } = renderInReduxProvider(<VerifyApp />);

    expect(getByTestId('unauthenticatedVerify')).to.exist;
  });

  it('renders the authenticated component if `hasSession` returns true and user is verified', () => {
    hasSessionStub.returns(true);
    const initialState = {
      user: {
        profile: { verified: true },
      },
    };

    const { getByTestId } = renderInReduxProvider(<VerifyApp />, {
      initialState,
    });

    expect(getByTestId('authenticatedVerify')).to.exist;
  });

  it('does not redirect if user is authenticated and in production', () => {
    hasSessionStub.returns(true);
    environment.isProduction = true;

    const replaceSpy = sinon.spy();
    window.location.replace = replaceSpy;

    const initialState = {
      user: {
        profile: { verified: true },
      },
    };

    renderInReduxProvider(<VerifyApp />, { initialState });

    expect(replaceSpy.notCalled).to.be.true;
  });
});
