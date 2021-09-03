import { expect } from 'chai';

import {
  receivedAppointmentDetails,
  RECEIVED_APPOINTMENT_DETAILS,
  veteranHasBeenValidated,
  VETERAN_HAS_BEEN_VALIDATED,
} from '../actions';

describe('health care -- check in -- actions --', () => {
  it('receivedAppointmentDetails -- should return correct action', () => {
    const action = receivedAppointmentDetails({ id: 'some-id' });
    expect(action.type).to.equal(RECEIVED_APPOINTMENT_DETAILS);
  });
  it('receivedAppointmentDetails -- should return correct structure', () => {
    const action = receivedAppointmentDetails({ id: 'some-id' });
    expect(action.value).to.haveOwnProperty('id');
    expect(action.value.id).to.equal('some-id');
  });
  it('veteranHasBeenValidated -- should return correct action', () => {
    const action = veteranHasBeenValidated({ id: 'some-id' });
    expect(action.type).to.equal(VETERAN_HAS_BEEN_VALIDATED);
  });
  it('veteranHasBeenValidated -- should maintain correct structure', () => {
    const action = veteranHasBeenValidated({ id: 'some-id' });
    expect(action.value).to.haveOwnProperty('id');
    expect(action.value.id).to.equal('some-id');
  });
});
