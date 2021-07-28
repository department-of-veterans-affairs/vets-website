import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';
import HealthCare from '~/applications/personalization/dashboard-2/components/health-care/HealthCare';
import {
  farFutureAppointments,
  upcomingCCAppointment,
  upcomingVAAppointment,
} from '~/applications/personalization/dashboard-2/utils/appointments';

function createInitialStateWithAppointments(appointments) {
  return {
    user: {
      profile: {
        services: [],
      },
    },
    health: {
      appointments: {
        fetching: false,
        data: appointments,
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
}

describe('HealthCare component', () => {
  let view;
  let initialState;

  describe('when the user has a VA appointment scheduled within the next 30 days', () => {
    it('should render "Next appointment"', async () => {
      initialState = createInitialStateWithAppointments(upcomingVAAppointment);

      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });

      expect(view.getByText(/next appointment/i));
      expect(view.getByText(/6:00 p.m. MT/i));
    });
  });

  describe('when the user has a CC appointment scheduled within the next 30 days', () => {
    it('should render "Next appointment"', async () => {
      initialState = createInitialStateWithAppointments(upcomingCCAppointment);

      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });

      expect(view.getByText(/next appointment/i));
      expect(view.getByText(/6:00 p.m. MT/i));
    });
  });

  describe('when the user has an appointment scheduled after the next 30 days', () => {
    beforeEach(() => {
      initialState = createInitialStateWithAppointments(farFutureAppointments);

      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });
    });

    it('should not render "You have no appointments scheduled within the next 30 days"', () => {
      expect(
        view.queryByText(
          new RegExp(
            `You have no appointments scheduled within the next 30 days`,
            'i',
          ),
        ),
      ).not.to.exist;
    });
  });

  describe('when the user has no appointments scheduled', () => {
    beforeEach(() => {
      initialState = createInitialStateWithAppointments([]);

      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });
    });

    it('should not render "You have no appointments scheduled within the next 30 days"', () => {
      expect(
        view.queryByText(
          new RegExp(
            `You have no appointments scheduled within the next 30 days`,
            'i',
          ),
        ),
      ).not.to.exist;
    });

    it('should not render "Next appointment"', () => {
      expect(view.queryByText(new RegExp(`Next appointment`, 'i'))).not.to
        .exist;
    });

    it('should render "Schedule and manage your appointments"', () => {
      expect(
        view.getByRole('link', {
          name: /Schedule and manage your appointments/i,
        }),
      );
    });
  });
});
