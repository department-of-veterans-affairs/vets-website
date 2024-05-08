import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LandingPage from '../../containers/LandingPage';

const mockStore = configureStore([]);

describe('LandingPage', () => {
  const getLandingPage = (isLoading = false, profile = null) => {
    const store = mockStore({
      user: {
        isLoading,
        profile,
      },
    });

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('renders main heading', () => {
    const { getByTestId } = getLandingPage(false, null);
    expect(getByTestId('landing-page-heading').textContent).to.eq(
      'Welcome to the Accredited Representative Portal',
    );
  });

  it('renders the link to bypass signing in', () => {
    const { getByTestId } = getLandingPage(false, null);
    expect(getByTestId('landing-page-bypass-sign-in-link').textContent).to.eq(
      'Until sign in is added use this to see dashboard',
    );
  });

  it('renders the link to sign in', () => {
    const { getByTestId } = getLandingPage(false, null);
    expect(getByTestId('landing-page-sign-in-link').textContent).to.eq(
      'Sign in or create account',
    );
  });
});
