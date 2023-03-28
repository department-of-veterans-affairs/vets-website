import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { waitFor } from '@testing-library/dom';
import { mockFetch } from 'platform/testing/unit/helpers';
import {
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../mocks/setup';
import { AppointmentList } from '../../../appointment-list';
import { mockAppointmentInfo } from '../../mocks/helpers';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import { createMockAppointmentByVersion } from '../../mocks/data';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVAOSServiceCCAppointments: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS <UpcomingAppointmentsPage>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
    mockAppointmentInfo({});
  });
  afterEach(() => {
    MockDate.reset();
  });
  describe.skip('when vaOnlineSchedulingVAOSV2Next flag is on', () => {
    it('should display AppointmentSchedulingServiceAlert if there is a failure returned', async () => {
      const appointmentTime = moment().add(1, 'days');
      const start = moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD');
      const end = moment()
        .add(395, 'days')
        .format('YYYY-MM-DD');

      const data = {
        id: '01aa456cc',
        kind: 'cc',
        practitioners: [
          {
            identifier: [{ system: null, value: '123' }],
            name: {
              family: 'Medical Care',
              given: ['Atlantic'],
            },
          },
        ],
        description: 'community care appointment',
        comment: 'test comment',
        start: appointmentTime,
        communityCareProvider: {
          providerName: 'Atlantic Medical Care',
        },
        serviceType: 'audiology',
        reasonCode: {
          text: 'test comment',
        },
      };
      const appointment = createMockAppointmentByVersion({
        version: 2,
        ...data,
      });

      mockVAOSAppointmentsFetch({
        start,
        end,
        requests: [appointment],
        statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
        backendServiceFailures: true,
      });

      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState: {
          featureToggles: {
            ...initialState.featureToggles,
            vaOnlineSchedulingVAOSV2Next: true,
          },
        },
      });

      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Your appointments | VA online scheduling | Veterans Affairs`,
        );
      });

      await waitFor(() => {
        expect(screen.queryByText("We can't display in-person VA appointments"))
          .to.exist;
      });
    });

    it('should not display AppointmentSchedulingServiceAlert if there is no failure returned', async () => {
      const appointmentTime = moment().add(1, 'days');
      const start = moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD');
      const end = moment()
        .add(395, 'days')
        .format('YYYY-MM-DD');

      const data = {
        id: '01aa456cc',
        kind: 'cc',
        practitioners: [
          {
            identifier: [{ system: null, value: '123' }],
            name: {
              family: 'Medical Care',
              given: ['Atlantic'],
            },
          },
        ],
        description: 'community care appointment',
        comment: 'test comment',
        start: appointmentTime,
        communityCareProvider: {
          providerName: 'Atlantic Medical Care',
        },
        serviceType: 'audiology',
        reasonCode: {
          text: 'test comment',
        },
      };
      const appointment = createMockAppointmentByVersion({
        version: 2,
        ...data,
      });

      mockVAOSAppointmentsFetch({
        start,
        end,
        requests: [appointment],
        statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      });

      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState: {
          featureToggles: {
            ...initialState.featureToggles,
            vaOnlineSchedulingVAOSV2Next: true,
          },
        },
      });

      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Your appointments | VA online scheduling | Veterans Affairs`,
        );
      });

      expect(screen.queryByText("We can't display in-person VA appointments"))
        .not.to.exist;
    });
  });

  // Skipping BE Alert tests. Related to: #55677
  describe.skip('when vaOnlineSchedulingVAOSV2Next flag is off', () => {
    it('should not display AppointmentSchedulingServiceAlert if there is an error returned', async () => {
      const appointmentTime = moment().add(1, 'days');
      const start = moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD');
      const end = moment()
        .add(395, 'days')
        .format('YYYY-MM-DD');

      const data = {
        id: '01aa456cc',
        kind: 'cc',
        practitioners: [
          {
            identifier: [{ system: null, value: '123' }],
            name: {
              family: 'Medical Care',
              given: ['Atlantic'],
            },
          },
        ],
        description: 'community care appointment',
        comment: 'test comment',
        start: appointmentTime,
        communityCareProvider: {
          providerName: 'Atlantic Medical Care',
        },
        serviceType: 'audiology',
        reasonCode: {
          text: 'test comment',
        },
      };
      const appointment = createMockAppointmentByVersion({
        version: 2,
        ...data,
      });

      mockVAOSAppointmentsFetch({
        start,
        end,
        requests: [appointment],
        statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      });

      const screen = renderWithStoreAndRouter(<AppointmentList />, {
        initialState: {
          featureToggles: {
            ...initialState.featureToggles,
            vaOnlineSchedulingVAOSV2Next: false,
          },
        },
      });

      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Your appointments | VA online scheduling | Veterans Affairs`,
        );
      });

      expect(screen.queryByText("We can't display in-person VA appointments"))
        .not.to.exist;
    });
  });
});
