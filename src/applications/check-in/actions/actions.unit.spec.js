import { expect } from 'chai';

import {
  receivedAppointmentDetails,
  RECEIVED_APPOINTMENT_DETAILS,
  tokenWasValidated,
  TOKEN_WAS_VALIDATED,
} from './index';

describe('check inactions', () => {
  describe('actions', () => {
    describe('receivedAppointmentDetails', () => {
      it('should return correct action', () => {
        const action = receivedAppointmentDetails({ id: 'some-id' });
        expect(action.type).to.equal(RECEIVED_APPOINTMENT_DETAILS);
      });
      it('should return correct structure', () => {
        const action = receivedAppointmentDetails(
          { id: 'some-id' },
          'some-token',
        );
        expect(action.value.appointment).to.haveOwnProperty('id');
        expect(action.value.appointment.id).to.equal('some-id');
        expect(action.value.context).to.haveOwnProperty('token');
        expect(action.value.context.token).to.equal('some-token');
      });
    });
    describe('tokenWasValidated', () => {
      it('should return correct action', () => {
        const action = tokenWasValidated();
        expect(action.type).to.equal(TOKEN_WAS_VALIDATED);
      });
      it('should return correct structure', () => {
        const data = {};
        const token = 'some-token';
        const scope = 'some-scope';
        const action = tokenWasValidated(data, token, scope);
        expect(action.data).to.haveOwnProperty('context');
        expect(action.data.context).to.haveOwnProperty('token');
        expect(action.data.context.token).to.equal('some-token');
        expect(action.data.context).to.haveOwnProperty('scope');
        expect(action.data.context.scope).to.equal('some-scope');
        expect(action.data).to.haveOwnProperty('appointments');
      });
    });
  });
});
