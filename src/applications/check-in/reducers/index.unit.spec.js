import { expect } from 'chai';

import reducer from './index';

import { receivedAppointmentDetails } from '../actions';

describe('check-in', () => {
  describe('reducer', () => {
    it('should set appointment data to true', () => {
      const action = receivedAppointmentDetails();
      const state = reducer.checkInData(undefined, action);
      expect(state).haveOwnProperty('appointment');
    });
  });
});
