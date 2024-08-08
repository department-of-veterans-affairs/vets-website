import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import App from '../../containers/App';

const appLocation = {
  pathname: '/introduction',
  search: '',
  hash: '',
  action: 'POP',
  key: null,
  basename: '/income-and-asset-statement-form-21p-0969',
  query: '{}',
};

const mockStore = configureStore([]);

describe('Income and Asset Statement App', () => {
  it('should show VA loading indicator', () => {
    const store = mockStore({
      user: { login: { currentlyLoggedIn: true } },
      // eslint-disable-next-line camelcase
      featureToggles: { loading: true, income_and_assets_form_enabled: true },
    });
    const { container } = render(
      <Provider store={store}>
        <App location={appLocation} />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should show No Form page', async () => {
    const store = mockStore({
      user: { login: { currentlyLoggedIn: true } },
      // eslint-disable-next-line camelcase
      featureToggles: { loading: false, income_and_assets_form_enabled: false },
    });
    const { container } = render(
      <Provider store={store}>
        <App location={appLocation} />
      </Provider>,
    );
    await waitFor(() => {
      expect($('va-alert', container)).to.exist;
      expect($$('h2', container)[0].textContent).to.eql(
        'You can’t use our online application right now',
      );
      expect($('va-loading-indicator', container)).to.not.exist;
    });
  });
});
