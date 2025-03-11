import React from 'react';
import { expect } from 'chai';

import LandingPage from '../../../containers/LandingPage';
import { renderTestApp, renderTestRoutes } from '../helpers';

describe('LandingPage', () => {
  // Can't get tests to work wtih data loading seemingly. Works without a loader
  // defined.
  describe('when component renders', () => {
    it('renders main heading', () => {
      const { getByTestId } = renderTestApp(<LandingPage />);
      expect(getByTestId('landing-page-heading').textContent).to.eq(
        'Welcome to the Accredited Representative Portal',
      );
    });

    it('renders hero content', () => {
      const { getByTestId } = renderTestApp(<LandingPage />);
      expect(getByTestId('landing-page-hero-text').textContent).to.eq(
        'A secure, user-friendly system that streamlines the power of attorney and claims process for representatives and the Veterans they support',
      );
    });

    it('renders portal content', () => {
      const { getByTestId } = renderTestApp(<LandingPage />);
      expect(getByTestId('landing-page-portal-hdr').textContent).to.eq(
        'What the portal can do',
      );
      expect(getByTestId('landing-page-portal-text').textContent).to.eq(
        'You can use the portal to accept power of attorney (POA) requests for any of your accredited organizations. If you have access to the Veterans Benefits Management System (VBMS), you’ll be able to access a Veteran’s information in VBMS within minutes of accepting their POA request in the portal.',
      );

      expect(getByTestId('landing-page-portal-for-hdr').textContent).to.eq(
        'Who the portal is for',
      );
      expect(getByTestId('landing-page-portal-for-text').textContent).to.eq(
        'Currently, the portal is only for Veterans Service Organization (VSO) representatives who accept POA requests on behalf of their organizations. In the future, the portal will support accredited VSOs, attorneys, and claims agents.Learn more about accredited representatives (opens in a new tab)',
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
