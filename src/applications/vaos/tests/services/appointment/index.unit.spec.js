import { expect } from 'chai';
import moment from 'moment';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  isUpcomingAppointmentOrRequest,
  isValidPastAppointment,
  getBookedAppointments,
  getAppointmentRequests,
  hasPractitioner,
  getPractitionerDisplay,
  FUTURE_APPOINTMENTS_HIDDEN_SET,
} from '../../../services/appointment';
import confirmed from '../../../services/mocks/var/confirmed_va.json';
import requests from '../../../services/mocks/var/requests.json';
import { setRequestedPeriod } from '../../mocks/helpers';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
} from '../../../utils/constants';

const now = moment();

describe('VAOS Appointment service', () => {
  describe('getBookedAppointments', () => {
    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, confirmed);

      const startDate = '2020-05-01';
      const endDate = '2020-06-30';

      const data = await getBookedAppointments({
        startDate,
        endDate,
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v0/appointments?start_date=${moment(
          startDate,
        ).toISOString()}&end_date=${moment(endDate).toISOString()}&type=va`,
      );
      expect(global.fetch.secondCall.args[0]).to.contain(
        `/vaos/v0/appointments?start_date=${moment(
          startDate,
        ).toISOString()}&end_date=${moment(endDate).toISOString()}&type=cc`,
      );
      expect(data[0].status).to.equal('booked');
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });
      const startDate = '2020-05-01';
      const endDate = '2020-06-30';

      let error;
      try {
        await getBookedAppointments({
          startDate,
          endDate,
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v0/appointments?start_date=${moment(
          startDate,
        ).toISOString()}&end_date=${moment(endDate).toISOString()}&type=va`,
      );
      expect(global.fetch.secondCall.args[0]).to.contain(
        `/vaos/v0/appointments?start_date=${moment(
          startDate,
        ).toISOString()}&end_date=${moment(endDate).toISOString()}&type=cc`,
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });

  describe('getAppointmentRequests', () => {
    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, requests);

      const startDate = '2020-05-01';
      const endDate = '2020-06-30';

      const data = await getAppointmentRequests({
        startDate,
        endDate,
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v0/appointment_requests?start_date=2020-05-01&end_date=2020-06-30',
      );
      expect(data[0].status).to.equal('proposed');
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });
      const startDate = '2020-05-01';
      const endDate = '2020-06-30';

      let error;
      try {
        await getAppointmentRequests({
          startDate,
          endDate,
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v0/appointment_requests?start_date=2020-05-01&end_date=2020-06-30',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });

  describe('isUpcomingAppointmentOrRequest', () => {
    it('should filter future requests', () => {
      const apptRequests = [
        // canceled past - should filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(-2, 'days'), 'AM'),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // cancelled past - should filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [
            setRequestedPeriod(now.clone().subtract(22, 'days'), 'AM'),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // pending past - should filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(-2, 'days'), 'AM'),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // future within 13 - should not filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(
              now
                .clone()
                .add(395, 'days')
                .add(-1, 'days'),
              'AM',
            ),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // future - should not filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(2, 'days'), 'AM'),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
        // future canceled - should not filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(3, 'days'), 'AM'),
          ],
          vaos: {
            isExpressCare: false,
            appointmentType: APPOINTMENT_TYPES.request,
          },
        },
      ];

      const filteredRequests = apptRequests.filter(
        isUpcomingAppointmentOrRequest,
      );
      expect(
        filteredRequests.filter(
          req => req.status === APPOINTMENT_STATUS.cancelled,
        ).length,
      ).to.equal(1);
      expect(
        filteredRequests.filter(
          req => req.status === APPOINTMENT_STATUS.pending,
        ).length,
      ).to.equal(3);
      expect(
        filteredRequests.filter(req => req.status === 'Booked').length,
      ).to.equal(0);
    });
    it('should filter future confirmed appointments', () => {
      const confirmedAppts = [
        // appointment more than 395 days should not show
        {
          start: '2099-04-30T05:35:00',
          facilityId: '984',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        // appointment less than 395 days should show
        {
          start: now
            .clone()
            .add(394, 'days')
            .format(),
          facilityId: '984',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        // appointment 30 min ago should show
        {
          start: now
            .clone()
            .subtract(30, 'minutes')
            .format(),
          facilityId: '984',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        // appointment more than 1 hour ago should not show
        {
          start: now
            .clone()
            .subtract(65, 'minutes')
            .format(),
          facilityId: '984',
          vaos: {
            isPastAppointment: true,
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        },
        // video appointment less than 4 hours ago should show
        {
          start: now
            .clone()
            .subtract(230, 'minutes')
            .format(),
          vaos: {
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        },
        // video appointment more than 4 hours ago should not show
        {
          start: now
            .clone()
            .subtract(245, 'minutes')
            .format(),
          vaos: {
            isPastAppointment: true,
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        },
        // appointment with status 'NO-SHOW' should not show
        {
          description: 'NO-SHOW',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        // appointment with status 'DELETED' should not show
        {
          description: 'DELETED',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
      ];

      const filteredConfirmed = confirmedAppts.filter(
        isUpcomingAppointmentOrRequest,
      );
      expect(filteredConfirmed.length).to.equal(3);
    });

    it('should filter out appointments with status in FUTURE_APPOINTMENTS_HIDDEN_SET', () => {
      const hiddenAppts = [...FUTURE_APPOINTMENTS_HIDDEN_SET].map(
        currentStatus => ({
          description: currentStatus,
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
          facilityId: '984',
        }),
      );

      const filtered = hiddenAppts.filter(isUpcomingAppointmentOrRequest);
      expect(hiddenAppts.length).to.equal(2);
      expect(filtered.length).to.equal(0);
    });

    it('should filter out video appointments with status in FUTURE_APPOINTMENTS_HIDDEN_SET', () => {
      const hiddenAppts = [...FUTURE_APPOINTMENTS_HIDDEN_SET].map(code => ({
        description: code,
        vaos: {
          appointmentType: APPOINTMENT_TYPES.vaAppointment,
        },
      }));

      const filtered = hiddenAppts.filter(isUpcomingAppointmentOrRequest);
      expect(hiddenAppts.length).to.equal(2);
      expect(filtered.length).to.equal(0);
    });
  });

  describe('filterPastAppointments', () => {
    it('should not filter appointments that are not in hidden status set', () => {
      const appointments = [
        {
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        {
          description: 'NO-SHOW',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
        {
          description: 'CHECKED IN',
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        },
      ];

      const filtered = appointments.filter(isValidPastAppointment);

      expect(filtered.length).to.equal(3);
    });
  });

  describe('appointment practitioner', () => {
    it('should return boolean if appointment contains keyword practitioner', () => {
      const appointmentTrue = {
        participant: [
          { actor: { reference: 'Location/test' } },
          { actor: { reference: 'Practitioner/Tester', display: 'Tester' } },
        ],
      };

      const appointmentFalse = {
        participant: [{ actor: { reference: 'Location/test' } }],
      };

      const responseTrue = hasPractitioner(appointmentTrue);
      expect(responseTrue).to.be.true;

      const responseFalse = hasPractitioner(appointmentFalse);
      expect(responseFalse).to.be.false;
    });

    it('should return string of practitioner display', () => {
      const appointment = [
        { actor: { reference: 'Location/test' } },
        { actor: { reference: 'Practitioner/Tester', display: 'Tester' } },
      ];

      const response = getPractitionerDisplay(appointment);
      expect(response).to.equal('Tester');
    });
  });
});
