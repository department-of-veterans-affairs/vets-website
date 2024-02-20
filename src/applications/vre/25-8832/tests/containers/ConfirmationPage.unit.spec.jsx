import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ConfirmationPage from '../../containers/ConfirmationPage';

describe('Chapter 36 (25-8832) - ConfirmationPage', () => {
  const generateStore = ({ currentlyLoggedIn = false } = {}) => ({
    getState: () => ({
      form: {
        submission: {
          response: {
            timestamp: '11-03-2023',
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
});
