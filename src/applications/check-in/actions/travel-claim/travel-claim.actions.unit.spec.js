import { expect } from 'chai';

import {
  receivedTravelData,
  RECEIVED_TRAVEL_DATA,
  setFilteredAppointments,
  SET_FILTERED_APPOINTMENTS,
} from './index';

describe('travel-claim', () => {
  describe('actions', () => {
    describe('receivedTravelData', () => {
      it('should return correct action', () => {
        const action = receivedTravelData({});
        expect(action.type).to.equal(RECEIVED_TRAVEL_DATA);
      });
      it('should return correct structure', () => {
        const action = receivedTravelData({
          appointments: [
            { appointmentIen: 'abc-123' },
            {
              appointmentIen: 'def-456',
            },
          ],
          address: '123 fake st.',
        });
        expect(action.payload.appointments).to.be.an('array');
        expect(action.payload.appointments).to.deep.equal([
          { appointmentIen: 'abc-123' },
          { appointmentIen: 'def-456' },
        ]);

        expect(action.payload.address).to.be.an('string');
        expect(action.payload.address).to.equal('123 fake st.');
      });
    });
    describe('setFilteredAppointments', () => {
      it('should return correct action', () => {
        const action = setFilteredAppointments({});
        expect(action.type).to.equal(SET_FILTERED_APPOINTMENTS);
      });
      it('should return correct structure', () => {
        const action = setFilteredAppointments({
          alreadyFiled: [],
          eligibleToFile: [],
        });
        expect(action.payload).to.be.an('object');
        expect(action.payload).to.deep.equal({
          alreadyFiled: [],
          eligibleToFile: [],
        });

        expect(action.payload.alreadyFiled).to.be.an('array');
        expect(action.payload.eligibleToFile).to.be.an('array');
      });
    });
  });
});
