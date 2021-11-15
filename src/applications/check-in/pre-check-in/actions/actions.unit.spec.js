import { expect } from 'chai';

import {
  appointmentWAsCheckedInto,
  APPOINTMENT_WAS_CHECKED_INTO,
} from './index';

describe('check in actions', () => {
  describe('actions', () => {
    describe('appointmentWAsCheckedInto', () => {
      it('should return correct action', () => {
        const action = appointmentWAsCheckedInto({
          appointmentIen: 'some-ien',
        });
        expect(action.type).to.equal(APPOINTMENT_WAS_CHECKED_INTO);
      });
      it('should return correct structure', () => {
        const action = appointmentWAsCheckedInto({
          appointmentIen: 'some-ien',
        });
        expect(action.payload).to.haveOwnProperty('appointment');
        expect(action.payload.appointment.appointmentIen).to.equal('some-ien');
      });
    });
  });
});
