import { expect } from 'chai';
import moment from 'moment';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  filterFutureConfirmedAppointments,
  filterPastAppointments,
  filterRequests,
  getBookedAppointments,
  getAppointmentRequests,
  isVideoAppointment,
  isVideoGFE,
  sortFutureConfirmedAppointments,
  sortFutureRequests,
} from '../../../services/appointment';
import {
  transformConfirmedAppointments,
  transformPendingAppointments,
} from '../../../services/appointment/transformers';
import {
  getVAAppointmentMock,
  getVideoAppointmentMock,
  getVARequestMock,
} from '../../mocks/v0';
import confirmed from '../../../api/confirmed_va.json';
import requests from '../../../api/requests.json';
import { setRequestedPeriod } from '../../mocks/helpers';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  VIDEO_TYPES,
  FUTURE_APPOINTMENTS_HIDDEN_SET,
  FUTURE_APPOINTMENTS_HIDE_STATUS_SET,
  PAST_APPOINTMENTS_HIDDEN_SET,
  PAST_APPOINTMENTS_HIDE_STATUS_SET,
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
        '/vaos/v0/appointments?start_date=2020-05-01&end_date=2020-06-30&type=cc',
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
        '/vaos/v0/appointments?start_date=2020-05-01&end_date=2020-06-30&type=cc',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });

  describe('isVideoAppointment', () => {
    it('should return false if confirmed non video', () => {
      const confirmedVA = transformConfirmedAppointments([
        {
          ...getVAAppointmentMock().attributes,
        },
      ])[0];
      expect(isVideoAppointment(confirmedVA)).to.equal(false);
    });

    it('should return false if confirmed non video', () => {
      const confirmedVideo = transformConfirmedAppointments([
        {
          ...getVideoAppointmentMock().attributes,
        },
      ])[0];

      expect(isVideoAppointment(confirmedVideo)).to.equal(true);
    });

    it('should return false if non video request', () => {
      const request = transformPendingAppointments([
        {
          ...getVARequestMock().attributes,
        },
      ])[0];

      expect(isVideoAppointment(request)).to.equal(false);
    });

    it('should return false if non video request', () => {
      const request = transformPendingAppointments([
        {
          ...getVARequestMock().attributes,
          visitType: 'Video Conference',
        },
      ])[0];

      expect(isVideoAppointment(request)).to.equal(true);
    });
  });

  describe('isVideoGFE', () => {
    it('should return false if confirmed non gfe', () => {
      const confirmedVA = transformConfirmedAppointments([
        {
          ...getVAAppointmentMock().attributes,
        },
      ])[0];

      expect(isVideoGFE(confirmedVA)).to.equal(false);
    });

    it('should return false if video but non gfe', () => {
      const confirmedVideo = transformConfirmedAppointments([
        {
          ...getVideoAppointmentMock().attributes,
        },
      ])[0];
      expect(isVideoGFE(confirmedVideo)).to.equal(false);
    });

    it('should return true if confirmed gfe', () => {
      const mock = getVideoAppointmentMock();
      const gfe = transformConfirmedAppointments([
        {
          ...mock.attributes,
          vvsAppointments: [
            {
              ...mock.attributes.vvsAppointments[0],
              appointmentKind: 'MOBILE_GFE',
            },
          ],
        },
      ])[0];

      expect(isVideoGFE(gfe)).to.equal(true);
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

  describe('filterFutureCConfirmedAppointments', () => {
    it('should filter future confirmed appointments', () => {
      const confirmedAppts = [
        // appointment more than 395 days should not show
        { start: '2099-04-30T05:35:00', facilityId: '984', vaos: {} },
        // appointment less than 395 days should show
        {
          start: now
            .clone()
            .add(394, 'days')
            .format(),
          facilityId: '984',
          vaos: {},
        },
        // appointment 30 min ago should show
        {
          start: now
            .clone()
            .subtract(30, 'minutes')
            .format(),
          facilityId: '984',
          vaos: {},
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
          },
        },
        // video appointment less than 4 hours ago should show
        {
          start: now
            .clone()
            .subtract(230, 'minutes')
            .format(),
          vaos: {
            videoType: VIDEO_TYPES.videoConnect,
          },
        },
        // video appointment more than 4 hours ago should not show
        {
          start: now
            .clone()
            .subtract(245, 'minutes')
            .format(),
          vaos: {
            videoType: VIDEO_TYPES.videoConnect,
            isPastAppointment: true,
          },
        },
        // appointment with status 'NO-SHOW' should not show
        {
          description: 'NO-SHOW',
          vaos: {},
        },
        // appointment with status 'DELETED' should not show
        {
          description: 'DELETED',
          vaos: {},
        },
      ];

      const filteredConfirmed = confirmedAppts.filter(a =>
        filterFutureConfirmedAppointments(a, now),
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

      const filtered = hiddenAppts.filter(a =>
        filterFutureConfirmedAppointments(a, now),
      );
      expect(hiddenAppts.length).to.equal(2);
      expect(filtered.length).to.equal(0);
    });

    it('should filter out video appointments with status in FUTURE_APPOINTMENTS_HIDDEN_SET', () => {
      const hiddenAppts = [...FUTURE_APPOINTMENTS_HIDDEN_SET].map(code => ({
        description: code,
        vaos: {
          appointmentType: APPOINTMENT_TYPES.vaAppointment,
          videoType: VIDEO_TYPES.videoConnect,
        },
      }));

      const filtered = hiddenAppts.filter(a =>
        filterFutureConfirmedAppointments(a, now),
      );
      expect(hiddenAppts.length).to.equal(2);
      expect(filtered.length).to.equal(0);
    });

    it('should filter out past appointments with status in PAST_APPOINTMENTS_HIDDEN_SET', () => {
      const hiddenAppts = [...PAST_APPOINTMENTS_HIDDEN_SET].map(
        currentStatus => ({
          description: currentStatus,
          vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
        }),
      );

      const filtered = hiddenAppts.filter(a => filterPastAppointments(a, now));
      expect(hiddenAppts.length).to.equal(5);
      expect(filtered.length).to.equal(0);
    });

    it('should filter out past video appointments with status in PAST_APPOINTMENTS_HIDDEN_SET', () => {
      const hiddenAppts = [...PAST_APPOINTMENTS_HIDDEN_SET].map(code => ({
        description: code,
        vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
      }));

      const filtered = hiddenAppts.filter(a => filterPastAppointments(a, now));
      expect(hiddenAppts.length).to.equal(5);
      expect(filtered.length).to.equal(0);
    });
  });

  describe('sortFutureConfirmedAppointments', () => {
    it('should sort future confirmed appointments', () => {
      const confirmedAppts = [
        { start: moment('2099-04-30T05:35:00'), facilityId: '984' },
        { start: moment('2099-04-27T05:35:00'), facilityId: '983' },
      ];

      const sorted = confirmedAppts.sort(sortFutureConfirmedAppointments);
      expect(sorted[0].facilityId).to.equal('983');
    });
  });

  describe('filterRequests', () => {
    it('should filter future requests', () => {
      const apptRequests = [
        // canceled past - should filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(-2, 'days'), 'AM'),
          ],
        },
        // cancelled past - should filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [
            setRequestedPeriod(now.clone().subtract(22, 'days'), 'AM'),
          ],
        },
        // pending past - should filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(-2, 'days'), 'AM'),
          ],
        },
        // future within 13 - should not filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(
              now
                .clone()
                .add(13, 'months')
                .add(-1, 'days'),
              'AM',
            ),
          ],
        },
        // future - should not filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(2, 'days'), 'AM'),
          ],
        },
        // future canceled - should not filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(3, 'days'), 'AM'),
          ],
        },
      ];

      const filteredRequests = apptRequests.filter(r => filterRequests(r, now));
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
  });

  describe('sortFutureRequests', () => {
    it('should sort future requests', () => {
      const apptRequests = [
        {
          id: 'third',
          type: {
            coding: [{ display: 'Primary Care' }],
          },
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(4, 'days'), 'AM'),
          ],
        },
        {
          id: 'first',
          type: {
            coding: [{ display: 'Audiology (hearing aid support)' }],
          },
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(3, 'days'), 'AM'),
          ],
        },
        {
          id: 'second',
          type: {
            coding: [{ display: 'Primary Care' }],
          },
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(3, 'days'), 'AM'),
          ],
        },
      ];

      const sortedRequests = apptRequests.sort(sortFutureRequests);
      expect(sortedRequests[0].id).to.equal('first');
      expect(sortedRequests[1].id).to.equal('second');
      expect(sortedRequests[2].id).to.equal('third');
    });
  });

  describe('filterPastAppointments', () => {
    it('should filter appointments that are not within startDate, endDates', () => {
      const today = moment().endOf('day');
      const threeMonthsAgo = now
        .clone()
        .subtract(3, 'month')
        .startOf('day');

      const appointments = [
        // appointment in future should not show
        {
          start: now
            .clone()
            .add(1, 'day')
            .format(),
          vaos: {},
        },
        // appointment before startDate should not show
        {
          start: now
            .clone()
            .subtract(100, 'day')
            .format(),
          vaos: {},
        },
      ];

      const filtered = appointments.filter(appt =>
        filterPastAppointments(appt, threeMonthsAgo, today),
      );
      expect(filtered.length).to.equal(0);
    });

    it('should not filter appointments that are not within startDate, endDates', () => {
      const today = moment().endOf('day');
      const threeMonthsAgo = now
        .clone()
        .subtract(3, 'month')
        .startOf('day');

      const appointments = [
        // appointment within range should show
        {
          start: now
            .clone()
            .subtract(1, 'day')
            .format(),
          vaos: {},
        },
      ];

      const filtered = appointments.filter(appt =>
        filterPastAppointments(appt, threeMonthsAgo, today),
      );
      expect(filtered.length).to.equal(1);
    });

    it('should filter appointments that are in hidden status set', () => {
      const today = moment().endOf('day');
      const threeMonthsAgo = now
        .clone()
        .subtract(3, 'month')
        .startOf('day');

      const appointments = [
        // appointment within range should show
        {
          start: now
            .clone()
            .subtract(1, 'day')
            .format(),
          vaos: {},
        },
        {
          facilityId: '984',
          start: now
            .clone()
            .subtract(1, 'day')
            .format(),
          description: 'FUTURE',
          vaos: {
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        },
        {
          start: now
            .clone()
            .subtract(1, 'day')
            .format(),
          description: 'DELETED',
          vaos: {
            appointmentType: APPOINTMENT_TYPES.vaAppointment,
          },
        },
      ];

      const filtered = appointments.filter(appt =>
        filterPastAppointments(appt, threeMonthsAgo, today),
      );
      expect(filtered.length).to.equal(1);
    });
  });

  it('should not filter appointments that are not in hidden status set', () => {
    const today = moment().endOf('day');
    const threeMonthsAgo = now
      .clone()
      .subtract(3, 'month')
      .startOf('day');

    const appointments = [
      // appointment within range should show
      {
        start: now
          .clone()
          .subtract(1, 'day')
          .format(),
        vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
      },
      {
        start: now
          .clone()
          .subtract(1, 'day')
          .format(),
        description: 'NO-SHOW',
        vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
      },
      {
        facilityId: '984',
        start: now
          .clone()
          .subtract(1, 'day')
          .format(),
        description: 'CHECKED IN',
        vaos: { appointmentType: APPOINTMENT_TYPES.vaAppointment },
      },
    ];

    const filtered = appointments.filter(appt =>
      filterPastAppointments(appt, threeMonthsAgo, today),
    );

    expect(filtered.length).to.equal(3);
  });
});
