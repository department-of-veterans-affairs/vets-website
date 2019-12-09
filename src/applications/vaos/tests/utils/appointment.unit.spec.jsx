import { expect } from 'chai';

import {
  getAppointmentTitle,
  filterFutureRequests,
  filterFutureConfirmedAppointments,
  sortFutureRequests,
  sortFutureConfirmedAppointments,
} from '../../utils/appointment';
import moment from 'moment';

describe('VAOS appointment helpers', () => {
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

    const filteredRequests = requests.filter(r => filterFutureRequests(r, now));
    expect(filteredRequests.length).to.equal(2);
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
});
