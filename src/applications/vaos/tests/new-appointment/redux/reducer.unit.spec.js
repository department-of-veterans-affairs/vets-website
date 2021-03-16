import { expect } from 'chai';
import newAppointmentReducer, {
  REASON_ADDITIONAL_INFO_TITLES,
  REASON_MAX_CHARS,
} from '../../../new-appointment/redux/reducer';
import {
  FORM_PAGE_OPENED,
  FORM_DATA_UPDATED,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
  FORM_PAGE_FACILITY_OPEN_FAILED,
  FORM_PAGE_FACILITY_V2_OPEN_SUCCEEDED,
  // FORM_PAGE_FACILITY_V2_OPEN_FAILED,
  FORM_FETCH_FACILITY_DETAILS,
  FORM_FETCH_FACILITY_DETAILS_SUCCEEDED,
  FORM_FETCH_CHILD_FACILITIES,
  FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
  FORM_FETCH_CHILD_FACILITIES_FAILED,
  FORM_VA_PARENT_CHANGED,
  FORM_ELIGIBILITY_CHECKS,
  FORM_ELIGIBILITY_CHECKS_SUCCEEDED,
  FORM_ELIGIBILITY_CHECKS_FAILED,
  FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
  FORM_CALENDAR_FETCH_SLOTS,
  FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
  FORM_CALENDAR_FETCH_SLOTS_FAILED,
  FORM_CALENDAR_DATA_CHANGED,
  FORM_PAGE_COMMUNITY_CARE_PREFS_OPENED,
  FORM_REQUESTED_PROVIDERS,
  FORM_REQUESTED_PROVIDERS_SUCCEEDED,
  FORM_REQUESTED_PROVIDERS_FAILED,
  FORM_SUBMIT,
  FORM_SUBMIT_FAILED,
  FORM_TYPE_OF_CARE_PAGE_OPENED,
  FORM_SHOW_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL,
  FORM_HIDE_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL,
  FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED,
  FORM_REASON_FOR_APPOINTMENT_CHANGED,
  FORM_PAGE_FACILITY_SORT_METHOD_UPDATED,
} from '../../../new-appointment/redux/actions';
import {
  STARTED_NEW_APPOINTMENT_FLOW,
  FORM_SUBMIT_SUCCEEDED,
} from '../../../redux/sitewide';

import parentFacilities from '../../../services/mocks/var/facilities.json';
import facilities983 from '../../../services/mocks/var/facilities_983.json';
import facilityData from '../../../services/mocks/var/facility_data.json';
import ccProviderData from '../../../services/mocks/var/cc_providers.json';
import {
  FETCH_STATUS,
  FLOW_TYPES,
  PURPOSE_TEXT,
  VHA_FHIR_ID,
  FACILITY_TYPES,
  FACILITY_SORT_METHODS,
} from '../../../utils/constants';

import { transformParentFacilities } from '../../../services/organization/transformers';
import {
  transformDSFacilities,
  transformFacilities,
  transformCommunityProviders,
} from '../../../services/location/transformers';
import { getSiteIdFromOrganization } from '../../../services/organization';

const parentFacilitiesParsed = transformParentFacilities(
  parentFacilities.data.map(item => ({
    ...item.attributes,
    id: item.id,
  })),
);

const defaultState = {
  data: {},
  pages: {},
  parentFacilitiesStatus: FETCH_STATUS.notStarted,
  loadingFacilities: false,
  parentFacilities: null,
  facilities: {},
};

const facilities983Parsed = transformDSFacilities(
  facilities983.data.map(item => ({
    ...item.attributes,
    id: item.id,
  })),
);

const facilityDataParsed = transformFacilities(
  facilityData.data.map(item => ({
    ...item.attributes,
    id: item.id,
  })),
).map(location => ({
  ...location,
  legacyVAR: {
    directSchedulingSupported: { 323: true, 504: true },
    requestSupported: { 323: true, 504: true },
  },
}));

const ccProvidersParsed = transformCommunityProviders(
  ccProviderData.data.map(item => ({
    ...item.attributes,
    id: item.id,
  })),
);

