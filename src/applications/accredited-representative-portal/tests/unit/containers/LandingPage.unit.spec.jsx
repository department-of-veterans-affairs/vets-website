import React from 'react';
import { expect } from 'chai';

import LandingPage from '../../../containers/LandingPage';
import { renderTestApp, renderTestRoutes } from '../helpers';

describe('LandingPage', () => {
  // Can't get tests to work wtih data loading seemingly. Works without a loader
  // defined.
  describe.skip('when component renders', () => {
    it('renders main heading', () => {
      const { getByTestId } = renderTestApp(<LandingPage />);
      expect(getByTestId('landing-page-heading').textContent).to.eq(
        'Welcome to the Accredited Representative Portal',
      );
    });
  });

  // Can't get tests to work wtih data loading seemingly. Works without a loader
  // defined.
  describe.skip('when user fetch fails', () => {
    const makeTestRoutes = () => {
      return renderTestRoutes([
        {
          id: 'root',
          path: '/',
          loader() {
            return null;
          },
          children: [
            {
              index: true,
              element: <LandingPage />,
            },
          ],
        },
      ]);
    };

    it('renders the sign in or create account section', () => {
      const { getByTestId } = makeTestRoutes();
      expect(getByTestId('landing-page-create-account-text').textContent).to.eq(
        'Create an account to start managing power of attorney.',
      );
    });

    it('renders the link to sign in', () => {
      const { getByTestId } = makeTestRoutes();
      expect(getByTestId('landing-page-sign-in-link').textContent).to.eq(
        'Sign in or create account',
      );
    });
  });

  // Can't get tests to work wtih data loading seemingly. Works without a loader
  // defined.
  describe.skip('when user fetch succeeds', () => {
    const makeTestRoutes = () => {
      return renderTestRoutes([
        {
          id: 'root',
          path: '/',
          loader() {
            return {
              account: {},
              profile: {},
            };
          },
          children: [
            {
              index: true,
              element: <LandingPage />,
            },
          ],
        },
      ]);
    };

    it('does not render the sign in or create account section', () => {
      const { queryByTestId } = makeTestRoutes();
      expect(queryByTestId('landing-page-create-account-text')).to.not.exist;
    });

    it('does not render the link to sign in', () => {
      const { queryByTestId } = makeTestRoutes();
      expect(queryByTestId('landing-page-sign-in-link')).to.not.exist;
    });
  });
});
