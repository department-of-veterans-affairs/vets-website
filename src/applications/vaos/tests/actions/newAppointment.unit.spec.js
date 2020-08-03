import moment from 'moment';
import { expect } from 'chai';
import sinon from 'sinon';
import set from 'platform/utilities/data/set';
import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  openFormPage,
  routeToPageInFlow,
  openFacilityPage,
  fetchFacilityDetails,
  updateFacilityPageData,
  updateReasonForAppointmentData,
  openTypeOfCarePage,
  openClinicPage,
  openCommunityCarePreferencesPage,
  submitAppointmentOrRequest,
  getAppointmentSlots,
  onCalendarChange,
  hideTypeOfCareUnavailableModal,
  startNewAppointmentFlow,
  startDirectScheduleFlow,
  startRequestAppointmentFlow,
  requestAppointmentDateChoice,
  FORM_PAGE_OPENED,
  FORM_DATA_UPDATED,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_PAGE_FACILITY_OPEN_FAILED,
  FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
  FORM_FETCH_FACILITY_DETAILS,
  FORM_FETCH_FACILITY_DETAILS_SUCCEEDED,
  FORM_FETCH_CHILD_FACILITIES,
  FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
  FORM_FETCH_CHILD_FACILITIES_FAILED,
  FORM_VA_PARENT_CHANGED,
  FORM_ELIGIBILITY_CHECKS,
  FORM_ELIGIBILITY_CHECKS_SUCCEEDED,
  FORM_ELIGIBILITY_CHECKS_FAILED,
  FORM_CLINIC_PAGE_OPENED,
  FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
  FORM_REASON_FOR_APPOINTMENT_CHANGED,
  FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN,
  FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_SUCCEEDED,
  FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_FAILED,
  FORM_SUBMIT,
  FORM_SUBMIT_FAILED,
  FORM_TYPE_OF_CARE_PAGE_OPENED,
  FORM_CALENDAR_FETCH_SLOTS,
  FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
  FORM_CALENDAR_FETCH_SLOTS_FAILED,
  FORM_CALENDAR_DATA_CHANGED,
  FORM_HIDE_TYPE_OF_CARE_UNAVAILABLE_MODAL,
  START_REQUEST_APPOINTMENT_FLOW,
  START_DIRECT_SCHEDULE_FLOW,
} from '../../actions/newAppointment';
import {
  FORM_SUBMIT_SUCCEEDED,
  STARTED_NEW_APPOINTMENT_FLOW,
} from '../../actions/sitewide';

import parentFacilities from '../../api/facilities.json';
import facilities983 from '../../api/facilities_983.json';
import clinics from '../../api/clinicList983.json';
import facilityDetails from '../../api/facility_details_983.json';
import pastAppointments from '../../api/confirmed_va.json';
import {
  FACILITY_TYPES,
  FETCH_STATUS,
  FLOW_TYPES,
  VHA_FHIR_ID,
} from '../../utils/constants';
import { transformParentFacilities } from '../../services/organization/transformers';
import { transformDSFacilities } from '../../services/location/transformers';

const testFlow = {
  page1: {
    next: 'page2',
  },
  page2: {
    url: '/page2',
    next: () => 'page3',
  },
  page3: {
    url: '/page3',
    next: 'page4',
  },
};

const facilities983Parsed = transformDSFacilities(
  facilities983.data.map(item => ({
    ...item.attributes,
    id: item.id,
  })),
).sort((a, b) => (a.name < b.name ? -1 : 1));

const parentFacilitiesParsed = transformParentFacilities(
  parentFacilities.data.map(item => ({
    ...item.attributes,
    id: item.id,
  })),
);

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

