import { expect } from 'chai';
import reducer from './reducer';
import {
  FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
  FORM_PAGE_FACILITY_OPEN,
} from './actions';
import { FETCH_STATUS, TYPE_OF_CARE_IDS } from '../../utils/constants';

describe('covid-19-vaccine reducer', () => {
  describe('FORM_PAGE_FACILITY_OPEN_SUCCEEDED', () => {
    const createFacility = (
      id,
      { directEnabled = false, bookedAppointments = false } = {},
    ) => ({
      id,
      name: `Facility ${id}`,
      position: {
        latitude: 39.0,
        longitude: -84.0,
      },
      legacyVAR: {
        settings: {
          [TYPE_OF_CARE_IDS.COVID_VACCINE_ID]: {
            direct: { enabled: directEnabled },
            bookedAppointments,
          },
        },
      },
    });

    const initialState = {
      newBooking: {
        data: {},
        facilities: null,
        facilitiesStatus: FETCH_STATUS.notStarted,
        facilityPageSortMethod: null,
      },
    };

    it('should filter facilities by direct.enabled when useVpg is false', () => {
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

      const action = {
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        facilities,
        address: null,
        useVpg: false,
      };

      const state = reducer(initialState, action);

      // When useVpg is false, facility 983 with direct.enabled=true should be the only supported facility
      // Since there's only one supported facility, it should be auto-selected
      expect(state.newBooking.data.vaFacility).to.equal('983');
      expect(state.newBooking.facilitiesStatus).to.equal(
        FETCH_STATUS.succeeded,
      );
    });

    it('should filter facilities by bookedAppointments when useVpg is true', () => {
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

      const action = {
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        facilities,
        address: null,
        useVpg: true,
      };

      const state = reducer(initialState, action);

      // When useVpg is true, facility 984 with bookedAppointments=true should be the only supported facility
      // Since there's only one supported facility, it should be auto-selected
      expect(state.newBooking.data.vaFacility).to.equal('984');
      expect(state.newBooking.facilitiesStatus).to.equal(
        FETCH_STATUS.succeeded,
      );
    });

    it('should not auto-select facility when multiple facilities support scheduling with useVpg false', () => {
      const facilities = [
        createFacility('983', {
          directEnabled: true,
          bookedAppointments: false,
        }),
        createFacility('984', {
          directEnabled: true,
          bookedAppointments: false,
        }),
      ];

      const action = {
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        facilities,
        address: null,
        useVpg: false,
      };

      const state = reducer(initialState, action);

      // When multiple facilities support scheduling, no facility should be auto-selected
      expect(state.newBooking.data.vaFacility).to.be.undefined;
      expect(state.newBooking.facilities).to.have.lengthOf(2);
    });

    it('should not auto-select facility when multiple facilities support scheduling with useVpg true', () => {
      const facilities = [
        createFacility('983', {
          directEnabled: false,
          bookedAppointments: true,
        }),
        createFacility('984', {
          directEnabled: false,
          bookedAppointments: true,
        }),
      ];

      const action = {
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        facilities,
        address: null,
        useVpg: true,
      };

      const state = reducer(initialState, action);

      // When multiple facilities support scheduling, no facility should be auto-selected
      expect(state.newBooking.data.vaFacility).to.be.undefined;
      expect(state.newBooking.facilities).to.have.lengthOf(2);
    });

    it('should sort facilities by distance when residential address has coordinates', () => {
      const facilities = [
        {
          ...createFacility('983', { directEnabled: true }),
          position: { latitude: 40.0, longitude: -85.0 }, // farther
        },
        {
          ...createFacility('984', { directEnabled: true }),
          position: { latitude: 39.5, longitude: -84.5 }, // closer
        },
      ];

      const action = {
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        facilities,
        address: {
          latitude: 39.1,
          longitude: -84.6,
        },
        useVpg: false,
      };

      const state = reducer(initialState, action);

      // Facilities should be sorted by distance, with closer facility first
      expect(state.newBooking.facilities[0].id).to.equal('984');
      expect(state.newBooking.facilities[1].id).to.equal('983');
    });
  });

  describe('FORM_PAGE_FACILITY_OPEN', () => {
    it('should set facilities status to loading', () => {
      const initialState = {
        newBooking: {
          facilitiesStatus: FETCH_STATUS.notStarted,
        },
      };

      const action = { type: FORM_PAGE_FACILITY_OPEN };
      const state = reducer(initialState, action);

      expect(state.newBooking.facilitiesStatus).to.equal(FETCH_STATUS.loading);
    });
  });
});
