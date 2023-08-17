import React from 'react';
import { expect } from 'chai';
import { wait } from '@@profile/tests/unit-test-helpers';
import { mockFetch } from '~/platform/testing/unit/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';
import HealthCare from '~/applications/personalization/dashboard/components/health-care/HealthCare';

describe('HealthCare component', () => {
  let view;
  let initialState;

  context('when user has the `messaging` service', () => {
    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      mockFetch();
      initialState = {
        user: {
          profile: {
            services: ['messaging'],
          },
        },
        health: {
          appointments: {
            data: [],
          },
          msg: {
            unreadCount: {
              count: 3,
            },
          },
        },
      };
    });

    it('should attempt to get messaging data', async () => {
      view = renderInReduxProvider(<HealthCare />, {
        initialState,
        reducers,
      });
      await wait(1);
      const fetchCalls = global.fetch.getCalls();
      // make sure we are fetching messaging folders
      expect(
        fetchCalls.some(call => {
          return call.args[0].includes('v0/messaging/health/folders/0');
        }),
      ).to.be.true;
    });
  });

  context('when user lacks the `messaging` service', () => {
    beforeEach(() => {
      mockFetch();
      initialState = {
        user: {
          profile: {
            services: [],
          },
        },
        health: {
          appointments: {
            data: [],
          },
          msg: {
            unreadCount: { count: null },
          },
        },
      };
    });
    it('should not attempt to get messaging data', async () => {
      view = renderInReduxProvider(<HealthCare />, {
        initialState,
        reducers,
      });
      await wait(1);
      const fetchCalls = global.fetch.getCalls();
      // make sure we are not fetching messaging folders
      expect(
        fetchCalls.some(call => {
          return call.args[0].includes('v0/messaging/health/folders/0');
        }),
      ).to.be.false;
    });

    it('should render a messaging CTA', () => {
      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });
      expect(
        view.queryByRole('link', {
          name: /send a secure message/i,
        }),
      ).to.exist;
    });
  });
});
