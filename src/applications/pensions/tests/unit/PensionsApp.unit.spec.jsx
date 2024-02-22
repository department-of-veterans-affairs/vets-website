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
  basename: '/pension/application/527EZ',
  query: '{}',
};

const store = ({ pensionFormEnabled = true, loading = true } = {}) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: true,
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

  it('should show NoFormPage', async () => {
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
});
