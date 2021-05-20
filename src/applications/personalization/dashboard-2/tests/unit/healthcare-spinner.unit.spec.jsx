import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import { resetFetch } from '~/platform/testing/unit/helpers';
import reducers from '~/applications/personalization/dashboard/reducers';
import HealthCare from '~/applications/personalization/dashboard-2/components/health-care/HealthCare';

describe('HealthCare component', () => {
  let view;
  let initialState;
  // If a test mocks fetch and fails to properly restore fetch, and that
  // offending test runs shortly before this test, it can result in this test to
  // fail. So we are calling `resetFetch()` defensively.
  before(resetFetch);

  context('when appointments and messaging data are still loading', () => {
    it('should only show a loading spinner', async () => {
      initialState = {
        user: {
          profile: {
            services: ['messaging'],
          },
        },
        health: {
          appointments: {},
          msg: {
            folders: {
              data: {
                currentItem: {},
              },
              ui: {
                nav: {
                  foldersExpanded: false,
                  visible: false,
                },
              },
            },
          },
        },
      };

      view = renderInReduxProvider(<HealthCare />, {
        initialState,
        reducers,
      });
      expect(await view.findByRole('progressbar', { label: /health care/i })).to
        .exist;
      expect(
        view.queryByRole('link', {
          name: /Refill and track your prescriptions/i,
        }),
      ).not.to.exist;
      expect(
        view.queryByRole('link', { name: /Get your lab and test results/i }),
      ).not.to.exist;
      expect(view.queryByRole('link', { name: /Get your VA medical records/i }))
        .not.to.exist;
    });
  });
});
