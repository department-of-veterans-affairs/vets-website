import React from 'react';
import { expect } from 'chai';

import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';

import DirectDepositContent from './DirectDepositContent';

describe('DirectDepositContent', () => {
  let view;
  context('when the "ch33_dd_profile" feature flag is off', () => {
    context('and the user is logged out', () => {
      beforeEach(() => {
        view = renderInReduxProvider(<DirectDepositContent />, {
          initialState: {
            /* eslint-disable-next-line camelcase */
            featureToggles: { ch33_dd_profile: false },
            user: {
              login: {
                currentlyLoggedIn: false,
              },
              profile: {
                loading: false,
                mhvAccount: {},
              },
            },
          },
        });
      });
      it('should show the correct content', () => {
        view.getByRole('heading', {
          name: /Disability compensation and pension benefit payments/i,
        });
        view.getByRole('heading', {
          name: /Please sign in to change your direct deposit information online/i,
        });
        view.getByRole('button', { name: /sign in or create an account/i });
        view.getByRole('heading', { name: /^Education benefits$/i });
        view.getByRole('heading', { name: /please sign in to ebenefits/i });
        view.getByRole('link', { name: /go to ebenefits/i });
      });
    });

    context('and the user is logged in, is LOA3, and has 2FA set up', () => {
      beforeEach(() => {
        view = renderInReduxProvider(<DirectDepositContent />, {
          initialState: {
            /* eslint-disable-next-line camelcase */
            featureToggles: { ch33_dd_profile: false },
            user: {
              login: {
                currentlyLoggedIn: true,
              },
              profile: {
                loading: false,
                mhvAccount: {},
                multifactor: true,
                verified: true,
              },
            },
          },
        });
      });
      it('should show the correct content', () => {
        view.getByRole('heading', {
          name: /Disability compensation and pension benefit payments/i,
        });
        view.getByRole('heading', {
          name: /Go to your VA.gov profile to change your direct deposit information online/i,
        });
        view.getByRole('button', { name: /go to your va.gov profile/i });
        view.getByRole('heading', { name: /^Education benefits$/i });
        view.getByRole('heading', { name: /please sign in to ebenefits/i });
        view.getByRole('link', { name: /go to ebenefits/i });
      });
      it('should not prompt them to sign in', () => {
        expect(
          view.queryByRole('heading', {
            name: /Please sign in to change your direct deposit information online/i,
          }),
        ).to.not.exist;
        expect(
          view.queryByRole('button', { name: /sign in or create an account/i }),
        ).to.not.exist;
      });
    });
  });

  context('when the "ch33_dd_profile" feature flag is on', () => {
    context('and the user is logged in, is LOA3, and has 2FA set up', () => {
      beforeEach(() => {
        view = renderInReduxProvider(<DirectDepositContent />, {
          initialState: {
            /* eslint-disable-next-line camelcase */
            featureToggles: { ch33_dd_profile: true },
            user: {
              login: { currentlyLoggedIn: true },
              profile: {
                loading: false,
                mhvAccount: {},
                multifactor: true,
                verified: true,
              },
            },
          },
        });
      });
      it('should show the correct content', () => {
        expect(
          view.queryByRole('heading', {
            name: /Disability compensation and pension benefit payments/i,
          }),
        ).to.not.exist;
        view.getByRole('heading', {
          name: /Go to your VA.gov profile to change your direct deposit information online/i,
        });
        view.getByRole('button', { name: /go to your va.gov profile/i });
        expect(view.queryByRole('heading', { name: /^Education benefits$/i }))
          .to.not.exist;
        expect(
          view.queryByRole('heading', { name: /please sign in to ebenefits/i }),
        ).to.not.exist;
        expect(view.queryByRole('link', { name: /go to ebenefits/i })).to.not
          .exist;
      });
    });
  });
});
