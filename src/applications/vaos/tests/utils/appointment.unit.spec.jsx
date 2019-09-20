import { expect } from 'chai';

import { getAppointmentId, getAppointmentTitle } from '../../utils/appointment';

describe('VAOS appointment helpers', () => {
  describe('getAppointmentId', () => {
    it('should return id for CC', () => {
      const id = getAppointmentId({
        appointmentRequestId: '1234',
      });
      expect(id).to.equal('1234');
    });

    it('should return id for video appt', () => {
      const id = getAppointmentId({
        vvsAppointments: [{ id: '1234' }],
      });
      expect(id).to.equal('1234');
    });

    it('should return id for VA facility appt', () => {
      const id = getAppointmentId({
        startDate: '2019-09-20T10:00:00',
        clinicId: '233',
        facilityId: '555',
      });
      expect(id).to.equal('va-555-233-2019-09-20T10:00:00');
    });
  });

  describe('getAppointmentTitle', () => {
    it('should return title for CC', () => {
      const id = getAppointmentTitle({
        appointmentRequestId: '1234',
        providerPractice: 'Test Practice',
      });
      expect(id).to.equal('Community Care visit - Test Practice');
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
      expect(id).to.equal('Video visit - First Last');
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
      expect(id).to.equal('VA visit - UNREADABLE NAME');
    });
  });
});
