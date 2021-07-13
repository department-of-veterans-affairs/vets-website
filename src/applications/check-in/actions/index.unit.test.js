import { expect } from 'chai';

import {
  receivedAppointmentDetails,
  RECEIVED_APPOINTMENT_DETAILS,
} from '../actions';

describe('health care -- check in -- actions --', () => {
  it('receivedAppointmentDetails -- should return correct structure', () => {
    const action = receivedAppointmentDetails({ id: 'some-id' });
    expect(action.type).to.equal(RECEIVED_APPOINTMENT_DETAILS);
    expect(action.value).to.haveOwnProperty('id');
    expect(action.value.id).to.equal('some-id');
  });
});
