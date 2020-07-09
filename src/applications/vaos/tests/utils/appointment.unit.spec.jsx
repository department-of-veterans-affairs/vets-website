import { expect } from 'chai';
import moment from 'moment';
import {
  filterFutureConfirmedAppointments,
  filterRequests,
  filterPastAppointments,
  generateICS,
  getAppointmentType,
  getAppointmentTimezoneAbbreviation,
  getAppointmentTimezoneDescription,
  getMomentConfirmedDate,
  getMomentRequestOptionDate,
  getRealFacilityId,
  sortFutureConfirmedAppointments,
  sortFutureRequests,
  getPastAppointmentDateRangeOptions,
  transformAppointment,
  transformPastAppointment,
  transformRequest,
} from '../../utils/appointment';
import {
  APPOINTMENT_TYPES,
  VIDEO_TYPES,
  APPOINTMENT_STATUS,
  CANCELLED_APPOINTMENT_SET,
  PAST_APPOINTMENTS_HIDE_STATUS_SET,
  FUTURE_APPOINTMENTS_HIDE_STATUS_SET,
  FUTURE_APPOINTMENTS_HIDDEN_SET,
  PAST_APPOINTMENTS_HIDDEN_SET,
} from '../../utils/constants';
import confirmedCC from '../../api/confirmed_cc.json';
import confirmedVA from '../../api/confirmed_va.json';
import requestData from '../../api/requests.json';
import { getVARequestMock } from '../mocks/v0';
import { setRequestedPeriod } from '../mocks/helpers';

