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
  contestedIssues = {},
} = {}) => ({
  props: {
    loggedIn,
    location: {
      basename: '/get-help-from-accredited-representative/appoint-rep',
    },
    route: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
    },
  },
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          userFullName: { last: 'last' },
          dob: '2000-01-01',
          claims: { appeals: true },
          savedForms: [],
          prefillsAvailable: [],
          verified: isVerified,
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
        contestedIssues,
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
    expect($('h1', container).textContent).to.eq(
      'Request help from a VA accredited representative or VSO',
    );
    expect($('va-process-list', container)).to.exist;
    expect($('va-omb-info', container)).to.exist;
    expect($('va-alert-sign-in[variant="signInOptional"]', container)).to.exist;
  });

  it('should render start action links', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($$('.vads-c-action-link--green', container).length).to.equal(2);
  });
});
