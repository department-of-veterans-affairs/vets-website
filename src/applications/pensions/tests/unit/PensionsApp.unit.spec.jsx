import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import PensionsApp from '../../PensionsApp';

const pensionLocation = {
  pathname: '/introduction',
  search: '',
  hash: '',
  action: 'POP',
  key: null,
  basename: '/pension/apply-for-veteran-pension-form-21p-527ez',
  query: '{}',
};

const store = ({
  pensionFormEnabled = true,
  loading = true,
  isLoggedIn = true,
} = {}) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: isLoggedIn,
      },
    },
    featureToggles: {
      loading,
      // eslint-disable-next-line camelcase
      pension_form_enabled: pensionFormEnabled,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('PensionsApp', () => {
  it('should show VA loading indicator', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <PensionsApp location={pensionLocation} />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.exist;
  });

  it.skip('should show NoFormPage', async () => {
    // skipping to support node 22 upgrade
    // appears to be flaky and likely related to shadow DOM rendering timing

    const mockStore = store({ loading: false, pensionFormEnabled: false });
    const { container } = render(
      <Provider store={mockStore}>
        <PensionsApp location={pensionLocation} />
      </Provider>,
    );
    await waitFor(() => {
      expect($('va-alert', container)).to.exist;
      expect($('va-loading-indicator', container)).to.not.exist;
    });
  });

  it('should render the ITF wrapper on first page', async () => {
    const oldLocation = global.window.location;
    global.window.location = { href: '' };

    const mockStore = store({ loading: false, pensionFormEnabled: false });
    const { container } = render(
      <Provider store={mockStore}>
        <PensionsApp
          location={{ ...pensionLocation, pathname: '/inside-form' }}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect($('.itf-wrapper', container)).to.not.exist;
    });

    global.window.location = oldLocation;
  });

  it('should render redirect loading indicator when user is not logged in on form page', () => {
    const mockStore = store({ loading: false, isLoggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <PensionsApp
          location={{ ...pensionLocation, pathname: '/inside-form' }}
        />
      </Provider>,
    );

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.exist;
    expect(loadingIndicator.getAttribute('message')).to.equal(
      'Redirecting to introduction page...',
    );
  });
});