describe('VAOS newAppointment actions', () => {
  it('should open form page', () => {
    const action = openFormPage('test', 'uiSchema', 'schema');

    expect(action).to.deep.equal({
      type: FORM_PAGE_OPENED,
      page: 'test',
      uiSchema: 'uiSchema',
      schema: 'schema',
    });
  });

  it('should start new appointment flow', () => {
    const action = startNewAppointmentFlow();

    expect(action).to.deep.equal({
      type: STARTED_NEW_APPOINTMENT_FLOW,
    });
  });

  it('should hide ToC modal', () => {
    const action = hideTypeOfCareUnavailableModal();

    expect(action).to.deep.equal({
      type: FORM_HIDE_TYPE_OF_CARE_UNAVAILABLE_MODAL,
    });
  });

  describe('routeToPageInFlow', () => {
    it('should route to next page with string key', async () => {
      const router = {
        push: sinon.spy(),
      };
      const dispatch = sinon.spy();
      const state = {};
      const getState = () => state;

      const thunk = routeToPageInFlow(testFlow, router, 'page1', 'next');
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: FORM_PAGE_CHANGE_STARTED,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: FORM_PAGE_CHANGE_COMPLETED,
      });
      expect(router.push.firstCall.args[0]).to.equal('/page2');
    });

    it('should route to next page with function', async () => {
      const router = {
        push: sinon.spy(),
      };
      const dispatch = sinon.spy();
      const state = {};
      const getState = () => state;

      const thunk = routeToPageInFlow(testFlow, router, 'page2', 'next');
      await thunk(dispatch, getState);

      expect(router.push.firstCall.args[0]).to.equal('/page3');
    });

    it('should throw error for bad state', done => {
      const router = {
        push: sinon.spy(),
      };
      const dispatch = sinon.spy();
      const state = {};
      const getState = () => state;

      const thunk = routeToPageInFlow(testFlow, router, 'page3', 'next');

      thunk(dispatch, getState)
        .then(() => {
          done('Did not throw error for bad state');
        })
        .catch(e => {
          expect(e.message).to.equal(
            'Tried to route to page that does not exist',
          );
          done();
        });
    });
  });

  describe('fetchFacilityDetails', () => {
    it('should fetch facility details', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, {});
      const dispatch = sinon.spy();
      const thunk = fetchFacilityDetails('123');

      await thunk(dispatch);
      expect(dispatch.firstCall.args[0].type).to.equal(
        FORM_FETCH_FACILITY_DETAILS,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        FORM_FETCH_FACILITY_DETAILS_SUCCEEDED,
      );
    });
  });

  describe('openFacilityPage', () => {
    const defaultSchema = {
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
    };
    const defaultState = {
      ...userState,
      featureToggles: {
        loading: false,
        vaOnlineSchedulingDirect: true,
      },
      newAppointment: {
        data: {
          typeOfCareId: '323',
        },
        pages: {},
        parentFacilitiesStatus: FETCH_STATUS.notStarted,
        parentFacilities: parentFacilitiesParsed,
        facilities: {},
        eligibility: {},
      },
    };

    beforeEach(() => {
      mockFetch();
    });

    afterEach(() => {
      resetFetch();
    });

    it('should fetch parentFacilities', async () => {
      setFetchJSONResponse(global.fetch, parentFacilities);
      const dispatch = sinon.spy();
      const state = set('newAppointment.parentFacilities', null, defaultState);
      const getState = () => state;

      const thunk = openFacilityPage('vaFacility', {}, defaultSchema);
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
      );

      const succeededAction = dispatch.firstCall.args[0];
      expect(succeededAction).to.deep.equal({
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        schema: defaultSchema,
        page: 'vaFacility',
        uiSchema: {},
        parentFacilities: parentFacilitiesParsed,
        facilities: null,
        eligibilityData: null,
        typeOfCareId: defaultState.newAppointment.data.typeOfCareId,
      });
    });

    it('should fetch parentFacilities and child facilities if single parent', async () => {
      setFetchJSONResponse(global.fetch, {
        data: parentFacilities.data.filter(
          parent => parent.attributes.institutionCode === '983',
        ),
      });
      setFetchJSONResponse(global.fetch.onCall(1), facilities983);
      const dispatch = sinon.spy();
      const state = set('newAppointment.parentFacilities', null, defaultState);
      const getState = () => state;

      const thunk = openFacilityPage('vaFacility', {}, defaultSchema);
      await thunk(dispatch, getState);

      const succeededAction = dispatch.firstCall.args[0];
      expect(succeededAction).to.deep.equal({
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        schema: defaultSchema,
        page: 'vaFacility',
        uiSchema: {},
        parentFacilities: parentFacilitiesParsed.slice(0, 1),
        facilities: facilities983Parsed,
        eligibilityData: null,
        typeOfCareId: defaultState.newAppointment.data.typeOfCareId,
      });
      expect(global.fetch.secondCall.args[0]).to.contain('/systems/983/');
    });

    it('should send fail action if a fetch fails', async () => {
      setFetchJSONFailure(global.fetch, {});
      const dispatch = sinon.spy();
      const state = set('newAppointment.parentFacilities', null, defaultState);
      const getState = () => state;

      const thunk = openFacilityPage('vaFacility', {}, defaultSchema);
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FORM_PAGE_FACILITY_OPEN_FAILED,
      );
    });

    it('should reuse parentFacilities if already in state', async () => {
      const dispatch = sinon.spy();
      const getState = () => defaultState;

      const thunk = openFacilityPage('vaFacility', {}, defaultSchema);
      await thunk(dispatch, getState);

      const succeededAction = dispatch.lastCall.args[0];
      expect(succeededAction).to.deep.equal({
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        schema: defaultSchema,
        page: 'vaFacility',
        uiSchema: {},
        parentFacilities: parentFacilitiesParsed,
        facilities: null,
        eligibilityData: null,
        typeOfCareId: defaultState.newAppointment.data.typeOfCareId,
      });
    });

    it('should fetch facilities if system was selected already', async () => {
      setFetchJSONResponse(global.fetch, facilities983);
      const dispatch = sinon.spy();
      const state = set('newAppointment.data.vaParent', 'var983', defaultState);
      const getState = () => state;

      const thunk = openFacilityPage('vaFacility', {}, defaultSchema);
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
      );

      const succeededAction = dispatch.firstCall.args[0];
      expect(succeededAction).to.deep.equal({
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        schema: defaultSchema,
        page: 'vaFacility',
        uiSchema: {},
        parentFacilities: parentFacilitiesParsed,
        facilities: facilities983Parsed,
        eligibilityData: null,
        typeOfCareId: defaultState.newAppointment.data.typeOfCareId,
      });
    });

    it('should fetch parent details if no supported facilities', async () => {
      setFetchJSONResponse(global.fetch, clinics);
      const dispatch = sinon.spy();
      const previousState = {
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          data: {
            ...defaultState.newAppointment.data,
            vaParent: 'var983',
          },
          facilities: {
            '323_var983': [],
          },
        },
      };

      const getState = () => previousState;

      const thunk = openFacilityPage('vaFacility', {}, defaultSchema);
      await thunk(dispatch, getState);
      const firstAction = dispatch.firstCall.args[0];
      expect(firstAction.type).to.equal(FORM_PAGE_FACILITY_OPEN_SUCCEEDED);
      expect(dispatch.secondCall.args[0].type).to.equal(
        FORM_FETCH_FACILITY_DETAILS,
      );
    });

    it('should fetch eligibility info if facility is selected when opening page', async () => {
      setFetchJSONResponse(global.fetch, clinics);
      const dispatch = sinon.spy();
      const previousState = {
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          data: {
            ...defaultState.newAppointment.data,
            vaParent: 'var983',
            vaFacility: 'var983',
          },
          facilities: {
            '323_var983': facilities983Parsed,
          },
        },
      };

      const getState = () => previousState;

      const thunk = openFacilityPage('vaFacility', {}, defaultSchema);
      await thunk(dispatch, getState);
      const firstAction = dispatch.firstCall.args[0];
      expect(firstAction.type).to.equal(FORM_PAGE_FACILITY_OPEN_SUCCEEDED);

      expect(firstAction.eligibilityData).to.not.be.null;
    });

    it('should fetch eligibility info if only one supported facility', async () => {
      setFetchJSONResponse(global.fetch, clinics);
      const dispatch = sinon.spy();
      const previousState = {
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          data: {
            ...defaultState.newAppointment.data,
            vaParent: 'var983',
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
                id: 'var983GC',
                identifier: [
                  {
                    system: VHA_FHIR_ID,
                    value: '983GC',
                  },
                ],
                legacyVAR: {},
              },
            ],
          },
        },
      };

      const getState = () => previousState;

      const thunk = openFacilityPage('vaFacility', {}, defaultSchema);
      await thunk(dispatch, getState);
      const firstAction = dispatch.firstCall.args[0];
      expect(firstAction.type).to.equal(FORM_PAGE_FACILITY_OPEN_SUCCEEDED);

      expect(firstAction.eligibilityData).to.not.be.null;
    });

    it('should skip eligibility request and succeed if facility list is empty', async () => {
      setFetchJSONResponse(global.fetch, { data: [] });
      const dispatch = sinon.spy();
      const state = set('newAppointment.data.vaParent', 'var983', defaultState);
      const getState = () => state;

      const thunk = openFacilityPage('vaFacility', {}, defaultSchema);
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
      );

      const succeededAction = dispatch.firstCall.args[0];
      expect(succeededAction).to.deep.equal({
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        schema: defaultSchema,
        page: 'vaFacility',
        uiSchema: {},
        parentFacilities: parentFacilitiesParsed,
        facilities: [],
        eligibilityData: null,
        typeOfCareId: defaultState.newAppointment.data.typeOfCareId,
      });
    });
  });

  describe('updateFacilityPageData', () => {
    const defaultState = {
      userState,
      featureToggles: {
        loading: false,
        vaOnlineSchedulingDirect: true,
      },
      newAppointment: {
        data: {
          typeOfCareId: '502',
        },
        pages: {},
        systemsStatus: FETCH_STATUS.notStarted,
        parentFacilities: parentFacilitiesParsed,
        facilities: {},
        eligibility: {},
      },
    };

    beforeEach(() => {
      mockFetch();
    });

    afterEach(() => {
      resetFetch();
    });

    it('should not fetch anything if system did not change', async () => {
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: {
          ...defaultState.newAppointment,
          facilities: {
            '502_var983': facilities983Parsed,
          },
          data: {
            ...defaultState.newAppointment.data,
            vaParent: 'var983',
          },
        },
      });

      const thunk = updateFacilityPageData(
        'vaFacility',
        {},
        {
          ...defaultState.newAppointment.data,
          vaParent: 'var983',
        },
      );
      await thunk(dispatch, getState);

      expect(dispatch.lastCall.args[0].type).to.equal(FORM_DATA_UPDATED);
    });

    it('should not fetch anything if system changed and we already have facilities', async () => {
      const dispatch = sinon.spy();
      const getState = () =>
        set(
          'newAppointment.facilities',
          {
            '502_var983': facilities983Parsed,
          },
          defaultState,
        );

      const thunk = updateFacilityPageData(
        'vaFacility',
        {},
        {
          ...defaultState.newAppointment.data,
          vaParent: 'var983',
        },
      );
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_DATA_UPDATED);
      expect(dispatch.lastCall.args[0].type).to.equal(FORM_VA_PARENT_CHANGED);
    });

    it('should fetch facilities if system is selected already', async () => {
      setFetchJSONResponse(global.fetch, facilities983);
      const dispatch = sinon.spy();
      const getState = () => defaultState;

      const thunk = updateFacilityPageData(
        'vaFacility',
        {},
        {
          ...defaultState.newAppointment.data,
          vaParent: 'var983',
        },
      );
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_DATA_UPDATED);
      expect(dispatch.secondCall.args[0].type).to.equal(
        FORM_FETCH_CHILD_FACILITIES,
      );
      expect(dispatch.lastCall.args[0].type).to.equal(
        FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
      );

      const succeededAction = dispatch.lastCall.args[0];
      expect(succeededAction).to.deep.equal({
        type: FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
        uiSchema: {},
        facilities: facilities983Parsed,
        typeOfCareId: defaultState.newAppointment.data.typeOfCareId,
      });
    });

    it('should fetch system details if no facilities found', async () => {
      setFetchJSONResponse(global.fetch, { data: [] });
      const dispatch = sinon.spy();
      const getState = () => defaultState;

      const thunk = updateFacilityPageData(
        'vaFacility',
        {},
        {
          ...defaultState.newAppointment.data,
          vaParent: 'var983',
        },
      );
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_DATA_UPDATED);
      expect(dispatch.secondCall.args[0].type).to.equal(
        FORM_FETCH_CHILD_FACILITIES,
      );

      // system details dispatch
      expect(dispatch.thirdCall.args[0]).to.be.a('function');

      expect(dispatch.lastCall.args[0].type).to.equal(
        FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
      );

      const succeededAction = dispatch.lastCall.args[0];
      expect(succeededAction).to.deep.equal({
        type: FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
        uiSchema: {},
        facilities: [],
        typeOfCareId: defaultState.newAppointment.data.typeOfCareId,
      });
    });

    it('should send fail action if facilities fetch fails', async () => {
      setFetchJSONFailure(global.fetch, {});
      const dispatch = sinon.spy();
      const getState = () => defaultState;

      const thunk = updateFacilityPageData(
        'vaFacility',
        {},
        {
          ...defaultState.newAppointment.data,
          vaParent: 'var983',
        },
      );
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_DATA_UPDATED);
      expect(dispatch.secondCall.args[0].type).to.equal(
        FORM_FETCH_CHILD_FACILITIES,
      );
      expect(dispatch.lastCall.args[0].type).to.equal(
        FORM_FETCH_CHILD_FACILITIES_FAILED,
      );
    });

    it('should fetch eligibility info if facility is selected', async () => {
      setFetchJSONResponse(global.fetch.onCall(0), {
        data: {
          attributes: {
            numberOfRequests: 0,
            requestLimit: 0,
          },
        },
      });
      setFetchJSONResponse(global.fetch.onCall(1), {
        data: {
          attributes: {
            durationInMonths: 0,
            hasVisitedInPastMonths: false,
          },
        },
      });
      setFetchJSONResponse(global.fetch.onCall(2), {
        data: {
          attributes: {
            durationInMonths: 0,
            hasVisitedInPastMonths: false,
          },
        },
      });
      setFetchJSONResponse(global.fetch.onCall(3), clinics);
      setFetchJSONResponse(global.fetch.onCall(4), pastAppointments);
      setFetchJSONResponse(global.fetch.onCall(5), pastAppointments);
      setFetchJSONResponse(global.fetch.onCall(6), pastAppointments);
      setFetchJSONResponse(global.fetch.onCall(7), pastAppointments);
      setFetchJSONResponse(global.fetch.onCall(8), facilityDetails);
      const dispatch = sinon.spy();
      const previousState = {
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          data: {
            ...defaultState.newAppointment.data,
            vaParent: 'var983',
          },
          facilities: {
            '502_var983': facilities983Parsed,
          },
        },
      };

      const getState = () => previousState;

      const thunk = updateFacilityPageData(
        'vaFacility',
        {},
        {
          ...previousState.newAppointment.data,
          vaFacility: 'var983',
        },
      );
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_DATA_UPDATED);
      expect(dispatch.secondCall.args[0].type).to.equal(
        FORM_ELIGIBILITY_CHECKS,
      );

      expect(dispatch.thirdCall.args[0].type).to.equal(
        FORM_ELIGIBILITY_CHECKS_SUCCEEDED,
      );
      expect(dispatch.getCall(3).args[0].type).to.equal(
        FORM_FETCH_FACILITY_DETAILS,
      );
      expect(dispatch.getCall(4).args[0].type).to.equal(
        FORM_FETCH_FACILITY_DETAILS_SUCCEEDED,
      );

      const succeededAction = dispatch.thirdCall.args[0];
      const eligibilityData = succeededAction.eligibilityData;
      expect(succeededAction.typeOfCareId).to.equal(
        defaultState.newAppointment.data.typeOfCareId,
      );
      expect(eligibilityData.clinics.length).to.equal(4);
      expect(eligibilityData.requestLimits.numberOfRequests).to.equal(0);
    });

    it('should send fail action for error in eligibility code', async () => {
      setFetchJSONResponse(global.fetch, {});
      const dispatch = sinon.spy();
      const previousState = {
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          data: {
            ...defaultState.newAppointment.data,
            vaParent: 'var983',
          },
          facilities: {
            // This is an unexpected data type that causes an error
            '502_var983': {},
          },
        },
      };

      const getState = () => previousState;

      const thunk = updateFacilityPageData(
        'vaFacility',
        {},
        {
          ...previousState.newAppointment.data,
          vaFacility: 'var983',
        },
      );
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_DATA_UPDATED);
      expect(dispatch.secondCall.args[0].type).to.equal(
        FORM_ELIGIBILITY_CHECKS,
      );
      expect(dispatch.lastCall.args[0].type).to.equal(
        FORM_ELIGIBILITY_CHECKS_FAILED,
      );
    });
  });

  describe('openClinicPage', () => {
    it('should fetch facility info', async () => {
      const dispatch = sinon.spy();
      const previousState = {
        newAppointment: {
          data: {
            typeOfCareId: '323',
            vaParent: 'var983',
            vaFacility: 'var983',
          },
          pages: {},
          parentFacilitiesStatus: FETCH_STATUS.notStarted,
          parentFacilities: null,
          facilities: {},
          eligibility: {},
        },
      };

      const getState = () => previousState;

      const thunk = openClinicPage('clinicChoice');
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_CLINIC_PAGE_OPENED);
      expect(dispatch.thirdCall.args[0].type).to.equal(
        FORM_CLINIC_PAGE_OPENED_SUCCEEDED,
      );
    });
  });

  describe('updateReasonForAppointmentData', () => {
    const reasonForAppointment = 'new-issue';
    const reasonAdditionalInfo = 'test';

    it('sends reason for appointment changed action', () => {
      const action = updateReasonForAppointmentData(
        'reasonForAppointment',
        {},
        {
          reasonForAppointment,
          reasonAdditionalInfo,
        },
      );

      expect(action.type).to.equal(FORM_REASON_FOR_APPOINTMENT_CHANGED);
    });
  });

  describe('startDirectScheduleFlow', () => {
    it('should return START_DIRECT_SCHEDULE_FLOW action and record direct schedule event', () => {
      const action = startDirectScheduleFlow();
      expect(action.type).to.equal(START_DIRECT_SCHEDULE_FLOW);
      const dataLayer = global.window.dataLayer;
      expect(dataLayer[0].event).to.equal('vaos-direct-path-started');
    });
  });

  describe('startRequestAppointmentFlow', () => {
    it('should return START_REQUEST_APPOINTMENT_FLOW action and expected record request event if isCommunityCare === true', () => {
      const action = startRequestAppointmentFlow(true);
      expect(action.type).to.equal(START_REQUEST_APPOINTMENT_FLOW);
      const dataLayer = global.window.dataLayer;
      expect(dataLayer[0].event).to.equal('vaos-community-care-path-started');
    });

    it('should return START_REQUEST_APPOINTMENT_FLOW action and record expected request event if isCommunityCare === false', () => {
      const action = startRequestAppointmentFlow();
      expect(action.type).to.equal(START_REQUEST_APPOINTMENT_FLOW);
      const dataLayer = global.window.dataLayer;
      expect(dataLayer[0].event).to.equal('vaos-request-path-started');
    });
  });

  describe('calendar actions', () => {
    it('should fetch appointment slots and not adjust time', async () => {
      mockFetch();
      const tomorrowString = moment()
        .add(1, 'days')
        .format('YYYY-MM-DD');
      setFetchJSONResponse(global.fetch, {
        data: [
          {
            attributes: {
              appointmentLength: 20,
              appointmentTimeSlot: [
                {
                  startDateTime: `${tomorrowString}T14:20:00.000+00:00`,
                  endDateTime: `${tomorrowString}T14:40:00.000+00:00`,
                },
              ],
            },
          },
        ],
      });

      const state = {
        newAppointment: {
          data: {
            preferredDate: '2019-01-01',
            vaFacility: 'var983GC',
            vaParent: 'var983A6',
            typeOfCareId: '323',
            clinicId: 'var983_1234',
          },
          fetchedAppointmentSlotMonths: [],
          parentFacilities: [
            {
              id: 'var983A6',
              partOf: {
                reference: 'Organization/var983',
              },
            },
          ],
          facilities: {
            '323_var983A6': [
              {
                identifier: [
                  {
                    system: VHA_FHIR_ID,
                    value: 'var983GC',
                  },
                ],
              },
            ],
          },
        },
      };
      const getState = () => state;
      const dispatch = sinon.spy();

      const thunk = getAppointmentSlots(
        moment()
          .startOf('month')
          .format('YYYY-MM-DD'),
        moment()
          .add(1, 'months')
          .endOf('month')
          .format('YYYY-MM-DD'),
      );
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FORM_CALENDAR_FETCH_SLOTS,
      );
      expect(global.fetch.firstCall.args[0]).to.contain(
        '/facilities/983/available_appointments?type_of_care_id=323&clinic_ids[]=1234',
      );

      expect(dispatch.secondCall.args[0].type).to.equal(
        FORM_CALENDAR_FETCH_SLOTS_SUCCEEDED,
      );

      expect(dispatch.secondCall.args[0].availableSlots.length).to.equal(1);
      expect(dispatch.secondCall.args[0].availableSlots[0]).to.deep.equal({
        start: `${tomorrowString}T14:20:00.000`,
        end: `${tomorrowString}T14:40:00.000`,
        freeBusyType: 'free',
      });

      resetFetch();
    });

    it('should send fail action when appointment slots fetch fails', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {});

      const state = {
        newAppointment: {
          data: {
            preferredDate: '2019-01-01',
            vaFacility: 'var983GC',
            vaParent: 'var983A6',
            typeOfCareId: '323',
            clinicId: 'var983_1234',
          },
          fetchedAppointmentSlotMonths: [],
          parentFacilities: [
            {
              id: 'var983A6',
              partOf: {
                reference: 'Organization/var983',
              },
            },
          ],
          facilities: {
            '323_var983A6': [
              {
                identifier: [
                  {
                    system: VHA_FHIR_ID,
                    value: 'var983GC',
                  },
                ],
              },
            ],
          },
        },
      };
      const getState = () => state;
      const dispatch = sinon.spy();

      const thunk = getAppointmentSlots(
        moment()
          .startOf('month')
          .format('YYYY-MM-DD'),
        moment()
          .add(1, 'months')
          .endOf('month')
          .format('YYYY-MM-DD'),
      );
      await thunk(dispatch, getState);

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/facilities/983/available_appointments?type_of_care_id=323&clinic_ids[]=1234',
      );
      expect(dispatch.firstCall.args[0].type).to.equal(
        FORM_CALENDAR_FETCH_SLOTS,
      );

      expect(dispatch.secondCall.args[0].type).to.equal(
        FORM_CALENDAR_FETCH_SLOTS_FAILED,
      );

      resetFetch();
    });

    it('should dispatch onChange action', () => {
      expect(
        onCalendarChange({
          currentlySelectedDate: '2020-12-11',
          selectedDates: [{}, {}],
        }).type,
      ).to.equal(FORM_CALENDAR_DATA_CHANGED);
    });
  });

  describe('openCommunityCarePreferencesPage', () => {
    const defaultSchema = {
      type: 'object',
      properties: {},
    };
    const defaultState = {
      newAppointment: {
        data: {
          typeOfCareId: '323',
        },
        pages: {},
        parentFacilitiesStatus: FETCH_STATUS.notStarted,
        ccEnabledSystems: ['983', '984'],
      },
    };

    beforeEach(() => {
      mockFetch();
      setFetchJSONResponse(global.fetch, parentFacilities);
    });

    afterEach(() => {
      resetFetch();
    });

    it('should fetch parentFacilities', async () => {
      const dispatch = sinon.spy();
      const getState = () => defaultState;

      const thunk = openCommunityCarePreferencesPage(
        'ccPreferences',
        {},
        defaultSchema,
      );
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN,
      );
      const succeededAction = dispatch.lastCall.args[0];
      expect(succeededAction).to.deep.equal({
        type: FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_SUCCEEDED,
        schema: defaultSchema,
        page: 'ccPreferences',
        uiSchema: {},
        parentFacilities: parentFacilitiesParsed,
      });
    });

    it('should send fail action when fetch fails', async () => {
      setFetchJSONFailure(global.fetch, {});
      const dispatch = sinon.spy();
      const getState = () => defaultState;

      const thunk = openCommunityCarePreferencesPage(
        'ccPreferences',
        {},
        defaultSchema,
      );
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN,
      );
      expect(dispatch.lastCall.args[0].type).to.equal(
        FORM_PAGE_COMMUNITY_CARE_PREFS_OPEN_FAILED,
      );
    });
  });

  describe('form submit', () => {
    beforeEach(() => {
      mockFetch();
    });

    afterEach(() => {
      resetFetch();
    });

    it('should send VA request', async () => {
      setFetchJSONResponse(global.fetch, { data: { attributes: {} } });
      const router = {
        push: sinon.spy(),
      };

      const thunk = submitAppointmentOrRequest(router);
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: {
          data: {
            typeOfCareId: '323',
            facilityType: 'vamc',
            vaParent: 'var983',
            vaFacility: 'var983',
            calendarData: {
              selectedDates: [],
            },
            reasonForAppointment: 'routine-follow-up',
            bestTimeToCall: [],
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
              address: {},
            },
          ],
          facilities: {
            '323_var983': [
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
          },
        },
      });
      await thunk(dispatch, getState);

      const dataLayer = global.window.dataLayer;
      expect(dispatch.firstCall.args[0].type).to.equal(FORM_SUBMIT);
      expect(dispatch.secondCall.args[0].type).to.equal(FORM_SUBMIT_SUCCEEDED);
      expect(dataLayer[0]).to.deep.equal({
        event: 'vaos-request-submission',
        'health-TypeOfCare': 'Primary care',
        'health-ReasonForAppointment': 'routine-follow-up',
        flow: 'va-request',
      });
      expect(dataLayer[1]).to.deep.equal({
        event: 'vaos-request-submission-successful',
        'health-TypeOfCare': 'Primary care',
        'health-ReasonForAppointment': 'routine-follow-up',
        flow: 'va-request',
      });
      expect(dataLayer[2]).to.deep.equal({
        flow: undefined,
        'health-TypeOfCare': undefined,
        'health-ReasonForAppointment': undefined,
        'error-key': undefined,
        appointmentType: undefined,
        facilityType: undefined,
      });
      expect(router.push.called).to.be.true;
    });

    it('should send CC request', async () => {
      setFetchJSONResponse(global.fetch, { data: { attributes: {} } });
      const router = {
        push: sinon.spy(),
      };

      const thunk = submitAppointmentOrRequest(router);
      const dispatch = sinon.spy();
      const getState = () => ({
        user: {
          profile: {
            vet360: {},
          },
        },
        newAppointment: {
          parentFacilities: [
            {
              id: 'var983',
              identifier: [
                {
                  system: VHA_FHIR_ID,
                  value: '983',
                },
              ],
              address: {},
            },
          ],
          data: {
            communityCareSystemId: 'var983',
            typeOfCareId: '323',
            facilityType: FACILITY_TYPES.COMMUNITY_CARE,
            reasonForAppointment: 'routine-follow-up',
            calendarData: {
              selectedDates: [],
            },
            bestTimeToCall: [],
          },
        },
      });
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_SUBMIT);
      expect(dispatch.secondCall.args[0].type).to.equal(FORM_SUBMIT_SUCCEEDED);
      expect(router.push.called).to.be.true;
    });

    it('should make VA appointment', async () => {
      setFetchJSONResponse(global.fetch, { data: { attributes: {} } });
      const router = {
        push: sinon.spy(),
      };

      const thunk = submitAppointmentOrRequest(router);
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: {
          flowType: FLOW_TYPES.DIRECT,
          clinics: {
            // eslint-disable-next-line camelcase
            var983_323: [
              {
                id: 'var983_123',
                resourceType: 'HealthcareService',
                identifier: [
                  {
                    system: 'http://med.va.gov/fhir/urn',
                    value: 'urn:va:healthcareservice:983:983:308',
                  },
                ],
                serviceName: 'CHY PC KILPATRICK',
                characteristic: [
                  {
                    coding: {
                      code: '983',
                      userSelected: false,
                    },
                    text: 'institutionCode',
                  },
                  {
                    coding: {
                      display: 'CHYSHR-Cheyenne VA Medical Center',
                      userSelected: false,
                    },
                    text: 'institutionName',
                  },
                  {
                    coding: {
                      display: 'Green Team Clinic1',
                      userSelected: false,
                    },
                    text: 'clinicFriendlyLocationName',
                  },
                ],
              },
            ],
          },
          parentFacilities: [
            {
              id: 'var983',
              partOf: {
                reference: 'Organization/var983',
              },
            },
          ],
          facilities: {
            '323_var983': [
              {
                id: 'var983',
                identifier: [
                  {
                    system: VHA_FHIR_ID,
                    value: 'var983',
                  },
                ],
                legacyVAR: {},
              },
            ],
          },
          availableSlots: [
            {
              start: '2019-01-01T04:00:00',
              end: '2019-01-01T04:20:00',
            },
          ],
          data: {
            vaParent: 'var983',
            vaFacility: 'var983',
            typeOfCareId: '323',
            clinicId: 'var983_123',
            facilityType: 'vamc',
            calendarData: {
              selectedDates: [
                {
                  date: '2019-01-01',
                  datetime: '2019-01-01T04:00:00',
                },
              ],
            },
            reasonForAppointment: 'routine-follow-up',
            bestTimeToCall: [],
          },
        },
      });
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_SUBMIT);
      expect(dispatch.secondCall.args[0].type).to.equal(FORM_SUBMIT_SUCCEEDED);
      expect(router.push.called).to.be.true;
    });

    it('should send fail action if request fails', async () => {
      setFetchJSONFailure(global.fetch, {
        data: { attributes: {} },
      });
      const router = {
        push: sinon.spy(),
      };

      const thunk = submitAppointmentOrRequest(router);
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: {
          data: {
            typeOfCareId: '323',
            facilityType: 'vamc',
            vaParent: 'var983',
            vaFacility: 'var983',
            calendarData: {
              selectedDates: [],
            },
            reasonForAppointment: 'routine-follow-up',
            reasonAdditionalInfo: 'test',
            bestTimeToCall: [],
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
              address: {},
            },
          ],
          facilities: {
            '323_var983': [
              {
                id: 'var983',
                identifier: [
                  {
                    system: VHA_FHIR_ID,
                    value: '983',
                  },
                ],
                name: 'CHYSHR-Cheyenne VA Medical Center',
                address: {
                  city: 'Cheyenne',
                  state: 'WY',
                },
                legacyVAR: {
                  institutionTimezone: 'America/Denver',
                },
              },
            ],
          },
        },
      });
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_SUBMIT);
      expect(dispatch.secondCall.args[0].type).to.equal(FORM_SUBMIT_FAILED);
      expect(dispatch.secondCall.args[0].isVaos400Error).to.equal(false);
      expect(global.window.dataLayer[1]).to.deep.equal({
        event: 'vaos-request-submission-failed',
        flow: 'va-request',
        'health-TypeOfCare': 'Primary care',
        'health-ReasonForAppointment': 'routine-follow-up',
      });
      expect(global.window.dataLayer[2]).to.deep.equal({
        flow: undefined,
        'health-TypeOfCare': undefined,
        'health-ReasonForAppointment': undefined,
        'error-key': undefined,
        appointmentType: undefined,
        facilityType: undefined,
      });
      expect(router.push.called).to.be.false;
    });

    it('should set isVaos400Error if request fails with VAOS_400', async () => {
      setFetchJSONFailure(global.fetch, {
        data: { attributes: {} },
        errors: [{ code: 'VAOS_400' }],
      });
      const router = {
        push: sinon.spy(),
      };

      const thunk = submitAppointmentOrRequest(router);
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: {
          data: {
            typeOfCareId: '323',
            facilityType: 'vamc',
            vaParent: 'var983',
            vaFacility: 'var983',
            calendarData: {
              selectedDates: [],
            },
            reasonForAppointment: 'routine-follow-up',
            reasonAdditionalInfo: 'test',
            bestTimeToCall: [],
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
              address: {},
            },
          ],
          facilities: {
            '323_var983': [
              {
                id: 'var983',
                identifier: [
                  {
                    system: VHA_FHIR_ID,
                    value: '983',
                  },
                ],
                name: 'CHYSHR-Cheyenne VA Medical Center',
                address: {
                  city: 'Cheyenne',
                  state: 'WY',
                },
                legacyVAR: {
                  institutionTimezone: 'America/Denver',
                },
              },
            ],
          },
        },
      });
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_SUBMIT);
      expect(dispatch.secondCall.args[0].type).to.equal(FORM_SUBMIT_FAILED);
      expect(dispatch.secondCall.args[0].isVaos400Error).to.equal(true);
      expect(global.window.dataLayer[1]).to.deep.equal({
        event: 'vaos-request-submission-failed',
        flow: 'va-request',
        'health-TypeOfCare': 'Primary care',
        'health-ReasonForAppointment': 'routine-follow-up',
      });
      expect(global.window.dataLayer[2]).to.deep.equal({
        flow: undefined,
        'health-TypeOfCare': undefined,
        'health-ReasonForAppointment': undefined,
        'error-key': undefined,
        appointmentType: undefined,
        facilityType: undefined,
      });
      expect(router.push.called).to.be.false;
    });

    it('should send fail action if direct schedule fails', async () => {
      setFetchJSONFailure(global.fetch, {
        data: { attributes: {} },
      });
      const router = {
        push: sinon.spy(),
      };

      const thunk = submitAppointmentOrRequest(router);
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: {
          flowType: FLOW_TYPES.DIRECT,
          clinics: {
            // eslint-disable-next-line camelcase
            var983_323: [
              {
                id: 'var983_123',
                resourceType: 'HealthcareService',
                serviceName: 'CHY PC KILPATRICK',
                characteristic: [
                  {
                    coding: {
                      code: '983',
                      userSelected: false,
                    },
                    text: 'institutionCode',
                  },
                  {
                    coding: {
                      display: 'CHYSHR-Cheyenne VA Medical Center',
                      userSelected: false,
                    },
                    text: 'institutionName',
                  },
                  {
                    coding: {
                      display: 'Green Team Clinic1',
                      userSelected: false,
                    },
                    text: 'clinicFriendlyLocationName',
                  },
                ],
              },
            ],
          },
          facilities: {
            '323_var983': [
              {
                id: 'var983',
                legacyVAR: {},
              },
            ],
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
              address: {},
            },
          ],
          availableSlots: [
            {
              start: '2019-01-01T04:00:00',
              end: '2019-01-01T04:20:00',
            },
          ],
          data: {
            vaParent: 'var983',
            vaFacility: 'var983',
            typeOfCareId: '323',
            clinicId: '123',
            facilityType: 'vamc',
            calendarData: {
              selectedDates: [
                {
                  date: '2019-01-01',
                  datetime: '2019-01-01T04:00:00',
                },
              ],
            },
            reasonForAppointment: 'routine-follow-up',
            bestTimeToCall: [],
          },
        },
      });
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_SUBMIT);
      expect(dispatch.secondCall.args[0].type).to.equal(FORM_SUBMIT_FAILED);
      expect(dispatch.secondCall.args[0].isVaos400Error).to.equal(false);
      expect(router.push.called).to.be.false;
    });

    it('should set isVaos400Error if error code is VAOS_400', async () => {
      setFetchJSONFailure(global.fetch, {
        data: { attributes: {} },
        errors: [{ code: 'VAOS_400' }],
      });
      const router = {
        push: sinon.spy(),
      };

      const thunk = submitAppointmentOrRequest(router);
      const dispatch = sinon.spy();
      const getState = () => ({
        newAppointment: {
          flowType: FLOW_TYPES.DIRECT,
          clinics: {
            // eslint-disable-next-line camelcase
            var983_323: [
              {
                id: 'var983_123',
                resourceType: 'HealthcareService',
                identifier: [
                  {
                    system: 'http://med.va.gov/fhir/urn',
                    value: 'urn:va:healthcareservice:983:983:308',
                  },
                ],
                serviceName: 'CHY PC KILPATRICK',
                characteristic: [
                  {
                    coding: {
                      code: '983',
                      userSelected: false,
                    },
                    text: 'institutionCode',
                  },
                  {
                    coding: {
                      display: 'CHYSHR-Cheyenne VA Medical Center',
                      userSelected: false,
                    },
                    text: 'institutionName',
                  },
                  {
                    coding: {
                      display: 'Green Team Clinic1',
                      userSelected: false,
                    },
                    text: 'clinicFriendlyLocationName',
                  },
                ],
              },
            ],
          },
          facilities: {
            '323_var983': [
              {
                id: 'var983',
                legacyVAR: {},
              },
            ],
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
              address: {},
            },
          ],
          availableSlots: [
            {
              start: '2019-01-01T04:00:00',
              end: '2019-01-01T04:20:00',
            },
          ],
          data: {
            vaParent: 'var983',
            vaFacility: 'var983',
            typeOfCareId: '323',
            clinicId: 'var983_123',
            facilityType: 'vamc',
            calendarData: {
              selectedDates: [
                {
                  date: '2019-01-01',
                  datetime: '2019-01-01T04:00:00',
                },
              ],
            },
            reasonForAppointment: 'routine-follow-up',
            bestTimeToCall: [],
          },
        },
      });
      await thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(FORM_SUBMIT);
      expect(dispatch.secondCall.args[0].type).to.equal(FORM_SUBMIT_FAILED);
      expect(dispatch.secondCall.args[0].isVaos400Error).to.equal(true);
      expect(router.push.called).to.be.false;
    });
  });

  describe('openTypeOfCarePage', () => {
    it('should open type of care page and pull contact info to prefill', () => {
      const state = {
        user: {
          profile: {
            vet360: {
              email: {
                emailAddress: 'test@va.gov',
              },
              homePhone: {
                areaCode: '503',
                extension: '0000',
                phoneNumber: '2222222',
              },
            },
          },
        },
      };
      const getState = () => state;
      const dispatch = sinon.spy();

      const thunk = openTypeOfCarePage('typeOfCare', {}, {});
      thunk(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(
        FORM_TYPE_OF_CARE_PAGE_OPENED,
      );
      expect(dispatch.firstCall.args[0].phoneNumber).to.equal('5032222222');
      expect(dispatch.firstCall.args[0].email).to.equal('test@va.gov');
    });
  });
  describe('requestAppointmentDateChoice', () => {
    it('should start request flow and route to request date page', () => {
      const router = {
        replace: sinon.spy(),
      };
      const dispatch = sinon.spy();

      requestAppointmentDateChoice(router)(dispatch);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: START_REQUEST_APPOINTMENT_FLOW,
      });
      expect(router.replace.called).to.be.true;
    });
  });
});
