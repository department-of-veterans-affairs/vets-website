import { expect } from 'chai';
import sinon from 'sinon';

import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import past from '../../services/mocks/var/past.json';
import supportedSites from '../../services/mocks/var/sites-supporting-var.json';
import parentFacilities from '../../services/mocks/var/facilities.json';

import newAppointmentFlow from '../../new-appointment/newAppointmentFlow';
import { FACILITY_TYPES } from '../../utils/constants';

const userState = {
  user: {
    profile: {
      facilities: [
        {
          facilityId: '983',
          isCerner: false,
        },
        {
          facilityId: '984',
          isCerner: false,
        },
      ],
    },
  },
};

describe('VAOS newAppointmentFlow', () => {
  describe('typeOfCare page', () => {
    describe('next page', () => {
      it('should be vaFacility page if no systems have CC support', async () => {
        mockFetch();
        setFetchJSONResponse(global.fetch, {
          data: [{ attributes: { assigningAuthority: 'dfn-000' } }],
        });

        const state = {
          featureToggles: {
            loading: false,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingCommunityCare: true,
          },
          newAppointment: {
            data: {
              typeOfCareId: '323',
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        let nextState = await newAppointmentFlow.typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('vaFacility');

        // Check v2 feature toggle
        state.featureToggles.vaOnlineSchedulingFlatFacilityPage = true;
        nextState = newAppointmentFlow.typeOfFacility.next(state);
        expect(nextState).to.equal('vaFacilityV2');

        resetFetch();
      });

      it('should be vaFacility page if CC check has an error', async () => {
        mockFetch();
        setFetchJSONResponse(global.fetch, parentFacilities);
        setFetchJSONResponse(global.fetch.onCall(1), supportedSites);
        setFetchJSONResponse(global.fetch.onCall(2), {});
        const state = {
          ...userState,
          featureToggles: {
            loading: false,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingCommunityCare: true,
          },
          newAppointment: {
            data: {
              typeOfCareId: '323',
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        let nextState = await newAppointmentFlow.typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('vaFacility');

        // Check v2 feature toggle
        state.featureToggles.vaOnlineSchedulingFlatFacilityPage = true;
        nextState = newAppointmentFlow.typeOfFacility.next(state);
        expect(nextState).to.equal('vaFacilityV2');
        resetFetch();
      });

      it('should be typeOfCare page if CC check has an error and podiatry chosen', async () => {
        mockFetch();
        setFetchJSONResponse(global.fetch, parentFacilities);
        setFetchJSONResponse(global.fetch.onCall(1), supportedSites);
        setFetchJSONFailure(global.fetch.onCall(2), {});
        const state = {
          ...userState,
          featureToggles: {
            loading: false,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingCommunityCare: true,
          },
          newAppointment: {
            data: {
              typeOfCareId: 'tbd-podiatry',
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        const nextState = await newAppointmentFlow.typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('typeOfCare');
        resetFetch();
      });

      it('should be the current page if no CC support and typeOfCare is podiatry', async () => {
        const state = {
          user: {
            profile: {
              facilities: [{ facilityId: '000' }],
            },
          },
          featureToggles: {
            loading: false,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingCommunityCare: true,
          },
          newAppointment: {
            data: {
              typeOfCareId: 'tbd-podiatry',
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        const nextState = await newAppointmentFlow.typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('typeOfCare');
      });

      it('should be requestDateTime if CC support and typeOfCare is podiatry', async () => {
        mockFetch();
        setFetchJSONResponse(global.fetch, parentFacilities);
        setFetchJSONResponse(global.fetch.onCall(1), supportedSites);
        setFetchJSONResponse(global.fetch.onCall(2), {
          data: {
            attributes: { eligible: true },
          },
        });
        const state = {
          ...userState,
          featureToggles: {
            loading: false,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingCommunityCare: true,
          },
          newAppointment: {
            data: {
              typeOfCareId: 'tbd-podiatry',
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        const nextState = await newAppointmentFlow.typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('requestDateTime');
        resetFetch();
      });

      it('should be typeOfSleepCare if sleep care chosen', async () => {
        const dispatch = sinon.spy();
        const state = {
          featureToggles: {
            loading: false,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingCommunityCare: true,
          },
          newAppointment: {
            data: {
              typeOfCareId: 'SLEEP',
            },
          },
        };

        const nextState = await newAppointmentFlow.typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('typeOfSleepCare');
      });

      it('should be typeOfFacility page if site has CC support', async () => {
        mockFetch();
        setFetchJSONResponse(global.fetch, parentFacilities);
        setFetchJSONResponse(global.fetch.onCall(1), supportedSites);
        setFetchJSONResponse(global.fetch.onCall(2), {
          data: {
            attributes: { eligible: true },
          },
        });
        const state = {
          ...userState,
          featureToggles: {
            loading: false,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingCommunityCare: true,
          },
          newAppointment: {
            data: {
              typeOfCareId: '323',
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        const nextState = await newAppointmentFlow.typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('typeOfFacility');

        resetFetch();
      });
    });
  });

  describe('typeOfFacility page', () => {
    describe('next page', () => {
      it('should be audiologyCareType if CC supported and audiology chosen', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
              typeOfCareId: '203',
            },
          },
        };

        const nextState = newAppointmentFlow.typeOfFacility.next(state);
        expect(nextState).to.equal('audiologyCareType');
      });

      it('should be requestDateTime if CC is chosen', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
              typeOfCareId: '320',
            },
          },
        };

        const dispatch = sinon.spy();

        const nextState = newAppointmentFlow.typeOfFacility.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('requestDateTime');
        expect(dispatch.firstCall.args[0].type).to.equal(
          'newAppointment/START_REQUEST_APPOINTMENT_FLOW',
        );
      });

      it('should be vaFacility page if they chose VA', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: 'va',
              typeOfCareId: '203',
            },
          },
          featureToggles: {
            loading: false,
            vaOnlineSchedulingFlatFacilityPage: false,
          },
        };

        let nextState = newAppointmentFlow.typeOfFacility.next(state);
        expect(nextState).to.equal('vaFacility');

        // Check v2 feature toggle
        state.featureToggles.vaOnlineSchedulingFlatFacilityPage = true;
        nextState = newAppointmentFlow.typeOfFacility.next(state);
        expect(nextState).to.equal('vaFacilityV2');
      });
    });
  });

  describe('vaFacility page', () => {
    const defaultState = {
      featureToggles: {
        loading: false,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: true,
      },
      newAppointment: {
        data: {
          typeOfCareId: '323',
          vaParent: '983',
          vaFacility: '983',
          facilityType: undefined,
        },
        clinics: {
          '983_323': [
            {
              siteCode: '983',
              clinicId: '308',
            },
          ],
        },
        eligibility: {
          '983_323': {},
        },
      },
    };
    describe('next page', () => {
      it('should be clinicChoice page if eligible', async () => {
        mockFetch();
        setFetchJSONResponse(global.fetch, past);
        const state = {
          ...defaultState,
          newAppointment: {
            ...defaultState.newAppointment,
            eligibility: {
              '983_323': {
                directSupported: true,
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
      it('should throw error if not eligible for requests or direct', async () => {
        const state = {
          ...defaultState,
          newAppointment: {
            ...defaultState.newAppointment,
            eligibility: {
              '983_323': {
                directSupported: false,
                directPastVisit: true,
                directPACT: true,
                directClinics: true,
                requestSupported: false,
                requestPastVisit: true,
                requestLimit: true,
              },
            },
          },
        };
        const dispatch = sinon.spy();

        try {
          await newAppointmentFlow.vaFacility.next(state, dispatch);
          // Should throw an error above
          expect(false).to.be.true;
        } catch (e) {
          expect(e.message).to.equal(
            'Veteran not eligible for direct scheduling or requests',
          );
        }
      });
      it('should be requestDateTime if not direct eligible', async () => {
        const state = {
          ...defaultState,
          newAppointment: {
            ...defaultState.newAppointment,
            eligibility: {
              '983_323': {
                directSupported: true,
                directPastVisit: false,
                directPACT: true,
                directClinics: true,
                requestSupported: true,
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
    });
  });

  describe('requestDateTime page', () => {
    describe('next page', () => {
      it('should be ccPreferences if in the CC flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
            },
          },
        };

        const nextState = newAppointmentFlow.requestDateTime.next(state);

        expect(nextState).to.equal('ccPreferences');
      });
      it('should be reasonForAppointment if in the VA flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.VAMC,
            },
          },
        };

        const nextState = newAppointmentFlow.requestDateTime.next(state);

        expect(nextState).to.equal('reasonForAppointment');
      });
    });
  });

  describe('clinicChoicePage', () => {
    describe('next page', () => {
      it('should be preferredDate if user chose a clinic', () => {
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

      it('should be requestDateTime if user chose that they need a different clinic', () => {
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
  });

  describe('reasonForAppointment page', () => {
    describe('next page', () => {
      it('should be visitType if in the VA flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.VAMC,
            },
          },
        };

        const nextState = newAppointmentFlow.reasonForAppointment.next(state);
        expect(nextState).to.equal('visitType');
      });

      it('should be contactInfo if in the CC flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
            },
          },
        };

        const nextState = newAppointmentFlow.reasonForAppointment.next(state);
        expect(nextState).to.equal('contactInfo');
      });
    });
  });

  describe('eye care page', () => {
    it('should choose eye care page', async () => {
      const dispatch = sinon.spy();
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: 'EYE',
          },
        },
      };
      const nextState = await newAppointmentFlow.typeOfCare.next(
        state,
        dispatch,
      );
      expect(nextState).to.equal('typeOfEyeCare');
    });

    it('should be typeOfFacility page when optometry selected', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, parentFacilities);
      setFetchJSONResponse(global.fetch.onCall(1), supportedSites);
      setFetchJSONResponse(global.fetch.onCall(2), {
        data: {
          attributes: { eligible: true },
        },
      });
      const state = {
        ...userState,
        featureToggles: {
          loading: false,
          vaOnlineSchedulingDirect: true,
          vaOnlineSchedulingCommunityCare: true,
        },
        newAppointment: {
          data: {
            typeOfCareId: 'EYE',
            typeOfEyeCareId: '408',
          },
        },
      };

      const getState = () => state;
      const dispatch = action =>
        typeof action === 'function' ? action(sinon.spy(), getState) : null;
      const nextState = await newAppointmentFlow.typeOfEyeCare.next(
        state,
        dispatch,
      );
      expect(nextState).to.equal('typeOfFacility');

      resetFetch();
    });

    it('should be vaFacility page when Ophthalmology selected', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, parentFacilities);
      setFetchJSONResponse(global.fetch.onCall(1), supportedSites);
      setFetchJSONResponse(global.fetch.onCall(2), {
        data: {
          attributes: { eligible: true },
        },
      });
      const state = {
        ...userState,
        featureToggles: {
          loading: false,
          vaOnlineSchedulingDirect: true,
          vaOnlineSchedulingCommunityCare: true,
          vaOnlineSchedulingFlatFacilityPage: false,
        },
        newAppointment: {
          data: {
            typeOfCareId: 'EYE',
            typeOfEyeCareId: '407',
          },
        },
      };

      const getState = () => state;
      const dispatch = action =>
        typeof action === 'function' ? action(sinon.spy(), getState) : null;
      let nextState = await newAppointmentFlow.typeOfEyeCare.next(
        state,
        dispatch,
      );
      expect(nextState).to.equal('vaFacility');

      // check v2 feature toggle
      state.featureToggles.vaOnlineSchedulingFlatFacilityPage = true;
      nextState = await newAppointmentFlow.typeOfEyeCare.next(state, dispatch);
      expect(nextState).to.equal('vaFacilityV2');
      resetFetch();
    });
  });
});
