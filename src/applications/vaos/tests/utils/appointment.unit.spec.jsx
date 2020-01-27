import { expect } from 'chai';

import {
  getAppointmentTitle,
  filterRequests,
  filterFutureConfirmedAppointments,
  sentenceCase,
  sortFutureRequests,
  sortFutureConfirmedAppointments,
  getAppointmentDuration,
  getAppointmentAddress,
  generateICS,
} from '../../utils/appointment';
import moment from 'moment';

describe('VAOS appointment helpers', () => {
  // const communityCareAppointmentRequest = {
  //   typeOfCareId: 'CC',
  // };
  const vaAppointmentRequest = {
    optionDate1: ' ',
  };
  const vaAppointment = {
    clinicId: ' ',
    vvsAppointments: ' ',
  };
  const communityCareAppointment = {
    appointmentTime: ' ',
  };

  describe('sentenceCase', () => {
    it('should return a string in sentence case', () => {
      expect(sentenceCase('Apples and Oranges')).to.equal('Apples and oranges');
    });

    it('should ignore capital words', () => {
      expect(sentenceCase('MOVE! Weight Management')).to.equal(
        'MOVE! weight management',
      );
    });
  });

  describe('getAppointmentTitle', () => {
    it('should return title for CC', () => {
      const id = getAppointmentTitle({
        appointmentTime: '1234',
        providerPractice: 'Test Practice',
      });
      expect(id).to.equal('Community Care appointment');
    });

    it('should return title for video appt', () => {
      const id = getAppointmentTitle({
        vvsAppointments: [
          {
            id: '1234',
            providers: {
              provider: [
                {
                  name: {
                    firstName: 'FIRST',
                    lastName: 'LAST',
                  },
                },
              ],
            },
          },
        ],
      });
      expect(id).to.equal('VA Video Connect');
    });

    it('should return title for VA facility appt', () => {
      const id = getAppointmentTitle({
        vdsAppointments: [
          {
            clinic: {
              name: 'UNREADABLE NAME',
            },
          },
        ],
      });
      expect(id).to.equal('VA visit');
    });
  });

  const now = moment();

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
    ];

    const filteredConfirmed = confirmed.filter(a =>
      filterFutureConfirmedAppointments(a, now),
    );
    expect(filteredConfirmed.length).to.equal(3);
  });

  it('should sort future confirmed appointments', () => {
    const confirmed = [
      { startDate: '2099-04-30T05:35:00', facilityId: '984' },
      { startDate: '2099-04-27T05:35:00', facilityId: '984' },
    ];

    const sorted = confirmed.sort(sortFutureConfirmedAppointments);
    expect(sorted[0].startDate).to.equal('2099-04-27T05:35:00');
  });

  it('should filter requests', () => {
    const requests = [
      {
        status: 'Booked', // booked - should not show
        appointmentType: 'Primary Care',
        optionDate1: now
          .clone()
          .add(2, 'days')
          .format('MM/DD/YYYY'),
      },
      {
        status: 'Submitted', // open past date - should show
        appointmentType: 'Primary Care',
        optionDate1: now
          .clone()
          .subtract(2, 'days')
          .format('MM/DD/YYYY'),
      },
      {
        status: 'Submitted', // future date - should show
        appointmentType: 'Primary Care',
        optionDate1: now
          .clone()
          .add(2, 'days')
          .format('MM/DD/YYYY'),
      },
      {
        status: 'Cancelled', // cancelled future date - should show
        appointmentType: 'Primary Care',
        optionDate1: now
          .clone()
          .add(3, 'days')
          .format('MM/DD/YYYY'),
      },
      {
        status: 'Cancelled', // cancelled past date - should not show
        appointmentType: 'Primary Care',
        optionDate1: now
          .clone()
          .add(-3, 'days')
          .format('MM/DD/YYYY'),
      },
    ];

    const filteredRequests = requests.filter(r => filterRequests(r, now));
    expect(filteredRequests.length).to.equal(3);
  });

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

  describe('getAppointmentDuration', () => {
    it('should return the default appointment duration', () => {
      expect(getAppointmentDuration({})).to.equal(60);
    });
    it('should return the appointment duration for VA appointment', () => {
      expect(
        getAppointmentDuration({
          ...vaAppointment,
          vdsAppointments: [{ appointmentLength: 30 }],
        }),
      ).to.equal(30);
    });
  });

  describe('getAppointmentAddress', () => {
    it('should return address for video appointment', () => {
      const appt = {
        vvsAppointments: [
          {
            dateTime: now,
            appointmentKind: 'MOBILE_GFE',
          },
        ],
      };
      expect(getAppointmentAddress(appt)).to.equal('Video conference');
    });

    it('should return address for community care appointment', () => {
      const appt = {
        ...communityCareAppointment,
        address: {
          street: 'Street',
          city: 'City',
          state: 'State',
          zipCode: 'Zipcode',
        },
      };
      expect(getAppointmentAddress(appt)).to.equal(
        'Street City, State Zipcode',
      );
    });

    it('should return address for facility if defined', () => {
      const facility = {
        address: {
          physical: {
            address1: 'Address 1',
            city: 'City',
            state: 'State',
            zip: 'Zip',
          },
        },
      };
      expect(getAppointmentAddress(vaAppointmentRequest, facility)).to.equal(
        'Address 1 City, State Zip',
      );
    });

    it('should return undefined for everything else', () => {
      expect(getAppointmentAddress(vaAppointmentRequest, null)).to.be.undefined;
    });
  });

  describe('generateICS', () => {
    it('should generate valid ICS calendar commands', () => {
      const appt = {
        typeOfCareId: 'CC',
        appointmentTime: now,
        timeZone: 'UTC',
      };

      const facility = {
        address: {
          physical: {
            address1: 'Address 1',
            city: 'City',
            state: 'State',
            zip: 'Zip',
          },
        },
      };

      const momentDate = moment(now);
      const dtStamp = momentDate.format('YYYYMMDDTHHmmss');
      const dtStart = momentDate.format('YYYYMMDDTHHmmss');
      const dtEnd = momentDate
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss');
      const ics = generateICS(appt, facility);
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
