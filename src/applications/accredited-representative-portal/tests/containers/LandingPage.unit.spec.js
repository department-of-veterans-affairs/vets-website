import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import createReduxStore from '../../store';

import LandingPage from '../../containers/LandingPage';
import { TestAppContainer } from '../helpers';
import {
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_USER,
} from '../../actions/user';

function renderTestApp({ initAction } = {}) {
  const store = createReduxStore();
  if (initAction) store.dispatch(initAction);

  return render(
    <TestAppContainer store={store}>
      <LandingPage />
    </TestAppContainer>,
  );
}

describe('LandingPage', () => {
  describe('when component renders', () => {
    it('renders main heading', () => {
      const { getByTestId } = renderTestApp();
      expect(getByTestId('landing-page-heading').textContent).to.eq(
        'Welcome to the Accredited Representative Portal',
      );
    });
  });

  describe('when user is being fetched', () => {
    const initAction = {
      type: FETCH_USER,
    };

    it('renders a loading spinner', () => {
      const { getByTestId } = renderTestApp({ initAction });
      expect(getByTestId('landing-page-loading-indicator')).to.exist;
    });
  });

  describe('when user fetch fails', () => {
    const initAction = {
      type: FETCH_USER_FAILURE,
    };

    it('renders the sign in or create account section', () => {
      const { getByTestId } = renderTestApp({ initAction });
      expect(getByTestId('landing-page-create-account-text').textContent).to.eq(
        'Create an account to start managing power of attorney.',
      );
    });

    it('renders the link to sign in', () => {
      const { getByTestId } = renderTestApp({ initAction });
      expect(getByTestId('landing-page-sign-in-link').textContent).to.eq(
        'Sign in or create account',
      );
    });
  });

  describe('when user fetch succeeds', () => {
    const initAction = {
      type: FETCH_USER_SUCCESS,
      payload: {
        account: {},
        profile: {},
      },
    };

    it('does not render the sign in or create account section', () => {
      const { queryByTestId } = renderTestApp({ initAction });
      expect(queryByTestId('landing-page-create-account-text')).to.not.exist;
    });

    it('does not render the link to sign in', () => {
      const { queryByTestId } = renderTestApp({ initAction });
      expect(queryByTestId('landing-page-sign-in-link')).to.not.exist;
    });
  });
});
