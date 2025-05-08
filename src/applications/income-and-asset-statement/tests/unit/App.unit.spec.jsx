import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

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

const getData = ({
  loggedIn = true,
  savedForms = [],
  verified = true,
  data = {},
  accountUuid = '',
  pathname = '/introduction',
  push = () => {},
  status = '',
  isLoading = false,
  toggle = false,
} = {}) => {
  return {
    props: {
      location: { pathname, search: '' },
      children: <h1>Intro</h1>,
      router: { push },
      routes: [{ path: pathname }],
    },
    data: {
      routes: [{ path: pathname }],
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms,
          verified,
          accountUuid,
          prefillsAvailable: [],
        },
      },
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {
            inProgressFormId: '5678',
          },
        },
        data,
      },
      featureToggles: {
        loading: isLoading,
        // eslint-disable-next-line camelcase
        income_and_assets_form_enabled: toggle,
      },
      contestableIssues: {
        status,
      },
    },
  };
};

const mockStore = configureStore([]);

describe('Income and Asset Statement App', () => {
  it('should show VA loading indicator', () => {
    const { props, data } = getData({
      loggedIn: true,
      status: 'done',
      isLoading: true,
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} location={appLocation} />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should render RoutedSavableApp when feature toggle is enabled', () => {
    const { props, data } = getData({
      loggedIn: true,
      status: 'done',
      toggle: true,
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} location={appLocation} />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.not.exist;
    expect($$('h2', container)).to.exist;
  });

  it('should show No Form page', async () => {
    const { props, data } = getData({
      loggedIn: true,
      status: 'done',
      isLoading: false,
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <App {...props} location={appLocation} />
      </Provider>,
    );
    await waitFor(() => {
      expect($('va-loading-indicator', container)).to.not.exist;
      expect($('va-alert', container)).to.exist;
      expect($$('h2', container)[0].textContent).to.eql(
        'You can’t use our online application right now',
      );
    });
  });
});
