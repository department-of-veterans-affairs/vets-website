import { expect } from 'chai';
import sinon from 'sinon';

import newAppointmentFlow from '../newAppointmentFlow';

describe('VAOS newAppointmentFlow', () => {
  describe('type of appointment page', () => {
    expect(newAppointmentFlow.typeOfAppointment.next).to.equal(
      'typeOfFacility',
    );
    expect(newAppointmentFlow.typeOfAppointment.previous).to.equal('home');
  });

  describe('type of facility page', () => {
    it('next should choose audiology decision page if CC and audiology chosen', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'communityCare',
            typeOfCareId: '203',
          },
        },
      };

      const nextState = newAppointmentFlow.typeOfFacility.next(state);
      expect(nextState).to.equal('audiologyCareType');
    });

    it('next should choose contact info page if CC chosen', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'communityCare',
            typeOfCareId: '320',
          },
        },
      };

      const nextState = newAppointmentFlow.typeOfFacility.next(state);
      expect(nextState).to.equal('ccProvider');
    });

    it('next should choose audiology options page if CC and audiology is chosen', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'communityCare',
            typeOfCareId: '203',
          },
        },
      };

      const nextState = newAppointmentFlow.typeOfFacility.next(state);
      expect(nextState).to.equal('audiologyCareType');
    });

    it('next should choose va facility page if not CC', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'va',
            typeOfCareId: '203',
          },
        },
      };

      const nextState = newAppointmentFlow.typeOfFacility.next(state);
      expect(nextState).to.equal('vaFacility');
    });
  });
  describe('va facility page', () => {
    const defaultState = {
      newAppointment: {
        data: {
          typeOfCareId: '323',
          vaSystem: '983',
          vaFacility: '983',
        },
        clinics: {
          '983_323': [
            {
              clinicId: '308',
            },
          ],
        },
        eligibility: {
          '983_323': {},
        },
      },
    };
    it('next should choose clinic choice page if eligible', async () => {
      const state = {
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          eligibility: {
            '983_323': {
              directTypes: true,
              directPastVisit: true,
              directPACT: true,
              directClinics: true,
            },
          },
        },
      };
      const dispatch = sinon.spy();

      const nextState = await newAppointmentFlow.vaFacility.next(
        state,
        dispatch,
      );
      expect(dispatch.firstCall.args[0].type).to.equal(
        'START_DIRECT_SCHEDULE_FLOW',
      );
      expect(nextState).to.equal('clinicChoice');
    });
    it('next should direct to request flow if not direct eligible', async () => {
      const state = {
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          eligibility: {
            '983_323': {
              directTypes: true,
              directPastVisit: false,
              directPACT: true,
              directClinics: true,
              requestPastVisit: true,
              requestLimit: true,
            },
          },
        },
      };
      const dispatch = sinon.spy();

      const nextState = await newAppointmentFlow.vaFacility.next(
        state,
        dispatch,
      );
      expect(nextState).to.equal('reasonForAppointment');
    });
  });
});
