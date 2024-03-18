import { expect } from 'chai';

import {
  receivedTravelDataHandler,
  setFilteredAppointmentsHandler,
  setFacilityToFileHandler,
} from './index';
import {
  receivedTravelData,
  setFilteredAppointments,
  setFacilityToFile,
} from '../../actions/travel-claim';

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
    const filteredAppointments = {
      alreadyFiled: [
        {
          stationNo: '555',
        },
      ],
      eligibleToFile: [
        {
          stationNo: '444',
        },
      ],
    };
    const facilityToFile = {
      facilitiesToFile: [
        {
          stationNo: '555',
          startTime: '2021-08-19T13:56:31',
          multipleAppointments: true,
        },
      ],
    };
    describe('receivedTravelDataHandler', () => {
      it('should create basic structure', () => {
        const action = receivedTravelData(data);
        const state = receivedTravelDataHandler({}, action);
        expect(state.appointments).to.be.an('array');
        expect(state.veteranData.address).to.be.a('string');
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
        expect(state.veteranData.address).to.equal('111 fake st.');
      });
      describe('reducer is called;', () => {
        it('finds the correct handler', () => {
          const action = receivedTravelData(data);
          const state = appReducer.checkInData(undefined, action);
          expect(state.appointments[0].startTime).to.equal(
            '2021-08-19T13:56:31',
          );
          expect(state.appointments[0].facility).to.equal(
            'LOMA LINDA VA CLINIC',
          );
          expect(state.appointments[0].clinicPhoneNumber).to.equal(
            '5551234567',
          );
          expect(state.appointments[0].clinicFriendlyName).to.equal(
            'TEST CLINIC',
          );
          expect(state.veteranData.address).to.equal('111 fake st.');
        });
      });
    });
    describe('setFilteredAppointments', () => {
      it('should create basic structure', () => {
        const action = setFilteredAppointments(filteredAppointments);
        const state = setFilteredAppointmentsHandler({}, action);
        expect(state.context.alreadyFiled).to.be.an('array');
        expect(state.context.eligibleToFile).to.be.an('array');
      });
      it('should set the correct values', () => {
        const action = setFilteredAppointments(filteredAppointments);
        const state = setFilteredAppointmentsHandler({}, action);
        expect(state.context.alreadyFiled[0].stationNo).to.equal('555');
        expect(state.context.eligibleToFile[0].stationNo).to.equal('444');
      });
      describe('reducer is called;', () => {
        it('finds the correct handler', () => {
          const action = setFilteredAppointments(filteredAppointments);
          const state = appReducer.checkInData(undefined, action);
          expect(state.context.alreadyFiled[0].stationNo).to.equal('555');
          expect(state.context.eligibleToFile[0].stationNo).to.equal('444');
        });
      });
    });
    describe('setFacilityToFile', () => {
      it('should create basic structure', () => {
        const action = setFacilityToFile(facilityToFile);
        const state = setFacilityToFileHandler({ form: {} }, action);
        expect(state.form.data.facilitiesToFile).to.be.an('array');
      });
      it('should set the correct values', () => {
        const action = setFacilityToFile(facilityToFile);
        const state = setFacilityToFileHandler({ form: {} }, action);
        expect(state.form.data.facilitiesToFile[0].stationNo).to.equal('555');
        expect(state.form.data.facilitiesToFile[0].startTime).to.equal(
          '2021-08-19T13:56:31',
        );
        expect(state.form.data.facilitiesToFile[0].multipleAppointments).to.be
          .true;
      });
      describe('reducer is called;', () => {
        it('finds the correct handler', () => {
          const action = setFacilityToFile(facilityToFile);
          const state = appReducer.checkInData(undefined, action);
          expect(state.form.data.facilitiesToFile[0].stationNo).to.equal('555');
          expect(state.form.data.facilitiesToFile[0].startTime).to.equal(
            '2021-08-19T13:56:31',
          );
          expect(state.form.data.facilitiesToFile[0].multipleAppointments).to.be
            .true;
        });
      });
    });
  });
});
