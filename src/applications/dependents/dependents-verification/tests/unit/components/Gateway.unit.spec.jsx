import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../../config/form';
import Gateway from '../../../components/Gateway';

describe('Gateway', () => {
  const mockStore = ({
    loggedIn = true,
    isVerified = true,
    dependents = { loading: true, data: [] },
  } = {}) => ({
    user: {
      login: {
        currentlyLoggedIn: loggedIn,
      },
      profile: {
        signIn: { serviceName: 'idme' },
        loa: { current: isVerified ? 3 : 1 },
      },
    },
    dependents,
  });

  it('should render `VerifyAlert` if user is not-verified', async () => {
    const { container } = renderInReduxProvider(
      <Gateway
        top
        route={{ formConfig, pageList: [{ path: '/introduction' }] }}
      />,
      {
        initialState: mockStore({ isVerified: false }),
      },
    );

    await waitFor(() => {
      expect(container.querySelector('va-alert-sign-in')).to.not.be.null;
    });
  });

  it('should not render `VerifyAlert` when top prop is false', async () => {
    const { container } = renderInReduxProvider(
      <Gateway route={{ formConfig, pageList: [{ path: '/introduction' }] }} />,
      {
        initialState: mockStore({ isVerified: false }),
      },
    );

    await waitFor(() => {
      expect(container.querySelector('va-alert-sign-in')).to.be.null;
    });
  });

  it('should render the `va-loading-indicator` if not authenticated', async () => {
    const { container } = renderInReduxProvider(
      <Gateway
        top
        route={{ formConfig, pageList: [{ path: '/introduction' }] }}
      />,
      {
        initialState: mockStore({ loggedIn: true }),
      },
    );

    await waitFor(() => {
      expect(container.querySelector('va-loading-indicator')).to.not.be.null;
    });
  });
});
