import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationPage from './ConfirmationPage';
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
      pathname: '/user-testing/conditions/review-and-submit',
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

describe('ConfirmationPage', () => {
  it('should render', () => {
    const { props, mockStore } = mockData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage {...props} />
      </Provider>,
    );

    const headingLvl2 = container.querySelector('h2');
    expect(headingLvl2).to.exist;
    expect(headingLvl2.textContent).to.equal(
      'Your application has been submitted',
    );

    const headingLvl3 = container.querySelector('h3');
    expect(headingLvl3).to.exist;
    expect(headingLvl3.textContent).to.include(
      'File for disability compensation Claim',
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('success');

    const signInButton = container.querySelector(
      'va-button[text="Print this for your records"]',
    );
    expect(signInButton).to.exist;

    const link = container.querySelector('a');
    expect(link).to.exist;
    expect(link.textContent).to.equal('Go back to VA.gov');
  });
});
