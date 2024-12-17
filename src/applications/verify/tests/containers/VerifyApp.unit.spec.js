import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import sinon from 'sinon';
import * as environment from '@department-of-veterans-affairs/platform-utilities/environment';
import VerifyApp from '../../containers/VerifyApp';

const generateStore = ({ csp = 'logingov', verified = false } = {}) => ({
  user: {
    profile: {
      signIn: { serviceName: csp },
      verified,
      session: { authBroker: 'iam' },
    },
  },
});

describe('VerifyApp Component', () => {
  let isProductionStub;
  const windowLocation = sinon.spy();

  beforeEach(() => {
    isProductionStub = sinon.stub(environment, 'isProduction').returns(true);
    global.window.location = { replace: windowLocation };
  });

  afterEach(() => {
    global.window.location = windowLocation;
  });

  it('renders UnauthenticatedVerify when unauthenticated and not in production', () => {
    expect(localStorage.getItem('hasSession')).to.eql(null);
    isProductionStub.returns(false);

    const screen = renderInReduxProvider(<VerifyApp />);
    expect(screen.getByTestId('unauthenticated-verify-app')).to.exist;
    expect(screen.queryByTestId('authenticated-verify-app')).to.not.exist;
  });

  it('renders AuthenticatedVerify when authenticated', () => {
    localStorage.setItem('hasSession', true);
    isProductionStub.returns(false);

    const screen = renderInReduxProvider(<VerifyApp />, {
      initialState: generateStore(),
    });
    expect(screen.getByTestId('authenticated-verify-app')).to.exist;
    expect(screen.queryByTestId('unauthenticated-verify-app')).to.not.exist;
  });

  it('redirects to "/" when unauthenticated and in production', () => {
    expect(localStorage.getItem('hasSession')).to.eql(null);
    // isProductionStub.returns(true);
    localStorage.setItem('isProduction', true);

    renderInReduxProvider(<VerifyApp />);
    // console.log(windowLocation);

    sinon.assert.calledOnce(window.location.replace);
    sinon.assert.calledWith(window.location.replace, '/');
  });

  it('sets document title to "Verify your identity"', () => {
    localStorage.setItem('hasSession', true);
    isProductionStub.returns(false);

    renderInReduxProvider(<VerifyApp />, { initialState: generateStore() });
    expect(document.title).to.equal('Verify your identity');
  });
});
