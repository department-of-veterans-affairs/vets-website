import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';
import HealthCare from '~/applications/personalization/dashboard-2/components/health-care/HealthCare';
import {
  farFutureAppointments,
  upcomingVAAppointment,
} from '~/applications/personalization/dashboard-2/utils/appointments';

describe('HealthCare component', () => {
  let view;
  let initialState;

  describe('when the user has an appointment scheduled within the next 30 days', () => {
    it('should render "Next appointment"', async () => {
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

      view = renderInReduxProvider(<HealthCare dataLoadingDisabled />, {
        initialState,
        reducers,
      });

      expect(view.getByText(/next appointment/i));
    });
  });

  describe('when the user has an appointment scheduled after the next 30 days', () => {
    beforeEach(() => {
      initialState = {
        user: {
          profile: {
            services: [],
          },
        },
        health: {
          appointments: {
            fetching: false,
            data: farFutureAppointments,
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
      initialState = {
        user: {
          profile: {
            services: [],
          },
        },
        health: {
          appointments: {
            fetching: false,
            data: [],
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

    it('should render "Schedule and view your appointments"', () => {
      expect(view.getByText(/schedule and view your appointments/i));
    });
  });
});
