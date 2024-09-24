import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SignInMayBeRequiredCategoryPage from '../../components/SignInMayBeRequiredCategoryPage';

const mockStore = configureStore([]);

describe('SignInMayBeRequiredCategoryPage Component', () => {
  it('should render the alert when the user is not logged in', () => {
    const store = mockStore({
      user: {
        login: {
          currentlyLoggedIn: false,
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <SignInMayBeRequiredCategoryPage />
      </Provider>,
    );

    expect(getByText('Sign in may be required')).to.exist;
  });

  it('should not render the alert when the user is logged in', () => {
    const store = mockStore({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    });

    const { queryByText } = render(
      <Provider store={store}>
        <SignInMayBeRequiredCategoryPage />
      </Provider>,
    );

    expect(queryByText('Sign in may be required')).to.be.null;
  });
});
