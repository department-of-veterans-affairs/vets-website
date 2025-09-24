import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import IntroductionPage from './IntroductionPage';
import formConfig from '../config/form';

const mockData = ({
  loggedIn = true,
  isVerified = true,
  data = {},
  contestedIssues = {},
} = {}) => ({
  props: {
    route: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next' }],
    },
    location: {
      pathname: '/user-testing/conditions/introduction',
      search: '',
      hash: '',
      state: null,
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
          signIn: { serviceName: 'idme' },
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
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('IntroductionPage', () => {
  // suppress the warning for scrollToTop
  before(() => {
    // eslint-disable-next-line no-console
    console.warn = () => {};
  });

  it('should render', () => {
    const { props, mockStore } = mockData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const heading = container.querySelector('h1[tabindex="-1"]');
    expect(heading).to.exist;
    expect(heading.textContent).to.include('File for disability compensation');

    const alert = container.querySelector(
      'va-alert-sign-in[variant="signInOptional"]',
    );
    expect(alert).to.exist;

    const signInButton = container.querySelector(
      'va-button[text="Sign in to start your application"]',
    );
    expect(signInButton).to.exist;

    const guestLink = container.querySelector('.schemaform-start-button');
    expect(guestLink).to.exist;
    expect(guestLink.textContent).to.include(
      'Start your application without signing in',
    );
  });
});
