import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import BurialsApp from '../BurialsApp';

const burialsLocation = {
  pathname: '/introduction',
  search: '',
  hash: '',
  action: 'POP',
  key: null,
  basename: '/burials/application/530',
  query: '{}',
};

const store = ({ burialsFormEnabled = true, loading = true } = {}) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: true,
      },
    },
    featureToggles: {
      loading,
      // eslint-disable-next-line camelcase
      burials_form_enabled: burialsFormEnabled,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('BurialsApp', () => {
  it('should show VA loading indicator', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <BurialsApp location={burialsLocation} />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should show NoFormPage', async () => {
    const mockStore = store({ loading: false, pensionFormEnabled: false });
    const { container } = render(
      <Provider store={mockStore}>
        <BurialsApp location={burialsLocation} />
      </Provider>,
    );
    await waitFor(() => {
      expect($('va-loading-indicator', container)).to.not.exist;
      expect($('va-alert', container)).to.exist;
    });
  });
});
