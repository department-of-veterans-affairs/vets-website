import {
  getChosenClinicInfo,
  getChosenFacilityInfo,
  getChosenFacilityDetails,
  getClinicPageInfo,
  getClinicsForChosenFacility,
  getDateTimeSelect,
  getFacilityPageInfo,
  getFlowType,
  getFormData,
  getFormPageInfo,
  getNewAppointment,
  getPreferredDate,
  getTypeOfCare,
  getCancelInfo,
  getCCEType,
  isWelcomeModalDismissed,
  selectCernerFacilities,
} from '../../utils/selectors';

import { selectIsCernerOnlyPatient } from '../../../../platform/user/selectors';

describe('VAOS selectors', () => {
  describe('getNewAppointment', () => {
    test('should return newAppointment state', () => {
      const state = {
        appointment: {},
        newAppointment: {
          typeOfCareId: '123',
        },
      };
      const newAppointment = getNewAppointment(state);
      expect(newAppointment).toBe(state.newAppointment);
    });
  });

  describe('getFormData', () => {
    test('should return newAppointment.data', () => {
      const state = {
        appointment: {},
        newAppointment: {
          data: { typeOfCareId: '123' },
        },
      };
      const formData = getFormData(state);
      expect(formData).toBe(state.newAppointment.data);
    });
  });

  describe('getFlowType', () => {
    test('should return newAppointment state', () => {
      const state = {
        appointment: {},
        newAppointment: {
          data: { typeOfCareId: '123' },
          flowType: 'DIRECT',
        },
      };
      expect(getFlowType(state)).toBe('DIRECT');
    });
  });

  describe('getFormPageInfo', () => {
    test('should return info needed for form pages', () => {
      const state = {
        newAppointment: {
          pages: {
            testPage: {},
          },
          data: {},
          pageChangeInProgress: false,
        },
      };
      const pageInfo = getFormPageInfo(state, 'testPage');

      expect(pageInfo.pageChangeInProgress).toBe(
        state.newAppointment.pageChangeInProgress,
      );
      expect(pageInfo.data).toBe(state.newAppointment.data);
      expect(pageInfo.schema).toBe(state.newAppointment.pages.testPage);
    });
  });

  describe('getFacilityPageInfo', () => {
    test('should return typeOfCare string and begin loading parentFacilities', () => {
      const state = {
        user: {
          profile: {
            facilities: [],
          },
        },
        newAppointment: {
          pages: {},
          data: {
            typeOfCareId: '160',
            facilityType: 'vamc',
            vaParent: '983',
          },
          facilities: {},
          eligibility: {},
          parentFacilities: [{}],
          facilityDetails: {},
        },
      };

      const newState = getFacilityPageInfo(state);
      expect(newState.typeOfCare).toBe('Pharmacy');
      expect(newState.loadingParentFacilities).toBe(true);
    });
    test('should return eligibility error flag', () => {
      const state = {
        user: {
          profile: {
            facilities: [],
          },
        },
        newAppointment: {
          pages: {},
          data: {
            typeOfCareId: '160',
            facilityType: 'vamc',
            vaParent: '983',
          },
          facilities: {},
          eligibility: {},
          parentFacilities: [{}],
          facilityDetails: {},
          eligibilityStatus: 'failed',
        },
      };

      const newState = getFacilityPageInfo(state);
      expect(newState.hasEligibilityError).toBe(true);
    });
    test('should return Cerner facilities', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '123', isCerner: true },
              { facilityId: '124', isCerner: false },
            ],
          },
        },
        newAppointment: {
          pages: {},
          data: {
            typeOfCareId: '160',
            facilityType: 'vamc',
            vaParent: '983',
          },
          facilities: {},
          eligibility: {},
          parentFacilities: [{}],
          facilityDetails: {},
          eligibilityStatus: 'failed',
        },
      };

      const newState = getFacilityPageInfo(state);
      expect(newState.cernerFacilities).toEqual(['123']);
    });
  });

  describe('getChosenFacilityInfo', () => {
    test('should return a stored facility object', () => {
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: '323',
            clinicId: '124',
            vaParent: '123',
            vaFacility: '983',
          },
          facilities: {
            '323_123': [
              {
                institutionCode: '983',
              },
            ],
          },
        },
      };

      expect(getChosenFacilityInfo(state)).toBe(
        state.newAppointment.facilities['323_123'][0],
      );
    });
  });

  describe('getChosenFacilityDetails', () => {
    test('should return a stored facility details object', () => {
      const state = {
        newAppointment: {
          data: {
            vaFacility: '983',
          },
          facilityDetails: {
            983: {
              institutionCode: '983',
            },
          },
        },
      };

      expect(getChosenFacilityDetails(state)).toBe(
        state.newAppointment.facilityDetails['983'],
      );
    });
  });

  describe('getChosenClinicInfo', () => {
    test('should return a stored clinic object', () => {
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: '323',
            vaFacility: '688GB',
            clinicId: '124',
          },
          clinics: {
            '688GB_323': [
              {
                clinicId: '123',
              },
              {
                clinicId: '124',
              },
            ],
          },
        },
      };
      const clinic = getChosenClinicInfo(state);
      expect(clinic.clinicId).toBe(state.newAppointment.data.clinicId);
    });
  });

  describe('getTypeOfCare', () => {
    test('get eye type of care', () => {
      const data = {
        typeOfCareId: 'EYE',
        typeOfEyeCareId: '408',
      };

      const typeOfCare = getTypeOfCare(data);
      expect(typeOfCare.id).toBe('408');
      expect(typeOfCare.name).toBe('Optometry');
    });

    test('get sleep type of care', () => {
      const data = {
        typeOfCareId: 'SLEEP',
        typeOfSleepCareId: '349',
      };

      const typeOfCare = getTypeOfCare(data);
      expect(typeOfCare.id).toBe('349');
      expect(typeOfCare.name).toBe(
        'Continuous Positive Airway Pressure (CPAP)',
      );
    });

    test('get audiology type of care', () => {
      const data = {
        typeOfCareId: '203',
        audiologyType: 'CCAUDHEAR',
        facilityType: 'communityCare',
      };

      const typeOfCare = getTypeOfCare(data);
      expect(typeOfCare.ccId).toBe('CCAUDHEAR');
    });

    test('get podiatry type of care', () => {
      const data = {
        typeOfCareId: 'tbd-podiatry',
      };

      const typeOfCare = getTypeOfCare(data);
      expect(typeOfCare.name).toBe('Podiatry');
    });

    test('get pharmacy type of care', () => {
      const data = {
        typeOfCareId: '160',
      };

      const typeOfCare = getTypeOfCare(data);
      expect(typeOfCare.name).toBe('Pharmacy');
    });
  });

  describe('getClinicsForChosenFacility', () => {
    test('should return relevant clinics list', () => {
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: '323',
            vaFacility: '688GB',
          },
          clinics: {
            '688GB_323': [
              {
                clinicId: '123',
              },
              {
                clinicId: '124',
              },
            ],
          },
        },
      };
      const clinics = getClinicsForChosenFacility(state);
      expect(clinics).toBe(state.newAppointment.clinics['688GB_323']);
    });
  });

  describe('getPreferredDate', () => {
    test('should return info needed for form pages', () => {
      const state = {
        newAppointment: {
          pages: {},
          data: {
            typeOfCareId: '323',
          },
          pageChangeInProgress: false,
        },
      };
      const preferredDate = getPreferredDate(state, 'testPage');

      expect(preferredDate.pageChangeInProgress).toBe(
        state.newAppointment.pageChangeInProgress,
      );
      expect(preferredDate.data).toBe(state.newAppointment.data);
      expect(preferredDate.schema).toBe(
        state.newAppointment.pages.preferredDate,
      );
      expect(preferredDate.typeOfCare).toBe('Primary care');
    });
  });

  describe('getDateTimeSelect', () => {
    test('should return available dates data and timezone', () => {
      const availableSlots = [
        {
          date: '2019-10-24',
          datetime: '2019-10-24T09:00:00-07:00',
        },
        {
          date: '2019-10-24',
          datetime: '2019-10-24T09:30:00-07:00',
        },
      ];

      const state = {
        newAppointment: {
          pages: {
            selectDateTime: {},
          },
          data: {
            typeOfCareId: '323',
            vaParent: '983',
            vaFacility: '983',
          },
          eligibility: {
            '983_323': {
              request: true,
            },
          },
          facilities: {
            '323_983': [
              {
                institutionCode: '983',
                rootStationCode: '983',
              },
            ],
          },
          availableSlots,
        },
      };

      const data = getDateTimeSelect(state, 'selectDateTime');
      expect(data.timezone).toBe('Mountain time (MT)');
      expect(data.availableDates).toEqual(['2019-10-24']);
      expect(data.availableSlots).toEqual(availableSlots);
    });
  });

  describe('getClinicPageInfo', () => {
    test('should return info needed for the clinic page', () => {
      const state = {
        newAppointment: {
          pages: {},
          data: {
            typeOfCareId: '323',
            vaFacility: '983',
          },
          pageChangeInProgress: false,
          clinics: {},
          eligibility: {
            '983_323': {},
          },
        },
      };
      const pageInfo = getClinicPageInfo(state, 'clinicChoice');

      expect(pageInfo.pageChangeInProgress).toBe(
        state.newAppointment.pageChangeInProgress,
      );
      expect(pageInfo.data).toBe(state.newAppointment.data);
      expect(pageInfo.schema).toBe(state.newAppointment.pages.clinicChoice);
      expect(pageInfo.typeOfCare).toEqual({
        id: '323',
        ccId: 'CCPRMYRTNE',
        group: 'primary',
        name: 'Primary care',
        cceType: 'PrimaryCare',
      });
    });
  });

  describe('getCancelInfo', () => {
    test('should fetch facility in info', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '123', isCerner: true }],
          },
        },
        appointments: {
          appointmentToCancel: {
            facility: {
              facilityCode: '123',
            },
          },
          facilityData: {
            123: {},
          },
        },
      };

      const cancelInfo = getCancelInfo(state);

      expect(cancelInfo.facility).toBe(state.appointments.facilityData['123']);
    });
    test('should fetch facility from clinic map', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '123', isCerner: true }],
          },
        },
        appointments: {
          appointmentToCancel: {
            facilityId: '123',
            clinicId: '456',
          },
          systemClinicToFacilityMap: {
            '123_456': {},
          },
        },
      };

      const cancelInfo = getCancelInfo(state);

      expect(cancelInfo.facility).toBe(
        state.appointments.systemClinicToFacilityMap['123_456'],
      );
    });
  });

  describe('getCCEType', () => {
    test('should return cce type for Audiology', () => {
      const state = {
        appointment: {},
        newAppointment: {
          data: {
            typeOfCareId: '203',
          },
        },
      };
      const cceType = getCCEType(state);
      expect(cceType).toBe('Audiology');
    });
    test('should return cce type for Optometry', () => {
      const state = {
        appointment: {},
        newAppointment: {
          data: {
            typeOfCareId: 'EYE',
            typeOfEyeCareId: '408',
          },
        },
      };
      const cceType = getCCEType(state);
      expect(cceType).toBe('Optometry');
    });
  });

  describe('isWelcomeModalDismissed', () => {
    test('should return dismissed if key is in list', () => {
      const state = {
        announcements: {
          dismissed: ['welcome-to-new-vaos'],
        },
      };
      expect(isWelcomeModalDismissed(state)).toBe(true);
    });
    test('should not return dismissed if key is not in list', () => {
      const state = {
        announcements: {
          dismissed: ['welcome-to-new-va'],
        },
      };
      expect(isWelcomeModalDismissed(state)).toBe(false);
    });
  });

  describe('selectIsCernerOnlyPatient', () => {
    test('should return true if Cerner only', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '123', isCerner: true }],
          },
        },
      };
      expect(selectIsCernerOnlyPatient(state)).toBe(true);
    });
    test('should return false if not Cerner only', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '123', isCerner: true },
              { facilityId: '124', isCerner: false },
            ],
          },
        },
      };
      expect(selectIsCernerOnlyPatient(state)).toBe(false);
    });
  });

  describe('selectCernerFacilities', () => {
    test('should return collection of cerner facilities', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '123', isCerner: true },
              { facilityId: '124', isCerner: false },
            ],
          },
        },
      };

      expect(selectCernerFacilities(state).length).toBe(1);
    });

    test('should return empty collection of cerner facilities', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '123', isCerner: false },
              { facilityId: '124', isCerner: false },
            ],
          },
        },
      };

      expect(selectCernerFacilities(state).length).toBe(0);
    });
  });
});