describe('VAOS appointment helpers', () => {
  const now = moment();
  const communityCareAppointmentRequest = {
    typeOfCareId: 'CC',
    timeZone: '-06:00 MDT',
  };
  const vaAppointmentRequest = {
    optionDate1: ' ',
  };
  const vaAppointment = {
    clinicId: '123',
    vvsAppointments: [],
  };
  const communityCareAppointment = {
    appointmentTime: ' ',
    timeZone: '-04:00 EDT',
  };

  describe('getAppointmentType', () => {
    it('should return community care appointment request type', () => {
      expect(getAppointmentType(communityCareAppointmentRequest)).to.equal(
        APPOINTMENT_TYPES.ccRequest,
      );
    });

    it('should return appointment request type', () => {
      expect(getAppointmentType(vaAppointmentRequest)).to.equal(
        APPOINTMENT_TYPES.request,
      );
    });

    it('should return VA appointment type', () => {
      expect(getAppointmentType(vaAppointment)).to.equal(
        APPOINTMENT_TYPES.vaAppointment,
      );
    });

    it('should return community care appointment type', () => {
      expect(getAppointmentType(communityCareAppointment)).to.equal(
        APPOINTMENT_TYPES.ccAppointment,
      );
    });
  });

  describe('transformAppointment', () => {
    const ccData = {
      ...confirmedCC.data[0].attributes,
      id: confirmedCC.data[0].id,
    };
    const vaData = {
      ...confirmedVA.data[0].attributes,
      id: confirmedVA.data[0].id,
    };

    describe('status', () => {
      it('should return booked status for cc appointment', () => {
        expect(transformAppointment(communityCareAppointment).status).to.equal(
          APPOINTMENT_STATUS.booked,
        );
      });

      it('should return pending status for request if not cancelled', () => {
        expect(transformAppointment(vaAppointmentRequest).status).to.equal(
          APPOINTMENT_STATUS.pending,
        );
      });

      it('should return cancelled status for request if cancelled', () => {
        expect(
          transformAppointment({
            ...vaAppointmentRequest,
            status: 'Cancelled',
          }).status,
        ).to.equal(APPOINTMENT_STATUS.cancelled);
      });

      it('should return pending status for cc request if not cancelled', () => {
        expect(
          transformAppointment(communityCareAppointmentRequest).status,
        ).to.equal(APPOINTMENT_STATUS.pending);
      });

      it('should return cancelled status for cc request if cancelled', () => {
        expect(
          transformAppointment({
            ...communityCareAppointmentRequest,
            status: 'Cancelled',
          }).status,
        ).to.equal(APPOINTMENT_STATUS.cancelled);
      });

      it('should return booked status for cc request if not cancelled', () => {
        expect(transformAppointment(communityCareAppointment).status).to.equal(
          APPOINTMENT_STATUS.booked,
        );
      });

      it('should return booked status for confirmed va appointment', () => {
        expect(transformAppointment(vaAppointment).status).to.equal(
          APPOINTMENT_STATUS.booked,
        );
      });

      it('should return cancelled status for cancelled va appointment', () => {
        const cancelledAppts = [...CANCELLED_APPOINTMENT_SET].map(
          currentStatus => ({
            ...vaAppointment,
            vdsAppointments: [
              {
                currentStatus,
              },
            ],
          }),
        );
        const transformed = cancelledAppts.map(a => transformAppointment(a));
        expect(transformed.length).to.equal(4);
        expect(
          transformed.filter(a => a.status === APPOINTMENT_STATUS.cancelled)
            .length,
        ).to.equal(cancelledAppts.length);
      });

      it('should return cancelled status for cancelled va appointment', () => {
        const cancelledAppts = [...CANCELLED_APPOINTMENT_SET].map(code => ({
          ...vaAppointment,
          vvsAppointments: [
            {
              status: { code },
            },
          ],
        }));
        const transformed = cancelledAppts.map(a => transformAppointment(a));
        expect(transformed.length).to.equal(4);
        expect(
          transformed.filter(a => a.status === APPOINTMENT_STATUS.cancelled)
            .length,
        ).to.equal(cancelledAppts.length);
      });

      it('should return null for future va appointment if in HIDE_STATUS_SET', () => {
        const nullAppts = [...FUTURE_APPOINTMENTS_HIDE_STATUS_SET].map(
          currentStatus => ({
            ...vaAppointment,
            vdsAppointments: [
              {
                currentStatus,
              },
            ],
          }),
        );
        const transformed = nullAppts.map(a => transformAppointment(a));
        expect(transformed.length).to.equal(2);
        expect(transformed.filter(a => a.status === null).length).to.equal(
          nullAppts.length,
        );
      });

      it('should return null for future video appointment if in HIDE_STATUS_SET', () => {
        const nullAppts = [...FUTURE_APPOINTMENTS_HIDE_STATUS_SET].map(
          code => ({
            ...vaAppointment,
            vvsAppointments: [
              {
                status: {
                  code,
                },
              },
            ],
          }),
        );
        const transformed = nullAppts.map(a => transformAppointment(a));
        expect(transformed.length).to.equal(2);
        expect(transformed.filter(a => a.status === null).length).to.equal(
          nullAppts.length,
        );
      });

      it('should return null for past va appointment if in HIDE_STATUS_SET', () => {
        const nullAppts = [...PAST_APPOINTMENTS_HIDE_STATUS_SET].map(
          currentStatus => ({
            ...vaAppointment,
            vdsAppointments: [
              {
                currentStatus,
              },
            ],
          }),
        );
        const transformed = nullAppts.map(a => transformPastAppointment(a));
        expect(transformed.length).to.equal(11);
        expect(transformed.filter(a => a.status === null).length).to.equal(
          nullAppts.length,
        );
      });

      it('should return null for past video appointment if in HIDE_STATUS_SET', () => {
        const nullAppts = [...PAST_APPOINTMENTS_HIDE_STATUS_SET].map(code => ({
          ...vaAppointment,
          vvsAppointments: [
            {
              status: {
                code,
              },
            },
          ],
        }));
        const transformed = nullAppts.map(a => transformPastAppointment(a));
        expect(transformed.length).to.equal(11);
        expect(transformed.filter(a => a.status === null).length).to.equal(
          nullAppts.length,
        );
      });
    });

    describe('isCommunityCare', () => {
      it('should return true for CC request', () => {
        const appointment = transformAppointment(ccData);
        expect(appointment.isCommunityCare).to.be.true;
      });

      it('should return false for VA request', () => {
        const appointment = transformAppointment(vaData);
        expect(appointment.isCommunityCare).to.be.false;
      });
    });

    describe('videoType', () => {
      it('should be mobile gfe', () => {
        const appointment = transformAppointment({
          ...vaData,
          vvsAppointments: [
            {
              appointmentKind: 'MOBILE_GFE',
            },
          ],
        });
        expect(appointment.videoType).to.equal(VIDEO_TYPES.gfe);
      });

      it('should be video connect', () => {
        const appointment = transformAppointment({
          ...vaData,
          vvsAppointments: [{}],
        });
        expect(appointment.videoType).to.equal(VIDEO_TYPES.videoConnect);
      });

      it('should be null', () => {
        const appointment = transformAppointment(ccData);
        expect(appointment.videoType).to.null;
      });
    });

    describe('videoLink', () => {
      it('should exist', () => {
        const appointment = transformAppointment({
          ...vaData,
          vvsAppointments: [
            {
              patients: [
                {
                  virtualMeetingRoom: {
                    url: 'https://va.gov',
                  },
                },
              ],
            },
          ],
        });
        expect(appointment.videoLink).to.equal('https://va.gov');
      });
    });

    describe('duration', () => {
      it('should return the default appointment duration for CC', () => {
        const appt = transformAppointment(ccData);
        expect(appt.duration).to.equal(60);
      });

      it('should return the appointment duration for VA appointment', () => {
        const appt = transformAppointment({
          ...vaData,
          vdsAppointments: [{ appointmentLength: 30 }],
        });
        expect(appt.duration).to.equal(30);
      });
    });
  });

  describe('transformRequest', () => {
    const ccData = {
      ...requestData.data.find(req =>
        req.attributes.typeOfCareId.startsWith('CC'),
      ).attributes,
      id: requestData.data.find(req =>
        req.attributes.typeOfCareId.startsWith('CC'),
      ).id,
    };
    const vaData = {
      ...requestData.data.find(
        req => !req.attributes.typeOfCareId.startsWith('CC'),
      ).attributes,
      id: requestData.data.find(
        req => !req.attributes.typeOfCareId.startsWith('CC'),
      ).id,
    };
    describe('dateOptions', () => {
      it('should return array', () => {
        const appt = transformRequest({
          ...vaData,
          optionDate1: now,
          optionTime1: 'PM',
          optionDate2: now,
          optionTime2: 'AM',
          optionDate3: moment().add(1, 'days'),
          optionTime3: 'PM',
        });
        expect(appt.dateOptions[0].optionTime).to.equal('AM');
        expect(appt.dateOptions.length).to.equal(3);
      });
    });
    describe('reason', () => {
      it('should be set for community care appointment request', () => {
        const appt = transformRequest({
          ...ccData,
          purposeOfVisit: 'routine-follow-up',
        });
        expect(appt.reason).to.equal('Follow-up/Routine');
      });

      it('should be set for VA appointment request', () => {
        const appt = transformRequest({
          ...vaData,
          purposeOfVisit: 'Routine Follow-up',
        });
        expect(appt.reason).to.equal('Follow-up/Routine');
      });
      it('should be set from reasonForVisit for expresss care appointment request', () => {
        const appt = transformRequest({
          ...vaData,
          typeOfCareId: 'CR1',
          purposeOfVisit: 'Routine Follow-up',
          reasonForVisit: 'Testing',
        });
        expect(appt.reason).to.equal('Testing');
      });
    });
  });

  // NOTE: Can't do negative test since app assumes data is valid. This will result
  // in a nasty subtle bug when startDate or dateTime is undefined. moment(undefined)
  // is the same as moment() which returns the current date and time.
  describe('getMomentConfirmedDate', () => {
    it('should return a "moment.js" date object', () => {
      const confirmedDate = getMomentConfirmedDate(
        communityCareAppointmentRequest,
      );
      expect(moment.isMoment(confirmedDate)).to.be.true;
    });

    it('should return appointment date object for CC appointment', () => {
      const appt = {
        ...communityCareAppointmentRequest,
        appointmentTime: '12/13/2019 17:11:00',
      };
      expect(getMomentConfirmedDate(appt).format()).to.equal(
        '2019-12-13T11:11:00-06:00',
      );
    });

    describe('should return a "moment.js" date object for video visit appointment (timezone)', () => {
      it('vvsAppointments defined', () => {
        const appt = {
          // facilityId implies timezone
          facilityId: '983',
          vvsAppointments: [
            {
              dateTime: now,
              appointmentKind: 'MOBILE_GFE',
            },
          ],
        };
        expect(getMomentConfirmedDate(appt)).to.deep.equal(
          now.clone().tz('America/Denver'),
        );
      });

      it('startDate defined', () => {
        const appt = {
          // facilityId implies timezone
          facilityId: '578',
          startDate: now,
        };
        expect(getMomentConfirmedDate(appt)).to.deep.equal(
          now.clone().tz('America/Chicago'),
        );
      });
    });

    describe('should return a "moment.js" date object for video visit appointment (no timezone)', () => {
      it('vvsAppointments defined', () => {
        const appt = {
          vvsAppointments: [
            {
              dateTime: now,
              appointmentKind: 'MOBILE_GFE',
            },
          ],
        };
        expect(getMomentConfirmedDate(appt)).to.deep.equal(now);
      });

      it('startDate defined', () => {
        const appt = {
          startDate: now,
        };
        expect(getMomentConfirmedDate(appt)).to.deep.equal(now);
      });
    });
  });

  describe('getMomentRequestOptionDate', () => {
    it('should return a moment.js object', () => {
      const dt = getMomentRequestOptionDate(now);
      expect(moment.isMoment(dt)).to.be.true;
    });
  });

  describe('getAppointmentTimezoneAbbreviation', () => {
    it('should return the timezone for a community care appointment', () => {
      expect(getAppointmentTimezoneAbbreviation('-04:00 EDT')).to.equal('ET');
    });

    it('should return the timezone for a community care appointment request', () => {
      expect(getAppointmentTimezoneAbbreviation(null, '578')).to.equal('CT');
    });
  });

  describe('getAppointmentTimezoneDescription', () => {
    it('should return the timezone', () => {
      expect(getAppointmentTimezoneDescription('-04:00 EDT')).to.equal(
        'Eastern time',
      );
    });
  });

  describe('getPastAppointmentDateRangeOptions', () => {
    const ranges = getPastAppointmentDateRangeOptions(moment('2020-02-02'));
    it('should return 6 correct date ranges for dropdown', () => {
      expect(ranges.length).to.equal(6);

      expect(ranges[0].value).to.equal(0);
      expect(ranges[0].label).to.equal('Past 3 months');
      expect(ranges[0].startDate).to.include('2019-11-02T00:00:00');
      expect(ranges[0].endDate).to.include('2020-02-02T00:00:00');

      expect(ranges[1].value).to.equal(1);
      expect(ranges[1].label).to.equal('Sept. 2019 – Nov. 2019');
      expect(ranges[1].startDate).to.include('2019-09-01T00:00:00');
      expect(ranges[1].endDate).to.include('2019-11-30T23:59:59');

      expect(ranges[2].value).to.equal(2);
      expect(ranges[2].label).to.equal('June 2019 – Aug. 2019');
      expect(ranges[2].startDate).to.include('2019-06-01T00:00:00');
      expect(ranges[2].endDate).to.include('2019-08-31T23:59:59');

      expect(ranges[3].value).to.equal(3);
      expect(ranges[3].label).to.equal('March 2019 – May 2019');
      expect(ranges[3].startDate).to.include('2019-03-01T00:00:00');
      expect(ranges[3].endDate).to.include('2019-05-31T23:59:59');

      expect(ranges[4].value).to.equal(4);
      expect(ranges[4].label).to.equal('All of 2020');
      expect(ranges[4].startDate).to.include('2020-01-01T00:00:00');
      expect(ranges[4].endDate).to.include('2020-02-02T00:00:00');

      expect(ranges[5].value).to.equal(5);
      expect(ranges[5].label).to.equal('All of 2019');
      expect(ranges[5].startDate).to.include('2019-01-01T00:00:00');
      expect(ranges[5].endDate).to.include('2019-12-31T23:59:59');
    });
  });

  describe('filterFutureCConfirmedAppointments', () => {
    it('should filter future confirmed appointments', () => {
      const confirmed = [
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

      const filteredConfirmed = confirmed.filter(a =>
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
      const confirmed = [
        { start: moment('2099-04-30T05:35:00'), facilityId: '984' },
        { start: moment('2099-04-27T05:35:00'), facilityId: '983' },
      ];

      const sorted = confirmed.sort(sortFutureConfirmedAppointments);
      expect(sorted[0].facilityId).to.equal('983');
    });
  });

  describe('filterRequests', () => {
    it('should filter future requests', () => {
      const requests = [
        // canceled past - should filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(-2, 'days'), 'AM'),
          ],
          vaos: { isPastAppointment: true },
        },
        // pending past - should filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(-2, 'days'), 'AM'),
          ],
          vaos: { isPastAppointment: true },
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
          vaos: { isPastAppointment: false },
        },
        // future past 13 - should filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(
              now
                .clone()
                .add(13, 'months')
                .add(1, 'days'),
              'AM',
            ),
          ],
          vaos: { isPastAppointment: false },
        },
        // future - should not filter out
        {
          status: APPOINTMENT_STATUS.pending,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(2, 'days'), 'AM'),
          ],
          vaos: { isPastAppointment: false },
        },
        // future canceled - should not filter out
        {
          status: APPOINTMENT_STATUS.cancelled,
          requestedPeriod: [
            setRequestedPeriod(now.clone().add(3, 'days'), 'AM'),
          ],
          vaos: { isPastAppointment: false },
        },
      ];

      const filteredRequests = requests.filter(r => filterRequests(r, now));
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
      const requests = [
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

      const sortedRequests = requests.sort(sortFutureRequests);
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

  xdescribe('sortMessages', () => {});

  describe('getRealFacilityId', () => {
    it('should return the real facility id for not production environemnts', () => {
      expect(getRealFacilityId('983')).to.equal('442');
      expect(getRealFacilityId('984')).to.equal('552');
    });
  });

  describe('generateICS', () => {
    it('should generate valid ICS calendar commands', () => {
      const momentDate = moment(now);
      const dtStamp = momentDate.format('YYYYMMDDTHHmmss');
      const dtStart = momentDate.format('YYYYMMDDTHHmmss');
      const dtEnd = momentDate
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss');

      const ics = generateICS(
        'Community Care',
        '. ',
        'Address 1 City, State Zip',
        dtStart,
        dtEnd,
      );
      expect(ics).to.contain('BEGIN:VCALENDAR');
      expect(ics).to.contain('VERSION:2.0');
      expect(ics).to.contain('PRODID:VA');
      expect(ics).to.contain('BEGIN:VEVENT');
      expect(ics).to.contain('UID:');
      expect(ics).to.contain('SUMMARY:Community Care');
      expect(ics).to.contain('DESCRIPTION:. ');
      expect(ics).to.contain('LOCATION:Address 1 City, State Zip');
      expect(ics).to.contain(`DTSTAMP:${dtStamp}`);
      expect(ics).to.contain(`DTSTART:${dtStart}`);
      expect(ics).to.contain(`DTEND:${dtEnd}`);
      expect(ics).to.contain('END:VEVENT');
      expect(ics).to.contain('END:VCALENDAR');
    });
    it('should properly chunk long descriptions', () => {
      const momentDate = moment(now);
      const dtStamp = momentDate.format('YYYYMMDDTHHmmss');
      const dtStart = momentDate.format('YYYYMMDDTHHmmss');
      const dtEnd = momentDate
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss');
      const description = `Testing long line descriptions
Testing long descriptions Testing long descriptions Testing long descriptions
Testing long descriptions Testing long descriptions Testing long descriptions
Testing long descriptions`;

      const ics = generateICS(
        'Community Care',
        description,
        'Address 1 City, State Zip',
        dtStart,
        dtEnd,
      );
      expect(ics).to.contain('BEGIN:VCALENDAR');
      expect(ics).to.contain('VERSION:2.0');
      expect(ics).to.contain('PRODID:VA');
      expect(ics).to.contain('BEGIN:VEVENT');
      expect(ics).to.contain('UID:');
      expect(ics).to.contain('SUMMARY:Community Care');
      expect(ics).to.contain(
        'DESCRIPTION:Testing long line descriptions\\nTesting long descriptions Test\r\n\ting long descriptions Testing long descriptions\\nTesting long descriptions\r\n\t Testing long descriptions Testing long descriptions\\nTesting long descrip\r\n\ttions',
      );
      expect(ics).to.contain('LOCATION:Address 1 City, State Zip');
      expect(ics).to.contain(`DTSTAMP:${dtStamp}`);
      expect(ics).to.contain(`DTSTART:${dtStart}`);
      expect(ics).to.contain(`DTEND:${dtEnd}`);
      expect(ics).to.contain('END:VEVENT');
      expect(ics).to.contain('END:VCALENDAR');
    });
  });
});