describe('VAOS reducer: newAppointment', () => {
  it('should set the new schema', () => {
    const currentState = {
      data: {},
      pages: {},
    };
    const action = {
      type: FORM_PAGE_OPENED,
      page: 'test',
      schema: {
        type: 'object',
        properties: {},
      },
      uiSchema: {},
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.pages.test).not.to.be.undefined;
  });
  it('should update the form data', () => {
    const currentState = {
      data: {},
      pages: {
        test: {
          type: 'object',
          properties: {},
        },
      },
    };
    const action = {
      type: FORM_DATA_UPDATED,
      page: 'test',
      data: {
        prop: 'testing',
      },
      uiSchema: {},
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.data.prop).to.equal('testing');
  });

  it('should reset facility info when type of care changes', () => {
    const currentState = {
      data: {
        typeOfCareId: '323',
        vaFacility: '123',
      },
      pages: {
        test: {
          type: 'object',
          properties: {},
        },
        vaFacility: {
          type: 'object',
          properties: {},
        },
      },
    };
    const action = {
      type: FORM_DATA_UPDATED,
      page: 'test',
      data: {
        typeOfCareId: '504',
        vaFacility: '123',
      },
      uiSchema: {},
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.data.typeOfCareId).to.equal('504');
    expect(newState.data.vaFacility).to.be.undefined;
    expect(newState.pages.vaFacility).to.be.undefined;
  });

  it('should mark page change as in progress', () => {
    const currentState = {
      data: {},
      pageChangeInProgress: false,
      previousPages: { page1: 'home', page2: 'page1', page3: 'page2' },
    };
    const action = {
      type: FORM_PAGE_CHANGE_STARTED,
      pageKey: 'page1',
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.pageChangeInProgress).to.be.true;
  });

  it('should mark page change as in not progress', () => {
    const currentState = {
      data: {},
      pageChangeInProgress: true,
      previousPages: { page1: 'home', page2: 'page1', page3: 'page2' },
    };
    const action = {
      type: FORM_PAGE_CHANGE_COMPLETED,
      pageKey: 'page2',
      pageKeyNext: 'page3',
      direction: 'next',
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.pageChangeInProgress).to.be.false;
  });

  describe('open facility page reducer', () => {
    const defaultOpenPageAction = {
      type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
      page: 'vaFacility',
      uiSchema: {},
      schema: {
        type: 'object',
        properties: {
          vaParent: {
            type: 'string',
            enum: [],
          },
          vaFacility: {
            type: 'string',
            enum: [],
          },
        },
      },
      typeOfCareId: '323',
    };

    it('should set parentFacilities when facility page is done loading', () => {
      const currentState = {
        ...defaultState,
      };
      const action = {
        ...defaultOpenPageAction,
        parentFacilities: parentFacilitiesParsed,
      };

      const newState = newAppointmentReducer(currentState, action);

      expect(newState.pages.vaFacility).to.deep.equal({
        type: 'object',
        properties: {
          vaParent: {
            type: 'string',
            enum: ['983', '984', '983A6'],
            enumNames: [
              'CHYSHR-Cheyenne VA Medical Center',
              'DAYTSHR -Dayton VA Medical Center',
              'Five Digit Station ID Medical Center',
            ],
          },
          vaFacility: {
            type: 'string',
            enum: [],
          },
        },
      });
    });

    it('should set facilities when only one system', () => {
      const action = {
        ...defaultOpenPageAction,
        parentFacilities: parentFacilitiesParsed.slice(0, 1),
        facilities: facilities983Parsed,
      };

      const newState = newAppointmentReducer(defaultState, action);

      expect(newState.data.vaParent).to.equal(action.parentFacilities[0].id);
      expect(newState.pages.vaFacility).to.deep.equal({
        type: 'object',
        properties: {
          vaFacility: {
            type: 'string',
            enum: ['983', '983GB', '983GC', '983GD', '983HK'],
            enumNames: [
              'CHYSHR-Cheyenne VA Medical Center (Cheyenne, WY)',
              'CHYSHR-Sidney VA Clinic (Sidney, NE)',
              'CHYSHR-Fort Collins VA Clinic (Fort Collins, CO)',
              'CHYSHR-Loveland VA Clinic (Loveland, CO)',
              'CHYSHR-Wheatland VA Mobile Clinic (Cheyenne, WY)',
            ],
          },
        },
      });
    });

    it('should set system and facility when there is only one', () => {
      const action = {
        ...defaultOpenPageAction,
        parentFacilities: parentFacilitiesParsed.slice(0, 1),
        facilities: facilities983Parsed.slice(0, 1),
        eligibilityData: {
          clinics: [],
          requestPastVisit: {},
          directPastVisit: {},
          requestLimits: {},
        },
      };

      const newState = newAppointmentReducer(defaultState, action);

      expect(newState.data.vaParent).to.equal(action.parentFacilities[0].id);
      expect(newState.data.vaFacility).to.equal(action.facilities[0].id);
      expect(newState.pages.vaFacility).to.deep.equal({
        type: 'object',
        properties: {},
      });
      expect(newState.clinics['983_323']).to.equal(
        action.eligibilityData.clinics,
      );
    });

    it('should not set clinics when it failed', () => {
      const action = {
        ...defaultOpenPageAction,
        parentFacilities: parentFacilitiesParsed.slice(0, 1),
        facilities: facilities983Parsed.slice(0, 1),
        eligibilityData: {
          clinics: { directFailed: true },
          requestPastVisit: {},
          directPastVisit: {},
          requestLimits: {},
        },
      };

      const newState = newAppointmentReducer(defaultState, action);

      expect(newState.clinics).to.be.undefined;
    });

    it('should set error when failed', () => {
      const currentState = {
        ...defaultState,
      };
      const action = {
        type: FORM_PAGE_FACILITY_OPEN_FAILED,
      };

      const newState = newAppointmentReducer(currentState, action);

      expect(newState.parentFacilitiesStatus).to.equal(FETCH_STATUS.failed);
    });
  });

  describe('open flat facility page reducer', () => {
    const defaultOpenPageAction = {
      type: FORM_PAGE_FACILITY_V2_OPEN_SUCCEEDED,
      uiSchema: {},
      schema: {
        type: 'object',
        properties: {
          vaFacility: {
            type: 'string',
            enum: [],
          },
        },
      },
      typeOfCareId: '323',
    };

    const residentialAddress = {
      addressLine1: '290 Ludlow Ave',
      city: 'Cincinatti',
      stateCode: 'OH',
      zipCode: '45220',
      latitude: 39.1362562, // Cincinatti, OH
      longitude: -84.6804804,
    };

    it('should set facilities when page is done loading and page has multiple facilities', () => {
      const currentState = {
        ...defaultState,
      };
      const action = {
        ...defaultOpenPageAction,
        parentFacilities: parentFacilitiesParsed,
        facilities: facilityDataParsed.slice(0, 3),
        address: residentialAddress,
      };

      const newState = newAppointmentReducer(currentState, action);
      const vaFacilitySchema =
        newState.pages.vaFacilityV2.properties.vaFacility;

      expect(vaFacilitySchema.enum).to.deep.equal(['984', '983', '983GC']);
      expect(vaFacilitySchema.enumNames[0].name).to.equal(
        'Dayton VA Medical Center',
      );
      expect(vaFacilitySchema.enumNames[1].name).to.equal(
        'Cheyenne VA Medical Center',
      );
      expect(vaFacilitySchema.enumNames[2].name).to.equal(
        'Fort Collins VA Clinic',
      );
      expect(newState.facilityPageSortMethod).to.equal(
        FACILITY_SORT_METHODS.distanceFromResidential,
      );
      expect(newState.data.vaParent).to.equal(undefined);
    });

    it('should set facilities when page is done loading and page has single facilities', () => {
      const currentState = {
        ...defaultState,
      };
      const action = {
        ...defaultOpenPageAction,
        parentFacilities: parentFacilitiesParsed,
        facilities: facilityDataParsed.slice(2, 3),
        address: residentialAddress,
      };

      const newState = newAppointmentReducer(currentState, action);
      const vaFacilitySchema =
        newState.pages.vaFacilityV2.properties.vaFacility;

      expect(vaFacilitySchema.enum).to.deep.equal(['983GC']);
      expect(vaFacilitySchema.enumNames[0].name).to.equal(
        'Fort Collins VA Clinic',
      );
      expect(newState.facilityPageSortMethod).to.equal(
        FACILITY_SORT_METHODS.distanceFromResidential,
      );
    });

    it('should set sort method to alphabetical if there is no residental address', () => {
      const currentState = {
        ...defaultState,
      };
      const action = {
        ...defaultOpenPageAction,
        parentFacilities: parentFacilitiesParsed,
        facilities: facilityDataParsed.slice(0, 3),
      };

      const newState = newAppointmentReducer(currentState, action);
      const vaFacilitySchema =
        newState.pages.vaFacilityV2.properties.vaFacility;

      expect(vaFacilitySchema.enum).to.deep.equal(['983', '984', '983GC']);
      expect(vaFacilitySchema.enumNames[0].name).to.equal(
        'Cheyenne VA Medical Center',
      );
      expect(vaFacilitySchema.enumNames[1].name).to.equal(
        'Dayton VA Medical Center',
      );
      expect(vaFacilitySchema.enumNames[2].name).to.equal(
        'Fort Collins VA Clinic',
      );
      expect(newState.facilityPageSortMethod).to.equal(
        FACILITY_SORT_METHODS.alphabetical,
      );
      expect(newState.data.vaParent).to.equal(undefined);
    });

    it('should update sort method', () => {
      const currentState = {
        ...defaultState,
        data: {
          typeOfCareId: '323',
        },
      };
      const action = {
        ...defaultOpenPageAction,
        parentFacilities: parentFacilitiesParsed,
        facilities: facilityDataParsed.slice(0, 3),
        address: residentialAddress,
      };

      const newState = newAppointmentReducer(currentState, action);
      expect(newState.facilityPageSortMethod).to.equal(
        FACILITY_SORT_METHODS.distanceFromResidential,
      );
      const newState2 = newAppointmentReducer(newState, {
        type: FORM_PAGE_FACILITY_SORT_METHOD_UPDATED,
        sortMethod: FACILITY_SORT_METHODS.alphabetical,
      });
      const vaFacilitySchema =
        newState2.pages.vaFacilityV2.properties.vaFacility;

      expect(vaFacilitySchema.enum).to.deep.equal(['984', '983', '983GC']);
      expect(vaFacilitySchema.enumNames[0].name).to.equal(
        'Dayton VA Medical Center',
      );
      expect(vaFacilitySchema.enumNames[1].name).to.equal(
        'Cheyenne VA Medical Center',
      );
      expect(vaFacilitySchema.enumNames[2].name).to.equal(
        'Fort Collins VA Clinic',
      );
      expect(newState2.facilityPageSortMethod).to.equal(
        FACILITY_SORT_METHODS.alphabetical,
      );
    });
  });

  describe('update facility data reducer', () => {
    const defaultFetchFacilitiesAction = {
      type: FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
      uiSchema: {},
      typeOfCareId: '323',
    };
    const defaultFacilityState = {
      ...defaultState,
      data: {
        vaParent: '983',
        typeOfCareId: '323',
      },
      pages: {
        vaFacility: {
          type: 'object',
          properties: {
            vaParent: {
              type: 'string',
            },
            vaFacility: {
              type: 'string',
              enum: [],
            },
          },
        },
      },
      parentFacilities: parentFacilitiesParsed,
      facilities: {},
      loadingFacilities: true,
    };

    it('should set loading state when system changes and facilities are fetched', () => {
      const action = {
        type: FORM_FETCH_CHILD_FACILITIES,
      };

      const newState = newAppointmentReducer(defaultState, action);

      expect(
        newState.pages.vaFacility.properties.vaFacilityLoading,
      ).to.deep.equal({ type: 'string' });
    });

    it('should set up facilities after they are fetched', () => {
      const action = {
        ...defaultFetchFacilitiesAction,
        facilities: facilities983Parsed,
      };

      const newState = newAppointmentReducer(defaultFacilityState, action);

      expect(newState.pages.vaFacility.properties.vaFacilityLoading).to.be
        .undefined;
      expect(newState.pages.vaFacility.properties.vaFacility).to.deep.equal({
        type: 'string',
        enum: ['983', '983GB', '983GC', '983GD', '983HK'],
        enumNames: [
          'CHYSHR-Cheyenne VA Medical Center (Cheyenne, WY)',
          'CHYSHR-Sidney VA Clinic (Sidney, NE)',
          'CHYSHR-Fort Collins VA Clinic (Fort Collins, CO)',
          'CHYSHR-Loveland VA Clinic (Loveland, CO)',
          'CHYSHR-Wheatland VA Mobile Clinic (Cheyenne, WY)',
        ],
      });
      expect(newState.facilities['323_983']).to.equal(facilities983Parsed);
    });

    it('should update facility choices if system changed and we have the list in state', () => {
      const action = {
        type: FORM_VA_PARENT_CHANGED,
        typeOfCareId: '323',
      };
      const state = {
        ...defaultFacilityState,
        data: {
          vaParent: '983',
        },
        facilities: {
          '323_983': facilities983Parsed,
        },
      };

      const newState = newAppointmentReducer(state, action);

      expect(newState.pages.vaFacility.properties.vaFacility).to.deep.equal({
        type: 'string',
        enum: ['983', '983GB', '983GC', '983GD', '983HK'],
        enumNames: [
          'CHYSHR-Cheyenne VA Medical Center (Cheyenne, WY)',
          'CHYSHR-Sidney VA Clinic (Sidney, NE)',
          'CHYSHR-Fort Collins VA Clinic (Fort Collins, CO)',
          'CHYSHR-Loveland VA Clinic (Loveland, CO)',
          'CHYSHR-Wheatland VA Mobile Clinic (Cheyenne, WY)',
        ],
      });
    });

    it('should remove facility question and set data if only one facility in state', () => {
      const action = {
        type: FORM_VA_PARENT_CHANGED,
        typeOfCareId: '323',
      };
      const state = {
        ...defaultFacilityState,
        parentFacilities: [
          {
            id: '983',
          },
        ],
        facilities: {
          '323_983': facilities983Parsed.slice(0, 1),
        },
      };

      const newState = newAppointmentReducer(state, action);

      expect(newState.pages.vaFacility.properties.vaFacility).to.be.undefined;
      expect(newState.data.vaFacility).to.equal('983');
    });
    it('should set error when failed', () => {
      const currentState = {
        ...defaultState,
      };
      const action = {
        type: FORM_FETCH_CHILD_FACILITIES_FAILED,
      };

      const newState = newAppointmentReducer(currentState, action);

      expect(newState.childFacilitiesStatus).to.equal(FETCH_STATUS.failed);
    });
  });
  describe('fetch eligibility checks reducers', () => {
    it('should set loading state for eligibility', () => {
      const action = {
        type: FORM_ELIGIBILITY_CHECKS,
      };

      const newState = newAppointmentReducer(defaultState, action);
      expect(newState.eligibilityStatus).to.be.equal(FETCH_STATUS.loading);
    });

    it('should set eligibility and clinic info on state', () => {
      const action = {
        type: FORM_ELIGIBILITY_CHECKS_SUCCEEDED,
        typeOfCareId: '323',
        facilityId: '983',
        eligibilityData: {
          clinics: [],
          directPastVisit: {},
          requestPastVisit: {},
          requestLimits: {},
        },
      };
      const state = {
        ...defaultState,
        facilities: {
          '323_983': facilities983Parsed,
        },
        parentFacilities: parentFacilitiesParsed,
        data: {
          ...defaultState.data,
          vaFacility: '983',
        },
      };

      const newState = newAppointmentReducer(state, action);
      expect(newState.clinics['983_323']).to.equal(
        action.eligibilityData.clinics,
      );
      expect(newState.eligibility['983_323']).to.not.be.undefined;
    });

    it('should not set clinic info if failed', () => {
      const action = {
        type: FORM_ELIGIBILITY_CHECKS_SUCCEEDED,
        typeOfCareId: '323',
        facilityId: '983',
        eligibilityData: {
          clinics: { directFailed: true },
          directPastVisit: {},
          requestPastVisit: {},
          requestLimits: {},
        },
      };
      const state = {
        ...defaultState,
        facilities: {
          '323_983': facilities983Parsed,
        },
        parentFacilities: parentFacilitiesParsed,
        data: {
          ...defaultState.data,
          vaFacility: '983',
        },
      };

      const newState = newAppointmentReducer(state, action);
      expect(newState.clinics).to.be.undefined;
    });

    it('should set error state', () => {
      const action = {
        type: FORM_ELIGIBILITY_CHECKS_FAILED,
      };

      const newState = newAppointmentReducer(defaultState, action);
      expect(newState.eligibilityStatus).to.be.equal(FETCH_STATUS.failed);
    });
  });

  describe('facility details', () => {
    it('should set facility detail loading', () => {
      const action = {
        type: FORM_FETCH_FACILITY_DETAILS,
      };

      const newState = newAppointmentReducer(defaultState, action);

      expect(newState.facilityDetailsStatus).to.equal(FETCH_STATUS.loading);
    });

    it('should update state with facility details and set facilityDetailsStatus to succeeded', () => {
      const facilityDetails = {
        attributes: {
          name: 'test',
        },
      };

      const action = {
        type: FORM_FETCH_FACILITY_DETAILS_SUCCEEDED,
        facilityId: '123',
        facilityDetails,
      };

      const newState = newAppointmentReducer(defaultState, action);

      expect(newState.facilityDetailsStatus).to.equal(FETCH_STATUS.succeeded);
      expect(newState.facilityDetails['123']).to.deep.equal(facilityDetails);
    });
  });

  describe('open clinic page reducers', () => {
    it('should set single clinic list in schema', () => {
      const state = {
        ...defaultState,
        pastAppointments: [
          {
            clinicId: '455',
            facilityId: '983',
            sta6aid: '983',
            startDate: '',
          },
        ],
        clinics: {
          // eslint-disable-next-line camelcase
          '983_323': [
            {
              id: '983_455',
              resourceType: 'HealthcareService',
              identifier: [
                {
                  system: 'http://med.va.gov/fhir/urn',
                  value: 'urn:va:healthcareservice:983:983:455',
                },
              ],
            },
            {
              id: '983_456',
              resourceType: 'HealthcareService',
              identifier: [
                {
                  system: 'http://med.va.gov/fhir/urn',
                  value: 'urn:va:healthcareservice:983:983:456',
                },
              ],
            },
          ],
        },
        parentFacilities: parentFacilitiesParsed,
        data: {
          ...defaultState.data,
          typeOfCareId: '323',
          vaParent: '983',
          vaFacility: '983',
        },
      };

      const action = {
        type: FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
        page: 'clinicChoice',
        schema: {
          type: 'object',
          properties: {},
        },
        uiSchema: {},
        facilityDetails: {},
      };

      const newState = newAppointmentReducer(state, action);

      expect(
        newState.pages.clinicChoice.properties.clinicId.enum,
      ).to.deep.equal(['983_455', 'NONE']);
      expect(
        newState.pages.clinicChoice.properties.clinicId.enumNames,
      ).to.deep.equal([
        'Yes, make my appointment here',
        'No, I need a different clinic',
      ]);
    });
    it('should set multi clinic list in schema', () => {
      const state = {
        ...defaultState,
        pastAppointments: [
          {
            clinicId: '455',
            facilityId: '983',
            sta6aid: '983',
            startDate: '',
          },
          {
            clinicId: '456',
            facilityId: '983',
            sta6aid: '983',
            startDate: '',
          },
        ],
        clinics: {
          // eslint-disable-next-line camelcase
          '983_323': [
            {
              id: '983_455',
              resourceType: 'HealthcareService',
              identifier: [
                {
                  system: 'http://med.va.gov/fhir/urn',
                  value: 'urn:va:healthcareservice:983:983:455',
                },
              ],
              serviceName: 'Testing',
            },
            {
              id: '983_456',
              resourceType: 'HealthcareService',
              identifier: [
                {
                  system: 'http://med.va.gov/fhir/urn',
                  value: 'urn:va:healthcareservice:983:983:456',
                },
              ],
              serviceName: 'Testing real name',
            },
          ],
        },
        parentFacilities: parentFacilitiesParsed,
        data: {
          ...defaultState.data,
          typeOfCareId: '323',
          vaParent: '983',
          vaFacility: '983',
        },
      };

      const action = {
        type: FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
        page: 'clinicChoice',
        schema: {
          type: 'object',
          properties: {},
        },
        uiSchema: {},
        facilityDetails: {},
      };

      const newState = newAppointmentReducer(state, action);

      expect(
        newState.pages.clinicChoice.properties.clinicId.enum,
      ).to.deep.equal(['983_455', '983_456', 'NONE']);
      expect(
        newState.pages.clinicChoice.properties.clinicId.enumNames,
      ).to.deep.equal([
        'Testing',
        'Testing real name',
        'I need a different clinic',
      ]);
    });
  });

  describe('calendar', () => {
    it('should set appointmentSlotStatus to loading when fetching slots', () => {
      const action = {
        type: FORM_CALENDAR_FETCH_SLOTS,
      };

      const newState = newAppointmentReducer(defaultState, action);
      expect(newState.appointmentSlotsStatus).to.equal(FETCH_STATUS.loading);
    });

    it('should update slots when fetch slots succeeded', () => {
      const availableSlots = [
        {
          date: '2020-02-02',
          dateTime: '2020-02-02T11:00:00',
        },
      ];

      const fetchedAppointmentSlotMonths = ['2020-02'];

      const action = {
        type: FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
        availableSlots,
        fetchedAppointmentSlotMonths,
        appointmentLength: 20,
      };

      const newState = newAppointmentReducer(defaultState, action);
      expect(newState.appointmentSlotsStatus).to.equal(FETCH_STATUS.succeeded);
      expect(newState.availableSlots).to.equal(availableSlots);
      expect(newState.fetchedAppointmentSlotMonths).to.equal(
        fetchedAppointmentSlotMonths,
      );
    });

    it('should set appointmentSlotStatus to failed when fetching slots', () => {
      const action = {
        type: FORM_CALENDAR_FETCH_SLOTS_FAILED,
      };

      const newState = newAppointmentReducer(defaultState, action);
      expect(newState.appointmentSlotsStatus).to.equal(FETCH_STATUS.failed);
    });

    it('should update calendar data on change', () => {
      const selectedDates = ['2020-03-11T09:40:00'];

      const action = {
        type: FORM_CALENDAR_DATA_CHANGED,
        selectedDates,
      };

      const newState = newAppointmentReducer(defaultState, action);
      expect(newState.data.selectedDates).to.deep.equal(selectedDates);
    });
  });

  describe('Reason for appointment page', () => {
    it('should set additional info title when page opened', () => {
      const state = {
        ...defaultState,
        data: { ...defaultState.data, reasonForAppointment: 'other' },
      };

      const action = {
        type: FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED,
        page: 'reasonForAppointment',
        schema: {
          type: 'object',
          properties: {
            reasonAdditionalInfo: {
              type: 'string',
            },
          },
        },
        uiSchema: {},
      };

      const newState = newAppointmentReducer(state, action);

      expect(
        newState.pages.reasonForAppointment.properties.reasonAdditionalInfo
          .title,
      ).to.equal(REASON_ADDITIONAL_INFO_TITLES.request);
    });
  });

  it('should unset reasonForAppointment if CC appointment', () => {
    const state = {
      ...defaultState,
      data: {
        ...defaultState.data,
        reasonForAppointment: 'other',
        facilityType: FACILITY_TYPES.COMMUNITY_CARE,
      },
    };

    const action = {
      type: FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED,
      page: 'reasonForAppointment',
      schema: {
        type: 'object',
        properties: {
          reasonAdditionalInfo: {
            type: 'string',
          },
        },
      },
      uiSchema: {},
    };

    const newState = newAppointmentReducer(state, action);

    expect(newState.data.reasonForAppointment).to.equal(undefined);
  });

  it('page open should set max characters', async () => {
    const currentState = {
      ...defaultState,
      flowType: FLOW_TYPES.DIRECT,
      data: {
        reasonForAppointment: 'other',
      },
    };

    const action = {
      type: FORM_REASON_FOR_APPOINTMENT_PAGE_OPENED,
      page: 'reasonForAppointment',
      schema: {
        type: 'object',
        properties: {
          reasonAdditionalInfo: {
            type: 'string',
          },
        },
      },
      uiSchema: {},
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(
      newState.pages.reasonForAppointment.properties.reasonAdditionalInfo
        .maxLength,
    ).to.equal(
      REASON_MAX_CHARS.direct -
        PURPOSE_TEXT.find(purpose => purpose.id === 'other').short.length -
        2,
    );
  });

  it('change should set max characters', async () => {
    const currentState = {
      ...defaultState,
      flowType: FLOW_TYPES.DIRECT,
      data: {
        reasonForAppointment: 'medication-concern',
      },
      pages: {
        reasonForAppointment: {
          type: 'object',
          properties: {
            reasonAdditionalInfo: {
              type: 'string',
            },
          },
        },
      },
    };

    const action = {
      type: FORM_REASON_FOR_APPOINTMENT_CHANGED,
      page: 'reasonForAppointment',
      uiSchema: {},
      data: {
        reasonForAppointment: 'other',
      },
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(
      newState.pages.reasonForAppointment.properties.reasonAdditionalInfo
        .maxLength,
    ).to.equal(
      REASON_MAX_CHARS.direct -
        PURPOSE_TEXT.find(purpose => purpose.id === 'other').short.length -
        2,
    );
  });

  describe('CC preferences page', () => {
    it('should remove system id if only one', () => {
      const action = {
        type: FORM_PAGE_COMMUNITY_CARE_PREFS_OPENED,
        schema: {
          type: 'object',
          required: [],
          properties: {
            hasCommunityCareProvider: {
              type: 'boolean',
            },
            communityCareSystemId: { type: 'string' },
          },
        },
        page: 'ccPreferences',
        uiSchema: {},
        parentFacilities: [
          {
            id: '983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
          },
        ],
      };
      const state = {
        ...defaultState,
        ccEnabledSystems: parentFacilitiesParsed.filter(
          facility => getSiteIdFromOrganization(facility) === '983',
        ),
        data: {
          typeOfCareId: '323',
        },
      };

      const newState = newAppointmentReducer(state, action);

      expect(newState.pages.ccPreferences.properties.communityCareSystemId).to
        .be.undefined;
      expect(newState.data.communityCareSystemId).to.equal('983');
    });

    it('should fill in enum props if more than one cc system', () => {
      const action = {
        type: FORM_PAGE_COMMUNITY_CARE_PREFS_OPENED,
        schema: {
          type: 'object',
          required: [],
          properties: {
            communityCareSystemId: { type: 'string' },
            hasCommunityCareProvider: {
              type: 'boolean',
            },
          },
        },
        uiSchema: {},
        page: 'ccPreferences',
      };
      const state = {
        ...defaultState,
        ccEnabledSystems: parentFacilitiesParsed.filter(facility =>
          ['983', '984'].includes(getSiteIdFromOrganization(facility)),
        ),
        data: {
          typeOfCareId: '323',
        },
      };

      const newState = newAppointmentReducer(state, action);

      expect(newState.pages.ccPreferences.properties.communityCareSystemId).not
        .to.be.undefined;

      expect(
        newState.pages.ccPreferences.properties.communityCareSystemId,
      ).to.deep.equal({
        type: 'string',
        enum: ['983', '984'],
        enumNames: ['Cheyenne, WY', 'Dayton, OH'],
      });
    });
  });

  describe('CC provider selection page', () => {
    it('should set community care provider list loading', () => {
      const action = {
        type: FORM_REQUESTED_PROVIDERS,
      };

      const newState = newAppointmentReducer({}, action);
      expect(newState.requestStatus).to.equal(FETCH_STATUS.loading);
    });

    it('should set community care providers if sorted by distance from residential', () => {
      const action = {
        type: FORM_REQUESTED_PROVIDERS_SUCCEEDED,
        typeOfCareProviders: ccProvidersParsed,
        address: {
          addressLine1: '290 Ludlow Ave',
          city: 'Cincinatti',
          stateCode: 'OH',
          zipCode: '45220',
          latitude: 38.833571, // Alexandria, VA
          longitude: -77.110408,
        },
      };

      const sortMethod = FACILITY_SORT_METHODS.distanceFromResidential;

      const newState = newAppointmentReducer(
        {
          data: {
            typeOfCareId: '323',
            vaFacility: '123',
          },
          communityCareProviders: {},
          ccProviderPageSortMethod: sortMethod,
        },
        action,
      );
      const key = `${sortMethod}_CCPRMYRTNE`;
      expect(key in newState.communityCareProviders).to.be.true;
      expect(newState.communityCareProviders[key].length).to.be.above(0);
      expect(newState.communityCareProviders[key][0].address.city).to.equal(
        'Alexandria',
      );
      expect(newState.requestStatus).to.equal(FETCH_STATUS.succeeded);
    });

    it('should set community care providers if sorted by distance from current location', () => {
      const action = {
        type: FORM_REQUESTED_PROVIDERS_SUCCEEDED,
        typeOfCareProviders: ccProvidersParsed,
        address: {
          latitude: 38.991034, // Greenbelt, MD
          longitude: -76.880351,
        },
      };

      const sortMethod = FACILITY_SORT_METHODS.distanceFromCurrentLocation;

      const newState = newAppointmentReducer(
        {
          data: {
            typeOfCareId: '323',
            vaFacility: '123',
          },
          communityCareProviders: {},
          ccProviderPageSortMethod: sortMethod,
        },
        action,
      );

      const key = `${sortMethod}_CCPRMYRTNE`;
      expect(key in newState.communityCareProviders).to.be.true;
      expect(newState.communityCareProviders[key].length).to.be.above(0);
      expect(newState.communityCareProviders[key][0].address.city).to.equal(
        'Greenbelt',
      );
      expect(newState.requestStatus).to.equal(FETCH_STATUS.succeeded);
    });

    it('should set community care provider list loading failed', () => {
      const action = {
        type: FORM_REQUESTED_PROVIDERS_FAILED,
      };

      const newState = newAppointmentReducer({}, action);
      expect(newState.requestStatus).to.equal(FETCH_STATUS.failed);
    });
  });

  describe('submit request', () => {
    it('should set loading', () => {
      const action = {
        type: FORM_SUBMIT,
      };

      const newState = newAppointmentReducer({}, action);
      expect(newState.submitStatus).to.equal(FETCH_STATUS.loading);
    });
    it('should set successful', () => {
      const action = {
        type: FORM_SUBMIT_SUCCEEDED,
      };

      const newState = newAppointmentReducer({}, action);
      expect(newState.submitStatus).to.equal(FETCH_STATUS.succeeded);
      expect(newState.submitStatusVaos400).to.equal(false);
    });
    it('should set error', () => {
      const action = {
        type: FORM_SUBMIT_FAILED,
      };

      const newState = newAppointmentReducer({}, action);
      expect(newState.submitStatus).to.equal(FETCH_STATUS.failed);
      expect(newState.submitStatusVaos400).to.equal(undefined);
    });

    it('should set vaos 400 error', () => {
      const action = {
        type: FORM_SUBMIT_FAILED,
        isVaos400Error: true,
      };

      const newState = newAppointmentReducer({}, action);
      expect(newState.submitStatus).to.equal(FETCH_STATUS.failed);
      expect(newState.submitStatusVaos400).to.equal(true);
    });
  });

  it('should open the type of care page and prefill contact info', () => {
    const currentState = {
      data: {},
      pages: {},
    };
    const action = {
      type: FORM_TYPE_OF_CARE_PAGE_OPENED,
      page: 'test',
      schema: {
        type: 'object',
        properties: {},
      },
      uiSchema: {},
      phoneNumber: '123456789',
      email: 'test@va.gov',
      showCommunityCare: true,
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.pages.test).not.to.be.undefined;
    expect(newState.data.phoneNumber).to.equal(action.phoneNumber);
    expect(newState.data.email).to.equal(action.email);
    expect(
      newState.pages.test.properties.typeOfCareId.enumNames.some(label =>
        label.toLowerCase().includes('podiatry'),
      ),
    ).to.be.true;
    expect(newState.pages.test.properties.typeOfCareId.enumNames[0]).to.contain(
      'Amputation care',
    );
  });

  it('should hide podiatry from care list if community care is disabled', () => {
    const currentState = {
      data: {},
      pages: {},
    };
    const action = {
      type: FORM_TYPE_OF_CARE_PAGE_OPENED,
      page: 'test',
      schema: {
        type: 'object',
        properties: {},
      },
      uiSchema: {},
      phoneNumber: '123456789',
      email: 'test@va.gov',
      showCommunityCare: false,
    };

    const newState = newAppointmentReducer(currentState, action);
    expect(
      newState.pages.test.properties.typeOfCareId.enumNames.some(label =>
        label.toLowerCase().includes('podiatry'),
      ),
    ).to.be.false;
  });

  it('should set podiatry appointment unavailable modal to show', () => {
    const currentState = {
      data: {},
      pageChangeInProgress: true,
    };
    const action = {
      type: FORM_SHOW_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL,
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.pageChangeInProgress).to.be.false;
    expect(newState.showPodiatryAppointmentUnavailableModal).to.be.true;
  });

  it('should set podiatry appointment unavailable modal to hidden', () => {
    const currentState = {
      data: {},
    };
    const action = {
      type: FORM_HIDE_PODIATRY_APPOINTMENT_UNAVAILABLE_MODAL,
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.showPodiatryAppointmentUnavailableModal).to.be.false;
  });

  it('should reset form when new appointment button is clicked', () => {
    const currentState = {
      data: { test: 'blah' },
      parentFacilitiesStatus: FETCH_STATUS.succeeded,
      eligibilityStatus: FETCH_STATUS.succeeded,
    };
    const action = {
      type: STARTED_NEW_APPOINTMENT_FLOW,
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.data).to.deep.equal({});
    expect(newState.eligibility).to.deep.equal({});
    expect(newState.clinics).to.deep.equal({});
    expect(newState.parentFacilitiesStatus).to.equal(FETCH_STATUS.notStarted);
    expect(newState.eligibilityStatus).to.equal(FETCH_STATUS.notStarted);
  });
});
