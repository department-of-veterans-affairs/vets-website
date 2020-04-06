import sinon from 'sinon';

import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import past from '../api/past.json';
import supportedSites from '../api/sites-supporting-var.json';

import newAppointmentFlow from '../newAppointmentFlow';
import { FACILITY_TYPES, FLOW_TYPES } from '../utils/constants';

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
      test('should be vaFacility page if no systems have CC support', async () => {
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

        const dispatch = sinon.spy();
        const nextState = await newAppointmentFlow.typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).toBe('vaFacility');
        resetFetch();
      });

      test('should be vaFacility page if CC check has an error', async () => {
        mockFetch();
        setFetchJSONResponse(global.fetch, supportedSites);
        setFetchJSONFailure(global.fetch.onCall(1), {});
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

        const dispatch = sinon.spy();
        const nextState = await newAppointmentFlow.typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).toBe('vaFacility');
        resetFetch();
      });

      test(
        'should be typeOfCare page if CC check has an error and podiatry chosen',
        async () => {
          mockFetch();
          setFetchJSONResponse(global.fetch, supportedSites);
          setFetchJSONFailure(global.fetch.onCall(1), {});
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

          const dispatch = sinon.spy();
          const nextState = await newAppointmentFlow.typeOfCare.next(
            state,
            dispatch,
          );
          expect(nextState).toBe('typeOfCare');
          resetFetch();
        }
      );

      test(
        'should be the current page if no CC support and typeOfCare is podiatry',
        async () => {
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

          const dispatch = sinon.spy();
          const nextState = await newAppointmentFlow.typeOfCare.next(
            state,
            dispatch,
          );
          expect(nextState).toBe('typeOfCare');
        }
      );

      test(
        'should be requestDateTime if CC support and typeOfCare is podiatry',
        async () => {
          mockFetch();
          setFetchJSONResponse(global.fetch, supportedSites);
          setFetchJSONResponse(global.fetch.onCall(1), {
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

          const dispatch = sinon.spy();
          const nextState = await newAppointmentFlow.typeOfCare.next(
            state,
            dispatch,
          );
          expect(nextState).toBe('requestDateTime');
          resetFetch();
        }
      );

      test('should be typeOfSleepCare if sleep care chosen', async () => {
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
        expect(nextState).toBe('typeOfSleepCare');
      });

      test('should be typeOfFacility page if site has CC support', async () => {
        mockFetch();
        setFetchJSONResponse(global.fetch, supportedSites);
        setFetchJSONResponse(global.fetch.onCall(1), {
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

        const dispatch = sinon.spy();
        const nextState = await newAppointmentFlow.typeOfCare.next(
          state,
          dispatch,
        );
        expect(nextState).toBe('typeOfFacility');

        resetFetch();
      });
    });
  });

  describe('typeOfFacility page', () => {
    describe('next page', () => {
      test(
        'should be audiologyCareType if CC supported and audiology chosen',
        () => {
          const state = {
            newAppointment: {
              data: {
                facilityType: FACILITY_TYPES.COMMUNITY_CARE,
                typeOfCareId: '203',
              },
            },
          };

          const nextState = newAppointmentFlow.typeOfFacility.next(state);
          expect(nextState).toBe('audiologyCareType');
        }
      );

      test('should be requestDateTime if CC is chosen', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
              typeOfCareId: '320',
            },
          },
        };

        const nextState = newAppointmentFlow.typeOfFacility.next(state);
        expect(nextState).toBe('requestDateTime');
      });

      test('should be vaFacility page if they chose VA', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: 'va',
              typeOfCareId: '203',
            },
          },
        };

        const nextState = newAppointmentFlow.typeOfFacility.next(state);
        expect(nextState).toBe('vaFacility');
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
      test('should be clinicChoice page if eligible', async () => {
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
        expect(dispatch.firstCall.args[0].type).toBe(
          'newAppointment/START_DIRECT_SCHEDULE_FLOW',
        );
        expect(nextState).toBe('clinicChoice');

        resetFetch();
      });
      test(
        'should be requestDateTime page if past appointments request errors',
        async () => {
          mockFetch();
          setFetchJSONFailure(global.fetch, {});
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
          expect(dispatch.firstCall.args[0].type).toBe(
            'newAppointment/START_REQUEST_APPOINTMENT_FLOW',
          );
          expect(nextState).toBe('requestDateTime');

          resetFetch();
        }
      );
      test('should throw error if not eligible for requests or direct', async () => {
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
          expect(false).toBe(true);
        } catch (e) {
          expect(e.message).toBe(
            'Veteran not eligible for direct scheduling or requests',
          );
        }
      });
      test('should be requestDateTime if not direct eligible', async () => {
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
        expect(nextState).toBe('requestDateTime');
      });
    });
    // previous state
    describe('previous page', () => {
      test('should be typeOfCare page if no user systems are CC eligibile', () => {
        const state = {
          ...defaultState,
          newAppointment: {
            ...defaultState.newAppointment,
            data: {
              typeOfCareId: '323',
              vaParent: '983',
              vaFacility: '983',
              facilityType: FACILITY_TYPES.VAMC,
            },
            hasCCEnabledSystems: false,
          },
        };
        const nextState = newAppointmentFlow.vaFacility.previous(state);
        expect(nextState).toBe('typeOfCare');
      });

      test('should be typeOfFacility if user is CC eligible ', () => {
        const state = {
          ...defaultState,
          newAppointment: {
            ...defaultState.newAppointment,
            data: {
              typeOfCareId: '323',
              vaParent: '983',
              vaFacility: '983',
              facilityType: FACILITY_TYPES.VAMC,
            },
            ccEnabledSystems: ['983'],
            isCCEligible: true,
          },
        };

        const nextState = newAppointmentFlow.vaFacility.previous(state);
        expect(nextState).toBe('typeOfFacility');
      });

      test(
        'should be typeOfCare if user if user has CC enabled systems but is not CC eligible',
        () => {
          const state = {
            ...defaultState,
            newAppointment: {
              ...defaultState.newAppointment,
              data: {
                typeOfCareId: '323',
                vaParent: '983',
                vaFacility: '983',
                facilityType: FACILITY_TYPES.VAMC,
              },
              ccEnabledSystems: ['983'],
              isCCEligible: false,
            },
          };

          const nextState = newAppointmentFlow.vaFacility.previous(state);
          expect(nextState).toBe('typeOfCare');
        }
      );

      test(
        'should be typeOfCare if selected type of care is not CC eligible',
        () => {
          const state = {
            ...defaultState,
            newAppointment: {
              ...defaultState.newAppointment,
              data: {
                typeOfCareId: '502',
                vaParent: '983',
                vaFacility: '983',
                facilityType: FACILITY_TYPES.VAMC,
              },
              ccEnabledSystems: ['983'],
              isCCEligible: true,
            },
          };

          const nextState = newAppointmentFlow.vaFacility.previous(state);
          expect(nextState).toBe('typeOfCare');
        }
      );
      test(
        'should be typeOfSleepCare page when back button selected along sleep care flow',
        () => {
          const state = {
            ...defaultState,
            newAppointment: {
              ...defaultState.newAppointment,
              data: {
                typeOfCareId: 'SLEEP',
                vaParent: '983',
                vaFacility: '983',
                facilityType: FACILITY_TYPES.VAMC,
              },
              hasCCEnabledSystems: false,
              isCCEligible: true,
            },
          };

          const nextState = newAppointmentFlow.vaFacility.previous(state);
          expect(nextState).toBe('typeOfSleepCare');
        }
      );
      // testing eyecare flow
      test(
        'should be typeOfEyeCare page when back button selected along Ophthalmology flow',
        () => {
          const state = {
            ...defaultState,
            newAppointment: {
              ...defaultState.newAppointment,
              data: {
                typeOfCareId: 'EYE',
                typeOfEyeCareId: '407',
                vaParent: '983',
                vaFacility: '983',
                facilityType: FACILITY_TYPES.VAMC,
              },
              hasCCEnabledSystems: false,
              isCCEligible: true,
            },
          };

          const nextState = newAppointmentFlow.vaFacility.previous(state);
          expect(nextState).toBe('typeOfEyeCare');
        }
      );
      test(
        'should be typeOfFacility page when back button selected along optometry flow',
        () => {
          const state = {
            ...defaultState,
            newAppointment: {
              ...defaultState.newAppointment,
              data: {
                typeOfCareId: 'EYE',
                typeOfEyeCareId: '408',
                vaParent: '983',
                vaFacility: '983',
                facilityType: FACILITY_TYPES.VAMC,
              },
              hasCCEnabledSystems: true,
              isCCEligible: true,
            },
          };

          const nextState = newAppointmentFlow.vaFacility.previous(state);
          expect(nextState).toBe('typeOfFacility');
        }
      );
    });
  });

  describe('requestDateTime page', () => {
    describe('next page', () => {
      test('should be ccPreferences if in the CC flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
            },
          },
        };

        const nextState = newAppointmentFlow.requestDateTime.next(state);

        expect(nextState).toBe('ccPreferences');
      });
      test('should be reasonForAppointment if in the VA flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.VAMC,
            },
          },
        };

        const nextState = newAppointmentFlow.requestDateTime.next(state);

        expect(nextState).toBe('reasonForAppointment');
      });
    });
    describe('previous page', () => {
      test('should be typeOfFacility if in the CC flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
            },
          },
        };

        const nextState = newAppointmentFlow.requestDateTime.previous(state);

        expect(nextState).toBe('typeOfFacility');
      });
      test('should be audiologyCareType if user chose audiology', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
              typeOfCareId: '203',
            },
          },
        };

        const nextState = newAppointmentFlow.requestDateTime.previous(state);

        expect(nextState).toBe('audiologyCareType');
      });
      test('should be vaFacility if in the VA flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.VAMC,
            },
          },
        };

        const nextState = newAppointmentFlow.requestDateTime.previous(state);

        expect(nextState).toBe('vaFacility');
      });
      test('should be typeOfCare if in the CC flow and user chose podiatry', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
              typeOfCareId: 'tbd-podiatry',
            },
          },
        };

        const nextState = newAppointmentFlow.requestDateTime.previous(state);

        expect(nextState).toBe('typeOfCare');
      });
    });
  });

  describe('clinicChoicePage', () => {
    describe('next page', () => {
      test('should be preferredDate if user chose a clinic', () => {
        const state = {
          newAppointment: {
            data: {
              clinicId: '123',
            },
          },
        };

        const nextState = newAppointmentFlow.clinicChoice.next(state);

        expect(nextState).toBe('preferredDate');
      });

      test(
        'should be requestDateTime if user chose that they need a different clinic',
        () => {
          const state = {
            newAppointment: {
              data: {
                clinicId: 'NONE',
              },
            },
          };
          const dispatch = sinon.spy();

          const nextState = newAppointmentFlow.clinicChoice.next(state, dispatch);

          expect(nextState).toBe('requestDateTime');
          expect(dispatch.called).toBe(true);
        }
      );
    });
  });

  describe('reasonForAppointment page', () => {
    describe('next page', () => {
      test('should be visitType if in the VA flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.VAMC,
            },
          },
        };

        const nextState = newAppointmentFlow.reasonForAppointment.next(state);
        expect(nextState).toBe('visitType');
      });

      test('should be contactInfo if in the CC flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
            },
          },
        };

        const nextState = newAppointmentFlow.reasonForAppointment.next(state);
        expect(nextState).toBe('contactInfo');
      });
    });

    describe('previous page', () => {
      test('should be ccPreferences if in CC flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
            },
            flowType: FLOW_TYPES.DIRECT,
          },
        };

        const nextState = newAppointmentFlow.reasonForAppointment.previous(
          state,
        );
        expect(nextState).toBe('ccPreferences');
      });

      test('should be selectDateTime if in the direct schedule flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.VAMC,
            },
            flowType: FLOW_TYPES.DIRECT,
          },
        };

        const nextState = newAppointmentFlow.reasonForAppointment.previous(
          state,
        );

        expect(nextState).toBe('selectDateTime');
      });

      test('should be requestDateTime if in request flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.VAMC,
            },
            flowType: FLOW_TYPES.REQUEST,
          },
        };

        const nextState = newAppointmentFlow.reasonForAppointment.previous(
          state,
        );

        expect(nextState).toBe('requestDateTime');
      });
    });
  });

  describe('contactInfo page', () => {
    describe('previous page', () => {
      test('should be visitType if in VA request flow', () => {
        const state = {
          newAppointment: {
            data: {},
          },
        };
        expect(newAppointmentFlow.contactInfo.previous(state)).toBe(
          'visitType',
        );
      });
      test('should be reasonForAppointment if in direct schedule flow', () => {
        const state = {
          newAppointment: {
            data: {},
            flowType: FLOW_TYPES.DIRECT,
          },
        };
        expect(newAppointmentFlow.contactInfo.previous(state)).toBe(
          'reasonForAppointment',
        );
      });
      test('should be reasonForAppointment if in CC flow', () => {
        const state = {
          newAppointment: {
            data: {
              facilityType: FACILITY_TYPES.COMMUNITY_CARE,
            },
          },
        };
        expect(newAppointmentFlow.contactInfo.previous(state)).toBe(
          'reasonForAppointment',
        );
      });
    });
  });

  describe('eye care page', () => {
    test('should choose eye care page', async () => {
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
      expect(nextState).toBe('typeOfEyeCare');
    });

    test('should be typeOfFacility page when optometry selected', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, supportedSites);
      setFetchJSONResponse(global.fetch.onCall(1), {
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

      const dispatch = sinon.spy();
      const nextState = await newAppointmentFlow.typeOfEyeCare.next(
        state,
        dispatch,
      );
      expect(nextState).toBe('typeOfFacility');

      resetFetch();
    });

    test('should be vaFacility page when Ophthalmology selected', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, supportedSites);
      setFetchJSONResponse(global.fetch.onCall(1), {
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

      const dispatch = sinon.spy();
      const nextState = await newAppointmentFlow.typeOfEyeCare.next(
        state,
        dispatch,
      );
      expect(nextState).toBe('vaFacility');

      resetFetch();
    });
  });
});
