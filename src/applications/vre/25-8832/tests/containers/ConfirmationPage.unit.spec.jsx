import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ConfirmationPage from '../../containers/ConfirmationPage';

describe('Chapter 36 (25-8832) - ConfirmationPage', () => {
  const generateStore = ({
    currentlyLoggedIn = false,
    submittedAt = '2026-02-27T16:34:53.295Z',
  } = {}) => ({
    getState: () => ({
      form: {
        submission: {
          response: {
            attributes: { submittedAt },
          },
        },
        data: {
          fullName: 'Alex Evans',
        },
      },
      user: {
        login: { currentlyLoggedIn },
        profile: { userFullName: { first: 'Alex', last: 'Evans' } },
      },
    }),
    dispatch: () => {},
    subscribe: () => {},
  });
  it('should render', () => {
    const store = generateStore();
    const { queryByText } = render(
      <Provider store={store}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(queryByText('Thank you for submitting your application')).to.not.be
      .null;
  });
  it('should print the page', () => {});
  it('should show the form name is not signed in', () => {
    const store = generateStore({ currentlyLoggedIn: true });
    const { queryByText } = render(
      <Provider store={store}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(queryByText('FOR: Alex Evans')).to.not.be.null;
  });

  it('should not render submitted date for invalid timestamp', () => {
    const store = generateStore({ submittedAt: 'not-a-date' });
    const { queryByText } = render(
      <Provider store={store}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(queryByText('Thank you for submitting your application')).to.not.be
      .null;
    expect(queryByText('Date submitted')).to.be.null;
  });
});
