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
    it('should return to type of care page if user is CC eligible ', () => {
      const state = {
        ...defaultState,
      };
      const nextState = newAppointmentFlow.vaFacility.previous(state);
      expect(nextState).to.equal('typeOfCare');
    });
    it('should return to page prior to typeOfFacility if user is CC eligible ', () => {
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
        },
      };

      const nextState = newAppointmentFlow.vaFacility.previous(state);
      expect(nextState).to.equal('typeOfFacility');
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

      // TODO: this should go to appointment time page when it exists
      expect(nextState).to.equal('selectDateTime');
    });
  });
  describe('reason for appointment page', () => {
    it('should go back to clinic page if use chose NONE before', () => {
      const state = {
        newAppointment: {
          data: {
            clinicId: 'NONE',
          },
        },
      };

      const nextState = newAppointmentFlow.reasonForAppointment.previous(state);

      expect(nextState).to.equal('clinicChoice');
    });
  });
  describe('type of care page', () => {
    it('should choose VA facility page', async () => {
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: '000',
          },
        },
      };

      const nextState = await newAppointmentFlow.typeOfCare.next(state);
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
    it('should choose type of facility page when eligible for CC', async () => {
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: '323',
          },
        },
      };

      const nextState = await newAppointmentFlow.typeOfCare.next(state);
      expect(nextState).to.equal('typeOfFacility');
    });
  });
  describe('ccProvider page', () => {
    it('should return to type of facility page', () => {
      const state = {
        newAppointment: {
          data: {},
        },
      };
      expect(newAppointmentFlow.ccProvider.previous(state)).to.equal(
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
      expect(newAppointmentFlow.ccProvider.previous(state)).to.equal(
        'audiologyCareType',
      );
    });
  });
  describe('constact info page', () => {
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
        'ccProvider',
      );
    });
  });
});
