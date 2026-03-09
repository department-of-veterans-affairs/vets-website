import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

import MockFacilityResponse from '../tests/fixtures/MockFacilityResponse';
import MockSchedulingConfigurationResponse, {
  MockServiceConfiguration,
} from '../tests/fixtures/MockSchedulingConfigurationResponse';
import {
  mockFacilitiesApi,
  mockSchedulingConfigurationsApi,
  mockV2CommunityCareEligibility,
} from '../tests/mocks/mockApis';
import { FACILITY_TYPES, TYPE_OF_CARE_IDS } from '../utils/constants';
import getNewAppointmentFlow from './newAppointmentFlow';

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
        mockFacilitiesApi({
          children: true,
          ids: ['983'],
          response: [new MockFacilityResponse()],
        });
        mockSchedulingConfigurationsApi({
          isCCEnabled: true,
          response: [
            new MockSchedulingConfigurationResponse({
              facilityId: '983',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'primaryCare',
                  requestEnabled: true,
                }),
              ],
            }),
          ],
        });

        const state = {
          user: {
            profile: {
              facilities: [{ facilityId: '983' }],
            },
          },
          featureToggles: {
            loading: false,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingCommunityCare: true,
          },
          newAppointment: {
            data: {
              typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        const nextState = await getNewAppointmentFlow(state).typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('vaFacilityV2');
      });

      it('should be vaFacility page if CC check has an error', async () => {
        mockFetch();
        mockFacilitiesApi({
          ids: ['983', '984'],
          response: [new MockFacilityResponse({ id: '1' })],
        });
        mockSchedulingConfigurationsApi({
          facilityIds: ['1'],
          isCCEnabled: true,
          response: [],
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
              typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        const nextState = await getNewAppointmentFlow(state).typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('vaFacilityV2');
      });

      it('should be typeOfCare page if CC check has an error and podiatry chosen', async () => {
        mockFetch();
        mockFacilitiesApi({
          ids: ['983', '984'],
          response: [new MockFacilityResponse({ id: '1' })],
        });
        mockSchedulingConfigurationsApi({
          facilityIds: ['1'],
          isCCEnabled: true,
          response: [],
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
              typeOfCareId: TYPE_OF_CARE_IDS.PODIATRY_ID,
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        const nextState = await getNewAppointmentFlow(state).typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('typeOfCare');
      });

      it('should be the current page if no CC support and typeOfCare is podiatry', async () => {
        const ids = ['983'];

        mockFetch();
        mockFacilitiesApi({
          ids,
          response: [new MockFacilityResponse({ isParent: true })],
        });
        mockFacilitiesApi({
          children: true,
          ids: ['983', '984'],
          response: [new MockFacilityResponse()],
        });
        mockSchedulingConfigurationsApi({
          isCCEnabled: true,
          response: [
            new MockSchedulingConfigurationResponse({
              facilityId: '983',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: '411',
                  requestEnabled: true,
                  communityCare: false,
                }),
              ],
            }),
          ],
        });
        mockV2CommunityCareEligibility({
          parentSites: [],
          careType: 'Podiatry',
          eligible: false,
        });

        const state = {
          user: {
            profile: {
              facilities: [{ facilityId: '983' }],
            },
          },
          featureToggles: {
            loading: false,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingCommunityCare: true,
          },
          newAppointment: {
            data: {
              typeOfCareId: TYPE_OF_CARE_IDS.PODIATRY_ID,
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        const nextState = await getNewAppointmentFlow(state).typeOfCare.next(
          state,
          dispatch,
        );

        expect(nextState).to.equal('typeOfCare');
      });

      it('should be ccRequestDateTime if CC support and typeOfCare is podiatry', async () => {
        mockFetch();
        mockFacilitiesApi({
          children: true,
          ids: ['983', '984'],
          response: [new MockFacilityResponse()],
        });
        mockSchedulingConfigurationsApi({
          isCCEnabled: true,
          response: [
            new MockSchedulingConfigurationResponse({
              facilityId: '983',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: '411',
                  requestEnabled: true,
                  communityCare: true,
                }),
              ],
            }),
          ],
        });
        mockV2CommunityCareEligibility({
          parentSites: [],
          careType: 'Podiatry',
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
              typeOfCareId: TYPE_OF_CARE_IDS.PODIATRY_ID,
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        const nextState = await getNewAppointmentFlow(state).typeOfCare.next(
          state,
          dispatch,
        );

        expect(nextState).to.equal('ccRequestDateTime');
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
              typeOfCareId: TYPE_OF_CARE_IDS.SLEEP_MEDICINE_ID,
            },
          },
        };

        const nextState = await getNewAppointmentFlow(state).typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('typeOfSleepCare');
      });

      it('should be typeOfFacility page if site has CC support', async () => {
        mockFetch();
        mockFacilitiesApi({
          children: true,
          ids: ['983', '984'],
          response: [new MockFacilityResponse()],
        });
        mockSchedulingConfigurationsApi(
          {
            isCCEnabled: true,
            response: [
              new MockSchedulingConfigurationResponse({
                facilityId: '983',
                services: [
                  new MockServiceConfiguration({
                    typeOfCareId: 'primaryCare',
                    requestEnabled: true,
                  }),
                ],
              }),
            ],
          },
          true,
        );
        mockV2CommunityCareEligibility({
          parentSites: [],
          careType: 'PrimaryCare',
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
              typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
            },
          },
        };

        const getState = () => state;
        const dispatch = action =>
          typeof action === 'function' ? action(sinon.spy(), getState) : null;
        const nextState = await getNewAppointmentFlow(state).typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('typeOfFacility');
      });
    });
  });

  describe('typeOfFacility page', () => {
    describe('next page', () => {
      it('should be audiologyCareType if CC supported and audiology chosen', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE.id,
              typeOfCareId: TYPE_OF_CARE_IDS.AUDIOLOGY_ID,
            },
          },
        };

        const nextState = getNewAppointmentFlow(state).typeOfFacility.next(
          state,
        );
        expect(nextState).to.equal('audiologyCareType');
      });

      it('should be requestDateTime if CC is chosen', async () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE.id,
              typeOfCareId: '320',
            },
          },
        };

        const dispatchedActions = [];
        const dispatch = action => {
          if (typeof action === 'function') {
            return action(dispatch, () => state);
          }
          dispatchedActions.push(action);
          return action;
        };

        const nextState = await getNewAppointmentFlow(
          state,
        ).typeOfFacility.next(state, dispatch);
        expect(nextState).to.equal('ccRequestDateTime');
        expect(dispatchedActions[0].type).to.equal(
          'newAppointment/FORM_UPDATE_FACILITY_EH',
        );
        expect(dispatchedActions[1].type).to.equal(
          'newAppointment/START_REQUEST_APPOINTMENT_FLOW',
        );
      });

      it('should be vaFacility page if they chose VA', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: 'va',
              typeOfCareId: TYPE_OF_CARE_IDS.AUDIOLOGY_ID,
            },
          },
          featureToggles: {
            loading: false,
          },
        };

        const nextState = getNewAppointmentFlow(state).typeOfFacility.next(
          state,
        );
        expect(nextState).to.equal('vaFacilityV2');
      });
    });
  });

  describe('vaFacilityV2 page', () => {
    const defaultState = {
      featureToggles: {
        loading: false,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: true,
      },
      newAppointment: {
        data: {
          typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
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
        facilities: {},
      },
      user: {
        profile: {
          facilities: [
            {
              facilityId: '983',
              isCerner: false,
            },
            {
              facilityId: '984',
              isCerner: true,
            },
          ],
        },
      },
    };
    describe('next page', () => {
      it('should be selectProvider page if Cerner direct scheduling is enabled and type of care is foodAndNutrition', async () => {
        mockFetch();

        const state = {
          featureToggles: {
            ...defaultState.featureToggles,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingUseVpg: true,
          },
          user: {
            profile: {
              facilities: [
                {
                  facilityId: '983',
                  isCerner: false,
                },
                {
                  facilityId: '692',
                  isCerner: false,
                },
              ],
            },
          },
          drupalStaticData: {
            vamcEhrData: {
              loading: false,
              data: {
                ehrDataByVhaId: {
                  692: {
                    vhaId: '692',
                    vamcFacilityName: 'White City VA Medical Center',
                    vamcSystemName: 'VA Southern Oregon health care',
                    ehr: 'cerner',
                  },
                },
                cernerFacilities: [
                  {
                    vhaId: '692',
                    vamcFacilityName: 'White City VA Medical Center',
                    vamcSystemName: 'VA Southern Oregon health care',
                    ehr: 'cerner',
                  },
                ],
                vistaFacilities: [],
              },
            },
          },

          newAppointment: {
            data: {
              vaFacility: '692',
              typeOfCareId: TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID,
            },
            facilities: {
              123: [
                {
                  id: '692',
                },
              ],
            },
            eligibility: {
              '692_123': {
                direct: true,
              },
            },
          },
        };
        const dispatch = sinon.spy();

        const nextState = await getNewAppointmentFlow(state).vaFacilityV2.next(
          state,
          dispatch,
        );

        expect(nextState).to.equal('selectProvider');
      });

      it('should show eligibility modal when Cerner facility is selected, VPG is enabled and type of care is foodAndNutrition but patient is not eligible', async () => {
        mockFetch();

        const state = {
          featureToggles: {
            ...defaultState.featureToggles,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingUseVpg: true,
          },
          user: {
            profile: {
              facilities: [
                {
                  facilityId: '983',
                  isCerner: false,
                },
                {
                  facilityId: '692',
                  isCerner: false,
                },
              ],
            },
          },
          drupalStaticData: {
            vamcEhrData: {
              loading: false,
              data: {
                ehrDataByVhaId: {
                  692: {
                    vhaId: '692',
                    vamcFacilityName: 'White City VA Medical Center',
                    vamcSystemName: 'VA Southern Oregon health care',
                    ehr: 'cerner',
                  },
                },
                cernerFacilities: [
                  {
                    vhaId: '692',
                    vamcFacilityName: 'White City VA Medical Center',
                    vamcSystemName: 'VA Southern Oregon health care',
                    ehr: 'cerner',
                  },
                ],
                vistaFacilities: [],
              },
            },
          },

          newAppointment: {
            data: {
              vaFacility: '692',
              typeOfCareId: TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID,
            },
            facilities: {
              123: [
                {
                  id: '692',
                },
              ],
            },
            eligibility: {
              '692_123': {
                direct: false,
                request: false,
              },
            },
          },
        };
        const dispatch = sinon.spy();

        const nextState = await getNewAppointmentFlow(state).vaFacilityV2.next(
          state,
          dispatch,
        );

        // Should show eligibility modal and stay on vaFacilityV2
        expect(dispatch.called).to.be.true;
        expect(nextState).to.equal('vaFacilityV2');
      });

      it('should show eligibility modal when Cerner facility is selected, VPG is enabled and Type of care is Pharmacy but patient is not eligible', async () => {
        mockFetch();

        const state = {
          featureToggles: {
            ...defaultState.featureToggles,
            vaOnlineSchedulingDirect: true,
            vaOnlineSchedulingUseVpg: true,
          },
          user: {
            profile: {
              facilities: [
                {
                  facilityId: '983',
                  isCerner: false,
                },
                {
                  facilityId: '692',
                  isCerner: false,
                },
              ],
            },
          },
          drupalStaticData: {
            vamcEhrData: {
              loading: false,
              data: {
                ehrDataByVhaId: {
                  692: {
                    vhaId: '692',
                    vamcFacilityName: 'White City VA Medical Center',
                    vamcSystemName: 'VA Southern Oregon health care',
                    ehr: 'cerner',
                  },
                },
                cernerFacilities: [
                  {
                    vhaId: '692',
                    vamcFacilityName: 'White City VA Medical Center',
                    vamcSystemName: 'VA Southern Oregon health care',
                    ehr: 'cerner',
                  },
                ],
                vistaFacilities: [],
              },
            },
          },

          newAppointment: {
            data: {
              vaFacility: '692',
              typeOfCareId: TYPE_OF_CARE_IDS.PHARMACY_ID,
            },
            facilities: {
              160: [
                {
                  id: '692',
                },
              ],
            },
            eligibility: {
              '692_160': {
                direct: false,
                request: false,
              },
            },
          },
        };
        const dispatch = sinon.spy();

        const nextState = await getNewAppointmentFlow(state).vaFacilityV2.next(
          state,
          dispatch,
        );

        // Should show eligibility modal and stay on vaFacilityV2
        expect(dispatch.called).to.be.true;
        expect(nextState).to.equal('vaFacilityV2');
      });

      it('should be clinicChoice page if eligible', async () => {
        mockFetch();
        const state = {
          ...defaultState,
          newAppointment: {
            ...defaultState.newAppointment,
            eligibility: {
              '983_323': {
                direct: true,
              },
            },
          },
        };
        const dispatchedActions = [];
        const dispatch = action => {
          if (typeof action === 'function') {
            return action(dispatch, () => state);
          }
          dispatchedActions.push(action);
          return action;
        };

        const nextState = await getNewAppointmentFlow(state).vaFacilityV2.next(
          state,
          dispatch,
        );
        expect(
          dispatchedActions.some(
            a => a.type === 'newAppointment/START_DIRECT_SCHEDULE_FLOW',
          ),
        ).to.be.true;
        expect(nextState).to.equal('clinicChoice');
      });
      it('should be requestDateTime if not direct eligible', async () => {
        const state = {
          ...defaultState,
          newAppointment: {
            ...defaultState.newAppointment,
            eligibility: {
              '983_323': {
                direct: false,
                request: true,
              },
            },
          },
        };
        const dispatch = sinon.spy();

        const nextState = await getNewAppointmentFlow(state).vaFacilityV2.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('requestDateTime');
      });
    });
  });

  describe('requestDateTime page', () => {
    describe('next page', () => {
      it('should be reasonForAppointment if in the VA flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.VAMC.id,
            },
          },
        };

        const nextState = getNewAppointmentFlow(state).requestDateTime.next(
          state,
        );

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
        const dispatch = sinon.spy();

        const nextState = getNewAppointmentFlow(state).clinicChoice.next(
          state,
          dispatch,
        );

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

        const nextState = getNewAppointmentFlow(state).clinicChoice.next(
          state,
          dispatch,
        );

        expect(nextState).to.equal('requestDateTime');
        expect(dispatch.called).to.be.true;
      });
    });
  });

  describe('ccPreferences page', () => {
    describe('next page', () => {
      it('should be reasonForAppointment if user has no address on file', () => {
        const state = {
          featureToggles: {
            loading: false,
          },
        };

        expect(getNewAppointmentFlow(state).ccPreferences.next).to.equal(
          'ccLanguage',
        );
      });

      it('should be ccLanguage if user has an address on file', () => {
        const state = {
          user: {
            profile: {
              vapContactInfo: {
                residentialAddress: {
                  addressLine1: '597 Mt Prospect Ave',
                },
              },
            },
          },
          featureToggles: {
            loading: false,
          },
        };

        expect(getNewAppointmentFlow(state).ccPreferences.next).to.equal(
          'ccLanguage',
        );
      });
    });
  });

  describe('reasonForAppointment page', () => {
    describe('next page', () => {
      it('should be visitType if in the VA flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.VAMC.id,
            },
          },
        };

        const nextState = getNewAppointmentFlow(
          state,
        ).reasonForAppointment.next(state);
        expect(nextState).to.equal('visitType');
      });

      it('should be contactInfo if in the CC flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE.id,
            },
          },
        };

        const nextState = getNewAppointmentFlow(
          state,
        ).reasonForAppointment.next(state);
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
            typeOfCareId: TYPE_OF_CARE_IDS.EYE_CARE_ID,
          },
        },
      };
      const nextState = await getNewAppointmentFlow(state).typeOfCare.next(
        state,
        dispatch,
      );
      expect(nextState).to.equal('typeOfEyeCare');
    });

    it('should be typeOfFacility page when optometry selected', async () => {
      mockFetch();
      mockFacilitiesApi({
        children: true,
        ids: ['983', '984'],
        response: [new MockFacilityResponse()],
      });
      mockSchedulingConfigurationsApi({
        isCCEnabled: true,
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: '4088',
                requestEnabled: true,
              }),
            ],
          }),
        ],
      });
      mockV2CommunityCareEligibility({
        parentSites: [],
        careType: 'Optometry',
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
            typeOfCareId: TYPE_OF_CARE_IDS.EYE_CARE_ID,
            typeOfEyeCareId: TYPE_OF_CARE_IDS.OPTOMETRY_ID,
          },
        },
      };

      const getState = () => state;
      const dispatch = action =>
        typeof action === 'function' ? action(sinon.spy(), getState) : null;
      const nextState = await getNewAppointmentFlow(state).typeOfEyeCare.next(
        state,
        dispatch,
      );
      expect(nextState).to.equal('typeOfFacility');
    });

    it('should be vaFacility page when Ophthalmology selected', async () => {
      mockFetch();
      const state = {
        ...userState,
        featureToggles: {
          loading: false,
          vaOnlineSchedulingDirect: true,
          vaOnlineSchedulingCommunityCare: true,
        },
        newAppointment: {
          data: {
            typeOfCareId: TYPE_OF_CARE_IDS.EYE_CARE_ID,
            typeOfEyeCareId: TYPE_OF_CARE_IDS.OPHTHALMOLOGY_ID,
          },
        },
      };

      const getState = () => state;
      const dispatch = action =>
        typeof action === 'function' ? action(sinon.spy(), getState) : null;
      const nextState = await getNewAppointmentFlow(state).typeOfEyeCare.next(
        state,
        dispatch,
      );
      expect(nextState).to.equal('vaFacilityV2');
    });
  });
});
