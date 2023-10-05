import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import past from '../../services/mocks/var/past.json';
import supportedSites from '../../services/mocks/var/sites-supporting-var.json';
import parentFacilities from '../../services/mocks/var/facilities.json';

import getNewAppointmentFlow from '../../new-appointment/newAppointmentFlow';
import { FACILITY_TYPES } from '../../utils/constants';
import { mockParentSites } from '../mocks/helpers';
import { mockFacilitiesFetchByVersion } from '../mocks/fetch';
import { getParentSiteMock } from '../mocks/v0';
import {
  mockSchedulingConfigurations,
  mockV2CommunityCareEligibility,
} from '../mocks/helpers.v2';
import { getSchedulingConfigurationMock } from '../mocks/v2';
import { createMockFacilityByVersion } from '../mocks/data';

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
        mockFacilitiesFetchByVersion({
          children: true,
          ids: ['983'],
          facilities: [
            createMockFacilityByVersion({
              id: '983',
            }),
          ],
        });
        mockParentSites(['983'], [getParentSiteMock({ id: '983' })]);
        mockSchedulingConfigurations(
          [
            getSchedulingConfigurationMock({
              id: '983',
              typeOfCareId: 'primaryCare',
              requestEnabled: true,
            }),
          ],
          true,
        );

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
              typeOfCareId: '323',
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
        const nextState = await getNewAppointmentFlow(state).typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('vaFacilityV2');
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
        const nextState = await getNewAppointmentFlow(state).typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('typeOfCare');
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
        const nextState = await getNewAppointmentFlow(state).typeOfCare.next(
          state,
          dispatch,
        );

        expect(nextState).to.equal('typeOfCare');
      });

      it('should be ccRequestDateTime if CC support and typeOfCare is podiatry', async () => {
        mockFetch();
        mockFacilitiesFetchByVersion({
          children: true,
          ids: ['983', '984'],
          facilities: [
            createMockFacilityByVersion({
              id: '983',
            }),
          ],
        });
        mockSchedulingConfigurations(
          [
            getSchedulingConfigurationMock({
              id: '983',
              typeOfCareId: '411',
              requestEnabled: true,
              communityCare: true,
            }),
          ],
          true,
        );
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
              typeOfCareId: 'tbd-podiatry',
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
              typeOfCareId: 'SLEEP',
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
        mockFacilitiesFetchByVersion({
          children: true,
          ids: ['983', '984'],
          facilities: [
            createMockFacilityByVersion({
              id: '983',
            }),
          ],
        });
        mockSchedulingConfigurations(
          [
            getSchedulingConfigurationMock({
              id: '983',
              typeOfCareId: 'primaryCare',
              requestEnabled: true,
            }),
          ],
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
              typeOfCareId: '323',
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
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
              typeOfCareId: '203',
            },
          },
        };

        const nextState = getNewAppointmentFlow(state).typeOfFacility.next(
          state,
        );
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

        const nextState = getNewAppointmentFlow(state).typeOfFacility.next(
          state,
          dispatch,
        );
        expect(nextState).to.equal('ccRequestDateTime');
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
      it('should be clinicChoice page if eligible', async () => {
        mockFetch();
        setFetchJSONResponse(global.fetch, past);
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
        const dispatch = sinon.spy();

        const nextState = await getNewAppointmentFlow(state).vaFacilityV2.next(
          state,
          dispatch,
        );
        expect(dispatch.firstCall.args[0].type).to.equal(
          'newAppointment/START_DIRECT_SCHEDULE_FLOW',
        );
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
              facilityType: FACILITY_TYPES.VAMC,
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

  describe.skip('ccPreferences page', () => {
    describe('next page', () => {
      it('should be reasonForAppointment if user has no address on file', () => {
        const state = {
          featureToggles: {
            loading: false,
          },
        };

        expect(getNewAppointmentFlow(state).ccPreferences.next(state)).to.equal(
          'reasonForAppointment',
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

        expect(getNewAppointmentFlow(state).ccPreferences.next(state)).to.equal(
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
              facilityType: FACILITY_TYPES.VAMC,
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
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
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
            typeOfCareId: 'EYE',
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
      mockFacilitiesFetchByVersion({
        children: true,
        ids: ['983', '984'],
        facilities: [
          createMockFacilityByVersion({
            id: '983',
          }),
        ],
      });
      mockSchedulingConfigurations(
        [
          getSchedulingConfigurationMock({
            id: '983',
            typeOfCareId: 'Optometry',
            requestEnabled: true,
          }),
        ],
        true,
      );
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
            typeOfCareId: 'EYE',
            typeOfEyeCareId: '408',
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
            typeOfEyeCareId: '407',
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
