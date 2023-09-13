import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import IntroductionPage from '../../containers/IntroductionPage';
import formConfig from '../../config/form';

const getData = ({
  loggedIn = true,
  isVerified = true,
  data = {},
  contestableIssues = {},
} = {}) => ({
  props: {
    loggedIn,
    location: {
      basename: '/sc-base-url',
    },
    route: {
      formConfig,
      pageList: [
        { path: '/introduction' },
        { path: '/first-page', formConfig },
      ],
    },
  },
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
          verified: isVerified,
          userFullName: {
            first: 'Peter',
            middle: 'B',
            last: 'Parker',
          },
        },
      },
      form: {
        formId: formConfig.formId,
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
        data,
        contestableIssues,
      },
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: { get() {} },
        dismissedDowntimeWarnings: [],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('IntroductionPage', () => {
  it('should render', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h1', container).textContent).to.eq('Ask VA');
    expect($$('h2', container)[1].textContent).to.eq(
      'Hello, follow the steps below to apply for ask the va test.',
    );
    expect($('button', container).textContent).to.eq(
      'Sign in to start your application',
    );
  });

  it('should render with user first name', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h2', container).textContent).to.eq(
      'Peter, follow the steps below to apply for ask the va test.',
    );
  });
});
