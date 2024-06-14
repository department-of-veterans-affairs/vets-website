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
    const { getByTestId } = getLandingPage();
    expect(getByTestId('landing-page-heading').textContent).to.eq(
      'Welcome to the Accredited Representative Portal',
    );
  });

  describe('when user is not signed in', () => {
    it('renders the sign in or create account section', () => {
      const { getByTestId } = getLandingPage();
      expect(getByTestId('landing-page-create-account-text').textContent).to.eq(
        'Create an account to start managing power of attorney.',
      );
    });

    it('renders the link to sign in', () => {
      const { getByTestId } = getLandingPage();
      expect(getByTestId('landing-page-sign-in-link').textContent).to.eq(
        'Sign in or create account',
      );
    });
  });

  describe('when user is signed in', () => {
    const mockProfile = {
      name: 'Test User',
      email: 'test@example.com',
    };

    it('does not render the sign in or create account section', () => {
      const { queryByTestId } = getLandingPage(false, mockProfile);
      expect(queryByTestId('landing-page-create-account-text')).to.not.exist;
    });

    it('does not render the link to sign in', () => {
      const { queryByTestId } = getLandingPage(false, mockProfile);
      expect(queryByTestId('landing-page-sign-in-link')).to.not.exist;
    });
  });
});
