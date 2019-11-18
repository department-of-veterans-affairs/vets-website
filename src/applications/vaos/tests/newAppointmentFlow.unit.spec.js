import { expect } from 'chai';
import sinon from 'sinon';

import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import past from '../api/past.json';
import systems from '../api/systems.json';

import newAppointmentFlow from '../newAppointmentFlow';
import { FLOW_TYPES } from '../utils/constants';

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

    it('next should choose date page if CC chosen', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'communityCare',
            typeOfCareId: '320',
          },
        },
      };

      const nextState = newAppointmentFlow.typeOfFacility.next(state);
      expect(nextState).to.equal('requestDateTime');
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
          facilityType: undefined,
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
      mockFetch();
      setFetchJSONResponse(global.fetch, past);
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
        'newAppointment/START_DIRECT_SCHEDULE_FLOW',
      );
      expect(nextState).to.equal('clinicChoice');

      resetFetch();
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
      expect(nextState).to.equal('requestDateTime');
    });
    it('should return to type of care page if none of user Systems is cc enabled', () => {
      const state = {
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          data: {
            typeOfCareId: '323',
            vaSystem: '983',
            vaFacility: '983',
            facilityType: 'vamc',
          },
          hasCCEnabledSystems: false,
        },
      };
      const nextState = newAppointmentFlow.vaFacility.previous(state);
      expect(nextState).to.equal('typeOfCare');
    });
    it('should return to typeOfFacility if user is CC eligible ', () => {
      const state = {
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          data: {
            typeOfCareId: '323',
            vaSystem: '983',
            vaFacility: '983',
            facilityType: 'vamc',
          },
          ccEnabledSystems: ['983'],
        },
      };

      const nextState = newAppointmentFlow.vaFacility.previous(state);
      expect(nextState).to.equal('typeOfFacility');
    });
  });
  describe('request date/time page', () => {
    it('should go to CC preferences page if CC', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'communityCare',
          },
        },
      };

      const nextState = newAppointmentFlow.requestDateTime.next(state);

      expect(nextState).to.equal('ccPreferences');
    });
    it('should go to reason for appt if not cc', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'vamc',
          },
        },
      };

      const nextState = newAppointmentFlow.requestDateTime.next(state);

      expect(nextState).to.equal('reasonForAppointment');
    });
    it('should go back to type of facility page if CC', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'communityCare',
          },
        },
      };

      const nextState = newAppointmentFlow.requestDateTime.previous(state);

      expect(nextState).to.equal('typeOfFacility');
    });
    it('should go back to va facility page if not cc', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'vamc',
          },
        },
      };

      const nextState = newAppointmentFlow.requestDateTime.previous(state);

      expect(nextState).to.equal('vaFacility');
    });
  });
  describe('clinic choice page', () => {
    it('should go to next direct schedule page if user chose a clinic', () => {
      const state = {
        newAppointment: {
          data: {
            clinicId: '123',
          },
        },
      };

      const nextState = newAppointmentFlow.clinicChoice.next(state);

      expect(nextState).to.equal('preferredDate');
    });

    it('should go to request date page if user chose a different clinic', () => {
      const state = {
        newAppointment: {
          data: {
            clinicId: 'NONE',
          },
        },
      };
      const dispatch = sinon.spy();

      const nextState = newAppointmentFlow.clinicChoice.next(state, dispatch);

      expect(nextState).to.equal('requestDateTime');
      expect(dispatch.called).to.be.true;
    });
  });

  describe('preferred date page', () => {
    it('should go to select date page', () => {
      expect(newAppointmentFlow.preferredDate.next).to.equal('selectDateTime');
    });

    it('should go back to to clinic choice page', () => {
      expect(newAppointmentFlow.preferredDate.previous).to.equal(
        'clinicChoice',
      );
    });
  });

  describe('reason for appointment page', () => {
    it('should go visit page if not CC', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'vamc',
          },
        },
      };

      const nextState = newAppointmentFlow.reasonForAppointment.next(state);
      expect(nextState).to.equal('visitType');
    });

    it('should go contact info page if CC', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'communityCare',
          },
        },
      };

      const nextState = newAppointmentFlow.reasonForAppointment.next(state);
      expect(nextState).to.equal('contactInfo');
    });

    it('should go back to ccPreferences if community care', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'communityCare',
          },
          flowType: FLOW_TYPES.DIRECT,
        },
      };

      const nextState = newAppointmentFlow.reasonForAppointment.previous(state);
      expect(nextState).to.equal('ccPreferences');
    });

    it('should go back to selectDateTime if direct schedule', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'vamc',
          },
          flowType: FLOW_TYPES.DIRECT,
        },
      };

      const nextState = newAppointmentFlow.reasonForAppointment.previous(state);

      expect(nextState).to.equal('selectDateTime');
    });

    it('should go back to requestDateTime if request flow', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'vamc',
          },
          flowType: FLOW_TYPES.REQUEST,
        },
      };

      const nextState = newAppointmentFlow.reasonForAppointment.previous(state);

      expect(nextState).to.equal('requestDateTime');
    });
  });
  describe('type of care page', () => {
    it('next should be vaFacility page if no CC support', async () => {
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: '372',
          },
        },
      };

      const dispatch = sinon.spy();
      const nextState = await newAppointmentFlow.typeOfCare.next(
        state,
        dispatch,
      );
      expect(nextState).to.equal('vaFacility');
    });

    it('should choose Sleep care page', async () => {
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: 'SLEEP',
          },
        },
      };

      const nextState = await newAppointmentFlow.typeOfCare.next(state);
      expect(nextState).to.equal('typeOfSleepCare');
    });

    it('next should be type of facility page if CC support', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, systems);
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: '323',
          },
        },
      };

      const dispatch = sinon.spy();
      const nextState = await newAppointmentFlow.typeOfCare.next(
        state,
        dispatch,
      );
      expect(nextState).to.equal('typeOfFacility');

      resetFetch();
    });
  });
  describe('ccPreferences page', () => {
    it('should return to type of facility page', () => {
      const state = {
        newAppointment: {
          data: {},
        },
      };
      expect(newAppointmentFlow.ccPreferences.previous(state)).to.equal(
        'typeOfFacility',
      );
    });
    it('should return to choose audiology care type page', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'communityCare',
            typeOfCareId: '203',
          },
        },
      };
      expect(newAppointmentFlow.ccPreferences.previous(state)).to.equal(
        'audiologyCareType',
      );
    });
  });
  describe('contact info page', () => {
    it('should return to choose visit type page', () => {
      const state = {
        newAppointment: {
          data: {},
        },
      };
      expect(newAppointmentFlow.contactInfo.previous(state)).to.equal(
        'visitType',
      );
    });
    it('should return to choose CC provider page', () => {
      const state = {
        newAppointment: {
          data: {
            facilityType: 'communityCare',
          },
        },
      };
      expect(newAppointmentFlow.contactInfo.previous(state)).to.equal(
        'ccPreferences',
      );
    });
  });
});
