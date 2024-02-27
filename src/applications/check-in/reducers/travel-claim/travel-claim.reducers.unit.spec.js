import { expect } from 'chai';

import { receivedTravelDataHandler } from './index';
import { receivedTravelData } from '../../actions/travel-claim';

import appReducer from '../index';

describe('check in', () => {
  describe('travel claim reducers', () => {
    const data = {
      appointments: [
        {
          startTime: '2021-08-19T13:56:31',
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
        },
      ],
      address: '111 fake st.',
    };
    describe('receivedTravelDataHandler', () => {
      it('should create basic structure', () => {
        const action = receivedTravelData(data);
        const state = receivedTravelDataHandler({}, action);
        expect(state.appointments).to.be.an('array');
        expect(state.address).to.be.a('string');
      });
      it('should set the correct values', () => {
        const action = receivedTravelData(data);
        const state = receivedTravelDataHandler({}, action);
        expect(state.appointments[0].startTime).to.equal('2021-08-19T13:56:31');
        expect(state.appointments[0].facility).to.equal('LOMA LINDA VA CLINIC');
        expect(state.appointments[0].clinicPhoneNumber).to.equal('5551234567');
        expect(state.appointments[0].clinicFriendlyName).to.equal(
          'TEST CLINIC',
        );
        expect(state.address).to.equal('111 fake st.');
      });
    });
    describe('reducer is called;', () => {
      it('finds the correct handler', () => {
        const action = receivedTravelData(data);
        const state = appReducer.checkInData(undefined, action);
        expect(state.appointments[0].startTime).to.equal('2021-08-19T13:56:31');
        expect(state.appointments[0].facility).to.equal('LOMA LINDA VA CLINIC');
        expect(state.appointments[0].clinicPhoneNumber).to.equal('5551234567');
        expect(state.appointments[0].clinicFriendlyName).to.equal(
          'TEST CLINIC',
        );
        expect(state.address).to.equal('111 fake st.');
      });
    });
  });
});
