import { expect } from 'chai';

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

import { selectIsCernerOnlyPatient } from 'platform/user/selectors';
import {
  VHA_FHIR_ID,
  APPOINTMENT_TYPES,
  VIDEO_TYPES,
} from '../../utils/constants';

describe('VAOS selectors', () => {
  describe('getNewAppointment', () => {
    it('should return newAppointment state', () => {
      const state = {
        appointment: {},
        newAppointment: {
          typeOfCareId: '123',
        },
      };
      const newAppointment = getNewAppointment(state);
      expect(newAppointment).to.equal(state.newAppointment);
    });
  });

  describe('getFormData', () => {
    it('should return newAppointment.data', () => {
      const state = {
        appointment: {},
        newAppointment: {
          data: { typeOfCareId: '123' },
        },
      };
      const formData = getFormData(state);
      expect(formData).to.equal(state.newAppointment.data);
    });
  });

  describe('getFlowType', () => {
    it('should return newAppointment state', () => {
      const state = {
        appointment: {},
        newAppointment: {
          data: { typeOfCareId: '123' },
          flowType: 'DIRECT',
        },
      };
      expect(getFlowType(state)).to.equal('DIRECT');
    });
  });

  describe('getFormPageInfo', () => {
    it('should return info needed for form pages', () => {
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

      expect(pageInfo.pageChangeInProgress).to.equal(
        state.newAppointment.pageChangeInProgress,
      );
      expect(pageInfo.data).to.equal(state.newAppointment.data);
      expect(pageInfo.schema).to.equal(state.newAppointment.pages.testPage);
    });
  });

  describe('getFacilityPageInfo', () => {
    it('should return typeOfCare string and begin loading parentFacilities', () => {
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
      expect(newState.typeOfCare).to.equal('Pharmacy');
      expect(newState.loadingParentFacilities).to.be.true;
    });
    it('should return eligibility error flag', () => {
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
      expect(newState.hasEligibilityError).to.be.true;
    });
    it('should return Cerner facilities', () => {
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
      expect(newState.cernerFacilities).to.deep.equal(['123']);
    });
  });

  describe('getChosenFacilityInfo', () => {
    it('should return a stored facility object', () => {
      const state = {
        newAppointment: {
          data: {
            typeOfCareId: '323',
            clinicId: '124',
            vaParent: 'var123',
            vaFacility: 'var983',
          },
          facilities: {
            '323_var123': [
              {
                id: 'var983',
              },
            ],
          },
        },
      };

      expect(getChosenFacilityInfo(state)).to.equal(
        state.newAppointment.facilities['323_var123'][0],
      );
    });
  });

  describe('getChosenFacilityDetails', () => {
    it('should return a stored facility details object', () => {
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

      expect(getChosenFacilityDetails(state)).to.equal(
        state.newAppointment.facilityDetails['983'],
      );
    });
  });

  describe('getChosenClinicInfo', () => {
    it('should return a stored clinic object', () => {
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
                id: 'var688GB_123',
              },
              {
                id: 'var688GB_124',
              },
            ],
          },
        },
      };
      const clinic = getChosenClinicInfo(state);
      expect(clinic.id.split('_')[1]).to.equal(
        state.newAppointment.data.clinicId,
      );
    });
  });

  describe('getTypeOfCare', () => {
    it('get eye type of care', () => {
      const data = {
        typeOfCareId: 'EYE',
        typeOfEyeCareId: '408',
      };

      const typeOfCare = getTypeOfCare(data);
      expect(typeOfCare.id).to.equal('408');
      expect(typeOfCare.name).to.equal('Optometry');
    });

    it('get sleep type of care', () => {
      const data = {
        typeOfCareId: 'SLEEP',
        typeOfSleepCareId: '349',
      };

      const typeOfCare = getTypeOfCare(data);
      expect(typeOfCare.id).to.equal('349');
      expect(typeOfCare.name).to.equal(
        'Continuous Positive Airway Pressure (CPAP)',
      );
    });

    it('get audiology type of care', () => {
      const data = {
        typeOfCareId: '203',
        audiologyType: 'CCAUDHEAR',
        facilityType: 'communityCare',
      };

      const typeOfCare = getTypeOfCare(data);
      expect(typeOfCare.ccId).to.equal('CCAUDHEAR');
    });

    it('get podiatry type of care', () => {
      const data = {
        typeOfCareId: 'tbd-podiatry',
      };

      const typeOfCare = getTypeOfCare(data);
      expect(typeOfCare.name).to.equal('Podiatry');
    });

    it('get pharmacy type of care', () => {
      const data = {
        typeOfCareId: '160',
      };

      const typeOfCare = getTypeOfCare(data);
      expect(typeOfCare.name).to.equal('Pharmacy');
    });
  });

  describe('getClinicsForChosenFacility', () => {
    it('should return relevant clinics list', () => {
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
      expect(clinics).to.equal(state.newAppointment.clinics['688GB_323']);
    });
  });

  describe('getPreferredDate', () => {
    it('should return info needed for form pages', () => {
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

      expect(preferredDate.pageChangeInProgress).to.equal(
        state.newAppointment.pageChangeInProgress,
      );
      expect(preferredDate.data).to.equal(state.newAppointment.data);
      expect(preferredDate.schema).to.equal(
        state.newAppointment.pages.preferredDate,
      );
      expect(preferredDate.typeOfCare).to.equal('Primary care');
    });
  });

  describe('getDateTimeSelect', () => {
    it('should return available dates data and timezone', () => {
      const availableSlots = [
        {
          start: '2019-10-24T09:00:00',
          end: '2019-10-24T09:20:00',
        },
        {
          start: '2019-10-24T09:30:00',
          end: '2019-10-24T09:50:00',
        },
      ];

      const state = {
        newAppointment: {
          pages: {
            selectDateTime: {},
          },
          data: {
            typeOfCareId: '323',
            vaParent: 'var983',
            vaFacility: 'var983',
          },
          eligibility: {
            // eslint-disable-next-line camelcase
            var983_323: {
              request: true,
            },
          },
          parentFacilities: [
            {
              id: 'var983',
              identifier: [
                {
                  system: VHA_FHIR_ID,
                  value: '983',
                },
              ],
            },
          ],
          facilities: {
            '323_var983': [
              {
                id: 'var983',
              },
            ],
          },
          availableSlots,
        },
      };

      const data = getDateTimeSelect(state, 'selectDateTime');
      expect(data.timezone).to.equal('Mountain time (MT)');
      expect(data.availableDates).to.eql(['2019-10-24']);
      expect(data.availableSlots).to.eql(availableSlots);
    });
  });

  describe('getClinicPageInfo', () => {
    it('should return info needed for the clinic page', () => {
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

      expect(pageInfo.pageChangeInProgress).to.equal(
        state.newAppointment.pageChangeInProgress,
      );
      expect(pageInfo.data).to.equal(state.newAppointment.data);
      expect(pageInfo.schema).to.equal(state.newAppointment.pages.clinicChoice);
      expect(pageInfo.typeOfCare).to.deep.equal({
        id: '323',
        ccId: 'CCPRMYRTNE',
        group: 'primary',
        name: 'Primary care',
        cceType: 'PrimaryCare',
      });
    });
  });

  describe('getCancelInfo', () => {
    it('should fetch facility in info', () => {
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
            var123: {},
          },
        },
      };

      const cancelInfo = getCancelInfo(state);

      expect(cancelInfo.facility).to.equal(
        state.appointments.facilityData.var123,
      );
    });
    it('should fetch facility from clinic map', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '123', isCerner: true }],
          },
        },
        appointments: {
          appointmentToCancel: {
            status: 'booked',
            vaos: {
              appointmentType: APPOINTMENT_TYPES.vaAppointment,
              videoType: null,
            },
            participant: [
              {
                actor: {
                  reference: 'HealthcareService/var123_456',
                  display: 'Test',
                },
              },
            ],
          },
          facilityData: {
            var123: {},
          },
          systemClinicToFacilityMap: {
            '123_456': {},
          },
        },
      };

      const cancelInfo = getCancelInfo(state);

      expect(cancelInfo.facility).to.equal(
        state.appointments.systemClinicToFacilityMap['123_456'],
      );
    });
    it('should fetch facility from video appointment', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '123', isCerner: true }],
          },
        },
        appointments: {
          appointmentToCancel: {
            status: 'booked',
            vaos: {
              appointmentType: APPOINTMENT_TYPES.vaAppointment,
              videoType: VIDEO_TYPES.videoConnect,
            },
            contained: [
              {
                location: {
                  reference: 'Location/var123',
                },
              },
            ],
          },
          facilityData: {
            var123: {},
          },
        },
      };

      const cancelInfo = getCancelInfo(state);

      expect(cancelInfo.facility).to.equal(
        state.appointments.facilityData.var123,
      );
    });
  });

  describe('getCCEType', () => {
    it('should return cce type for Audiology', () => {
      const state = {
        appointment: {},
        newAppointment: {
          data: {
            typeOfCareId: '203',
          },
        },
      };
      const cceType = getCCEType(state);
      expect(cceType).to.equal('Audiology');
    });
    it('should return cce type for Optometry', () => {
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
      expect(cceType).to.equal('Optometry');
    });
  });

  describe('isWelcomeModalDismissed', () => {
    it('should return dismissed if key is in list', () => {
      const state = {
        announcements: {
          dismissed: ['welcome-to-new-vaos'],
        },
      };
      expect(isWelcomeModalDismissed(state)).to.be.true;
    });
    it('should not return dismissed if key is not in list', () => {
      const state = {
        announcements: {
          dismissed: ['welcome-to-new-va'],
        },
      };
      expect(isWelcomeModalDismissed(state)).to.be.false;
    });
  });

  describe('selectIsCernerOnlyPatient', () => {
    it('should return true if Cerner only', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '123', isCerner: true }],
          },
        },
      };
      expect(selectIsCernerOnlyPatient(state)).to.be.true;
    });
    it('should return false if not Cerner only', () => {
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
      expect(selectIsCernerOnlyPatient(state)).to.be.false;
    });
  });

  describe('selectCernerFacilities', () => {
    it('should return collection of cerner facilities', () => {
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

      expect(selectCernerFacilities(state).length).to.be.equal(1);
    });

    it('should return empty collection of cerner facilities', () => {
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

      expect(selectCernerFacilities(state).length).to.be.equal(0);
    });
  });
});
