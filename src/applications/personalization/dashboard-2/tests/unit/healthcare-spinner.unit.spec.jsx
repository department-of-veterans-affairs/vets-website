import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';
import HealthCare from '~/applications/personalization/dashboard-2/components/health-care/HealthCare';

describe('HealthCare component', () => {
  let view;
  let initialState;

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
      expect(view.getByRole('progressbar')).to.exist;
      expect(view.queryByText(/Refill and track your prescriptions/i)).not.to
        .exist;
      expect(view.queryByText(/Get your lab and test results/i)).not.to.exist;
      expect(view.queryByText(/Get your VA medical records/i)).not.to.exist;
    });
  });
});
