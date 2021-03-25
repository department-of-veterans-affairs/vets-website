import React from 'react';
import { expect } from 'chai';
import { mockFetch, resetFetch } from '~/platform/testing/unit/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';
import HealthCare from '~/applications/personalization/dashboard-2/components/health-care/HealthCare';
import { upcomingVAAppointment } from '~/applications/personalization/dashboard-2/utils/appointments';

describe('HealthCare component', () => {
  let view;
  let initialState;

  context(
    'when the user has an appointment scheduled within the next 30 days',
    () => {
      beforeEach(() => {
        window.VetsGov = { pollTimeout: 1 };
        mockFetch();
        initialState = {
          user: {
            profile: {
              services: [],
            },
          },
          health: {
            appointments: {
              fetching: false,
              data: upcomingVAAppointment,
            },
            msg: {
              folders: {
                data: {
                  currentItem: {
                    attributes: {
                      unreadCount: null,
                    },
                    fetching: false,
                  },
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
      });

      afterEach(() => {
        resetFetch();
      });

      it('should not render "You have no appointments scheduled within the next 30 days"', async () => {
        view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
          initialState,
          reducers,
        });
        expect(
          await view.queryByText(
            new RegExp(
              `You have no appointments scheduled within the next 30 days`,
              'i',
            ),
          ),
        ).not.to.exist;
      });

      it('should render "Next appointment"', async () => {
        view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
          initialState,
          reducers,
        });
        await expect(view.queryByText(new RegExp(`Next appointment`, 'i'))).to
          .exist;
      });
    },
  );
});
