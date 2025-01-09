import React from 'react';
import { waitFor } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import sinon from 'sinon';
import VerifyApp from '../../containers/VerifyApp';

const generateStore = ({ serviceName = 'logingov' } = {}) => ({
  user: {
    profile: {
      loading: false,
      signIn: { serviceName },
      verified: false,
      session: { authBroker: 'iam' },
    },
  },
});

describe('VerifyApp Component', () => {
  const oldLocation = global.window.location;

  afterEach(() => {
    global.window.location = oldLocation;
    localStorage.clear();
  });

  it('renders the correct title', async () => {
    renderInReduxProvider(<VerifyApp />);

    await waitFor(() => {
      expect(document.title).to.eql('Verify your identity');
    });
  });

  it('renders unauthenticated and not in production: UnauthenticatedVerify', async () => {
    const screen = renderInReduxProvider(<VerifyApp />);

    await waitFor(() => {
      expect(screen.queryByTestId('unauthenticated-verify-app')).to.exist;
      expect(screen.queryByTestId('authenticated-verify-app')).to.not.exist;
    });
  });

  it('renders authenticated and not in production: AuthenticatedVerify', async () => {
    localStorage.setItem('hasSession', true);
    const screen = renderInReduxProvider(<VerifyApp />, {
      initialState: generateStore(),
    });

    await waitFor(() => {
      expect(screen.queryByTestId('unauthenticated-verify-app')).to.not.exist;
      expect(screen.queryByTestId('authenticated-verify-app')).to.exist;
    });
  });

  it('redirects when unauthenticated and is production', async () => {
    global.window.location.pathname = '/verify';
    const isProduction = sinon.stub().returns(true);
    renderInReduxProvider(<VerifyApp env={{ isProduction }} />);

    await waitFor(() => {
      expect(global.window.location.pathname).to.eql('/');
    });
  });
});
