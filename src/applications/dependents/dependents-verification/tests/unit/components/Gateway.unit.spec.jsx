import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { act, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';
import Gateway from '../../../components/Gateway';
import reducers from '../../../reducers';
import mockDependents from '../../e2e/fixtures/mocks/mock-dependents.json';

describe('Gateway', () => {
  afterEach(() => {
    resetFetch();
  });

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
  const route = { formConfig, pageList: [{ path: '/introduction' }] };

  it('should render `VerifyAlert` if user is not-verified', async () => {
    const { container } = renderInReduxProvider(<Gateway top route={route} />, {
      initialState: mockStore({ isVerified: false }),
    });

    await waitFor(() => {
      expect($('va-alert-sign-in', container)).to.exist;
    });
  });

  it('should not render `VerifyAlert` when top prop is false', async () => {
    const { container } = renderInReduxProvider(<Gateway route={route} />, {
      initialState: mockStore({ isVerified: false }),
    });

    await waitFor(() => {
      expect($('va-alert-sign-in', container)).to.be.null;
    });
  });

  it('should render the `va-loading-indicator` if not authenticated', async () => {
    const { container } = renderInReduxProvider(<Gateway top route={route} />, {
      initialState: mockStore({ loggedIn: true }),
    });

    await waitFor(() => {
      expect($('va-loading-indicator', container)).to.exist;
    });
  });

  it('should render dependents alert', async () => {
    mockApiRequest(mockDependents);
    const { container } = renderInReduxProvider(<Gateway top route={route} />, {
      initialState: mockStore({ loggedIn: true }),
      reducers,
    });

    await waitFor(() => {
      expect(global.fetch.args[0][0]).to.contain('/show');
      expect($('va-alert', container)).to.not.exist;
    });
  });

  it('should render the no dependents alert', async () => {
    mockApiRequest({ data: { attributes: { persons: [] } } });
    let container;
    await act(async () => {
      const rendered = renderInReduxProvider(<Gateway top route={route} />, {
        initialState: mockStore({ loggedIn: true }),
        reducers,
      });
      container = rendered.container;
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect($('va-alert[status="info"]', container)).to.exist;
    });

    const alert = $('va-alert[status="info"]', container);
    expect($('h2', alert).textContent).to.eq(
      'We don’t have any dependents information on file for you',
    );
  });

  it('should render an API error alert', async () => {
    mockApiRequest(null, false);
    let container;
    await act(async () => {
      const rendered = renderInReduxProvider(<Gateway top route={route} />, {
        initialState: mockStore({ loggedIn: true }),
        reducers,
      });
      container = rendered.container;
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect($('va-alert[status="error"]', container)).to.exist;
    });

    const alert = $('va-alert[status="error"]', container);
    expect($('h2', alert).textContent).to.eq('Error Loading Dependents');
  });
});
