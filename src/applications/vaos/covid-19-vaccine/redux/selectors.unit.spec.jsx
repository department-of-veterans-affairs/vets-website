import { expect } from 'chai';
import { getFacilityPageInfo } from './selectors';
import { FETCH_STATUS, TYPE_OF_CARE_IDS } from '../../utils/constants';

describe('covid-19-vaccine / redux / selectors', () => {
  describe('getFacilityPageInfo', () => {
    const createFacility = (
      id,
      { directEnabled = false, bookedAppointments = false } = {},
    ) => ({
      id,
      name: `Facility ${id}`,
      legacyVAR: {
        settings: {
          [TYPE_OF_CARE_IDS.COVID_VACCINE_ID]: {
            direct: { enabled: directEnabled },
            bookedAppointments,
          },
        },
      },
    });

    const createState = (facilities, useVpg = false) => ({
      covid19Vaccine: {
        newBooking: {
          data: {},
          pages: {},
          facilities,
          facilitiesStatus: FETCH_STATUS.succeeded,
          facilityPageSortMethod: null,
          requestLocationStatus: FETCH_STATUS.notStarted,
          showEligibilityModal: false,
          clinics: {},
          clinicsStatus: FETCH_STATUS.notStarted,
        },
      },
      featureToggles: {
        vaOnlineSchedulingUseVpg: useVpg,
      },
      user: {
        profile: {
          vapContactInfo: {
            residentialAddress: null,
          },
        },
      },
    });

    it('should filter supportedFacilities by direct.enabled when useVpg is false', () => {
      const facilities = [
        createFacility('983', {
          directEnabled: true,
          bookedAppointments: false,
        }),
        createFacility('984', {
          directEnabled: false,
          bookedAppointments: true,
        }),
      ];

      const state = createState(facilities, false);
      const result = getFacilityPageInfo(state);

      expect(result.supportedFacilities).to.have.lengthOf(1);
      expect(result.supportedFacilities[0].id).to.equal('983');
    });

    it('should filter supportedFacilities by bookedAppointments when useVpg is true', () => {
      const facilities = [
        createFacility('983', {
          directEnabled: true,
          bookedAppointments: false,
        }),
        createFacility('984', {
          directEnabled: false,
          bookedAppointments: true,
        }),
      ];

      const state = createState(facilities, true);
      const result = getFacilityPageInfo(state);

      expect(result.supportedFacilities).to.have.lengthOf(1);
      expect(result.supportedFacilities[0].id).to.equal('984');
    });

    it('should return all facilities that have direct.enabled when useVpg is false', () => {
      const facilities = [
        createFacility('983', {
          directEnabled: true,
          bookedAppointments: false,
        }),
        createFacility('984', {
          directEnabled: true,
          bookedAppointments: false,
        }),
        createFacility('985', {
          directEnabled: false,
          bookedAppointments: true,
        }),
      ];

      const state = createState(facilities, false);
      const result = getFacilityPageInfo(state);

      expect(result.supportedFacilities).to.have.lengthOf(2);
      expect(result.supportedFacilities[0].id).to.equal('983');
      expect(result.supportedFacilities[1].id).to.equal('984');
    });

    it('should return all facilities that have bookedAppointments when useVpg is true', () => {
      const facilities = [
        createFacility('983', {
          directEnabled: true,
          bookedAppointments: false,
        }),
        createFacility('984', {
          directEnabled: false,
          bookedAppointments: true,
        }),
        createFacility('985', {
          directEnabled: false,
          bookedAppointments: true,
        }),
      ];

      const state = createState(facilities, true);
      const result = getFacilityPageInfo(state);

      expect(result.supportedFacilities).to.have.lengthOf(2);
      expect(result.supportedFacilities[0].id).to.equal('984');
      expect(result.supportedFacilities[1].id).to.equal('985');
    });

    it('should set noValidVAFacilities to true when no facilities support scheduling with useVpg false', () => {
      const facilities = [
        createFacility('983', {
          directEnabled: false,
          bookedAppointments: true,
        }),
      ];

      const state = createState(facilities, false);
      const result = getFacilityPageInfo(state);

      expect(result.noValidVAFacilities).to.be.true;
      expect(result.supportedFacilities).to.have.lengthOf(0);
    });

    it('should set noValidVAFacilities to true when no facilities support scheduling with useVpg true', () => {
      const facilities = [
        createFacility('983', {
          directEnabled: true,
          bookedAppointments: false,
        }),
      ];

      const state = createState(facilities, true);
      const result = getFacilityPageInfo(state);

      expect(result.noValidVAFacilities).to.be.true;
      expect(result.supportedFacilities).to.have.lengthOf(0);
    });
  });
});
