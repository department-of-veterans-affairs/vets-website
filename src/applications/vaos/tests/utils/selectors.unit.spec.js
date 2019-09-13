import { expect } from 'chai';

import { selectPendingAppointment } from '../../utils/selectors';

describe('VAOS selectors', () => {
  describe('selectPendingAppointment', () => {
    it('should return appt matching id', () => {
      const state = {
        appointments: {
          pending: [
            {
              uniqueId: 'testing',
            },
          ],
        },
      };
      const appt = selectPendingAppointment(state, 'testing');
      expect(appt).to.equal(state.appointments.pending[0]);
    });
    it('should return null if no matching id', () => {
      const state = {
        appointments: {
          pending: null,
        },
      };
      const appt = selectPendingAppointment(state, 'testing');
      expect(appt).to.be.null;
    });
  });
});
