import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';
import LandingPage from '../../containers/LandingPage';
import createReduxStore from '../../store';
import {
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_USER,
} from '../../actions/user';

const createLandingPageRenderFn = action => {
  const store = createReduxStore();
  if (action) store.dispatch(action);

  return () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      </Provider>,
    );
  };
};

describe('LandingPage', () => {
  describe('when component renders', () => {
    const renderLandingPage = createLandingPageRenderFn();

    it('renders main heading', () => {
      const { getByTestId } = renderLandingPage();
      expect(getByTestId('landing-page-heading').textContent).to.eq(
        'Welcome to the Accredited Representative Portal',
      );
    });
  });

  describe('when user is being fetched', () => {
    const renderLandingPage = createLandingPageRenderFn({
      type: FETCH_USER,
    });

    it('renders a loading spinner', () => {
      const { getByTestId } = renderLandingPage();
      expect(getByTestId('landing-page-loading-indicator')).to.exist;
    });
  });

  describe('when user fetch fails', () => {
    const renderLandingPage = createLandingPageRenderFn({
      type: FETCH_USER_FAILURE,
    });

    it('renders the sign in or create account section', () => {
      const { getByTestId } = renderLandingPage();
      expect(getByTestId('landing-page-create-account-text').textContent).to.eq(
        'Create an account to start managing power of attorney.',
      );
    });

    it('renders the link to sign in', () => {
      const { getByTestId } = renderLandingPage();
      expect(getByTestId('landing-page-sign-in-link').textContent).to.eq(
        'Sign in or create account',
      );
    });
  });

  describe('when user fetch succeeds', () => {
    const renderLandingPage = createLandingPageRenderFn({
      type: FETCH_USER_SUCCESS,
      payload: {
        account: {},
        profile: {},
      },
    });

    it('does not render the sign in or create account section', () => {
      const { queryByTestId } = renderLandingPage();
      expect(queryByTestId('landing-page-create-account-text')).to.not.exist;
    });

    it('does not render the link to sign in', () => {
      const { queryByTestId } = renderLandingPage();
      expect(queryByTestId('landing-page-sign-in-link')).to.not.exist;
    });
  });
});
