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
} from '../../utils/constants';
import confirmedCC from '../../api/confirmed_cc.json';
import confirmedVA from '../../api/confirmed_va.json';
import requestData from '../../api/requests.json';

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
    clinicId: ' ',
    vvsAppointments: ' ',
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
        expect(
          transformAppointment({
            ...vaAppointment,
            vdsAppointments: [
              {
                currentStatus: 'CANCELLED BY CLINIC',
              },
            ],
          }).status,
        ).to.equal(APPOINTMENT_STATUS.cancelled);
      });

      it('should return null for va appointment if in HIDE_STATUS_SET', () => {
        expect(
          transformAppointment({
            ...vaAppointment,
            vdsAppointments: [
              {
                currentStatus: 'CHECKED IN',
              },
            ],
          }).status,
        ).to.equal(null);
      });

      it('should not return null for future va appointment if not in HIDE_STATUS_SET', () => {
        expect(
          transformAppointment(
            {
              ...vaAppointment,
              vdsAppointments: [
                {
                  currentStatus: 'INPATIENT APPOINTMENT',
                },
              ],
            },
            false,
          ).status,
        ).to.equal(APPOINTMENT_STATUS.booked);
      });

      it('should return null for past va appointment if in HIDE_STATUS_SET', () => {
        expect(
          transformPastAppointment({
            ...vaAppointment,
            vdsAppointments: [
              {
                currentStatus: 'INPATIENT APPOINTMENT',
              },
            ],
          }).status,
        ).to.equal(null);
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
    describe('purposeOfVisit', () => {
      it('should be set for community care appointment request', () => {
        const appt = transformRequest({
          ...ccData,
          purposeOfVisit: 'routine-follow-up',
        });
        expect(appt.purposeOfVisit).to.equal('Follow-up/Routine');
      });

      it('should be set for VA appointment request', () => {
        const appt = transformRequest({
          ...vaData,
          purposeOfVisit: 'Routine Follow-up',
        });
        expect(appt.purposeOfVisit).to.equal('Follow-up/Routine');
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
      expect(ranges[4].label).to.equal('Show all of 2020');
      expect(ranges[4].startDate).to.include('2020-01-01T00:00:00');
      expect(ranges[4].endDate).to.include('2020-02-02T00:00:00');

      expect(ranges[5].value).to.equal(5);
      expect(ranges[5].label).to.equal('Show all of 2019');
      expect(ranges[5].startDate).to.include('2019-01-01T00:00:00');
      expect(ranges[5].endDate).to.include('2019-12-31T23:59:59');
    });
  });

  describe('filterFutureCConfirmedAppointments', () => {
    it('should filter future confirmed appointments', () => {
      const confirmed = [
        { startDate: '2099-04-30T05:35:00', facilityId: '984' },
        // appointment 30 min ago should show
        {
          startDate: now
            .clone()
            .subtract(30, 'minutes')
            .format(),
          facilityId: '984',
        },
        // appointment more than 1 hour ago should not show
        {
          startDate: now
            .clone()
            .subtract(65, 'minutes')
            .format(),
          facilityId: '984',
        },
        // video appointment less than 4 hours ago should show
        {
          vvsAppointments: [
            {
              dateTime: now
                .clone()
                .subtract(230, 'minutes')
                .format(),
            },
          ],
          facilityId: '984',
        },
        // video appointment more than 4 hours ago should not show
        {
          vvsAppointments: [
            {
              dateTime: now
                .clone()
                .subtract(245, 'minutes')
                .format(),
            },
          ],
          facilityId: '984',
        },
        // appointment with status 'NO-SHOW' should not show
        {
          vdsAppointments: [{ currentStatus: 'NO-SHOW' }],
          facilityId: '984',
        },
        // appointment with status 'DELETED' should not show
        {
          vdsAppointments: [{ currentStatus: 'DELETED' }],
          facilityId: '984',
        },
      ];

      const filteredConfirmed = confirmed.filter(a =>
        filterFutureConfirmedAppointments(a, now),
      );
      expect(filteredConfirmed.length).to.equal(3);
    });
  });

  describe('sortFutureConfirmedAppointments', () => {
    it('should sort future confirmed appointments', () => {
      const confirmed = [
        { startDate: '2099-04-30T05:35:00', facilityId: '984' },
        { startDate: '2099-04-27T05:35:00', facilityId: '984' },
      ];

      const sorted = confirmed.sort(sortFutureConfirmedAppointments);
      expect(sorted[0].startDate).to.equal('2099-04-27T05:35:00');
    });
  });

  describe('filterRequests', () => {
    it('should filter future requests', () => {
      const requests = [
        {
          status: 'Booked',
          appointmentType: 'Primary Care',
          optionDate1: now
            .clone()
            .add(2, 'days')
            .format('MM/DD/YYYY'),
        },
        {
          attributes: {
            status: 'Submitted',
            appointmentType: 'Primary Care',
            optionDate1: now
              .clone()
              .add(-2, 'days')
              .format('MM/DD/YYYY'),
          },
        },
        {
          status: 'Submitted',
          appointmentType: 'Primary Care',
          optionDate1: now
            .clone()
            .add(2, 'days')
            .format('MM/DD/YYYY'),
        },
        {
          status: 'Cancelled',
          appointmentType: 'Primary Care',
          optionDate1: now
            .clone()
            .add(3, 'days')
            .format('MM/DD/YYYY'),
        },
      ];

      const filteredRequests = requests.filter(r => filterRequests(r, now));
      expect(filteredRequests.length).to.equal(2);
    });
  });

  describe('sortFutureRequests', () => {
    it('should sort future requests', () => {
      const requests = [
        {
          appointmentType: 'Primary Care',
          optionDate1: '12/13/2019',
        },
        {
          appointmentType: 'Primary Care',
          optionDate1: '12/12/2019',
        },
        {
          appointmentType: 'Audiology (hearing aid support)',
          optionDate1: '12/12/2019',
        },
      ];

      const sortedRequests = requests.sort(sortFutureRequests);
      expect(sortedRequests[0].appointmentType).to.equal(
        'Audiology (hearing aid support)',
      );
      expect(sortedRequests[1].appointmentType).to.equal('Primary Care');
      expect(sortedRequests[1].optionDate1).to.equal('12/12/2019');
      expect(sortedRequests[2].appointmentType).to.equal('Primary Care');
      expect(sortedRequests[2].optionDate1).to.equal('12/13/2019');
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
          startDate: now
            .clone()
            .add(1, 'day')
            .format(),
          facilityId: '984',
        },
        // appointment before startDate should not show
        {
          startDate: now
            .clone()
            .subtract(100, 'day')
            .format(),
          facilityId: '984',
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
          startDate: now
            .clone()
            .subtract(1, 'day')
            .format(),
          facilityId: '984',
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
          startDate: now
            .clone()
            .subtract(1, 'day')
            .format(),
          facilityId: '984',
        },
        {
          facilityId: '984',
          startDate: now
            .clone()
            .subtract(1, 'day')
            .format(),
          vdsAppointments: [
            {
              currentStatus: 'FUTURE',
            },
          ],
        },
        {
          facilityId: '984',
          startDate: now
            .clone()
            .subtract(1, 'day')
            .format(),
          vdsAppointments: [
            {
              currentStatus: 'DELETED',
            },
          ],
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
        startDate: now
          .clone()
          .subtract(1, 'day')
          .format(),
        facilityId: '984',
      },
      {
        facilityId: '984',
        startDate: now
          .clone()
          .subtract(1, 'day')
          .format(),
        vdsAppointments: [
          {
            currentStatus: 'NO-SHOW',
          },
        ],
      },
      {
        facilityId: '984',
        startDate: now
          .clone()
          .subtract(1, 'day')
          .format(),
        vdsAppointments: [
          {
            currentStatus: 'CHECKED IN',
          },
        ],
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
  });
});
