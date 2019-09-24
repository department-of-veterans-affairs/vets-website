import mockSystems from './systems.json';
import mockFacilityData from './facilities.json';
import mockFacility983Data from './facilities_983.json';
import mockFacility984Data from './facilities_984.json';

import newAppointmentFlow from '../newAppointmentFlow';

export const FORM_DATA_UPDATED = 'newAppointment/FORM_DATA_UPDATED';
export const FORM_PAGE_OPENED = 'newAppointment/FORM_PAGE_OPENED';
export const FORM_PAGE_CHANGE_STARTED =
  'newAppointment/FORM_PAGE_CHANGE_STARTED';
export const FORM_PAGE_CHANGE_COMPLETED =
  'newAppointment/FORM_PAGE_CHANGE_COMPLETED';
export const FORM_PAGE_FACILITY_OPEN = 'newAppointment/FACILITY_PAGE_OPEN';
export const FORM_PAGE_FACILITY_OPEN_SUCCEEDED =
  'newAppointment/FACILITY_PAGE_OPEN_SUCCEEDED';
export const FORM_FETCH_CHILD_FACILITIES =
  'newAppointment/FORM_FETCH_CHILD_FACILITIES';
export const FORM_FETCH_CHILD_FACILITIES_SUCCEEDED =
  'newAppointment/FORM_FETCH_CHILD_FACILITIES_SUCCEEDED';

export function openFormPage(page, uiSchema, schema) {
  return {
    type: FORM_PAGE_OPENED,
    page,
    uiSchema,
    schema,
  };
}

export function updateFormData(page, uiSchema, data) {
  return {
    type: FORM_DATA_UPDATED,
    page,
    uiSchema,
    data,
  };
}

function mockFetchFacility() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockFacilityData);
    }, 1000);
  });
}

function mockInstitutionsFetch(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (url.includes('984')) {
        resolve(mockFacility984Data);
      } else {
        resolve(mockFacility983Data);
      }
    }, 1000);
  });
}

export function openFacilityPage(page, uiSchema, schema) {
  return async (dispatch, getState) => {
    dispatch({
      type: FORM_PAGE_FACILITY_OPEN,
    });

    if (
      !getState().newAppointment.pages[page]?.properties?.vaSystem?.enumNames
    ) {
      const systemIds = mockSystems
        .filter(id => id.assigningAuthority.startsWith('dfn'))
        .map(id => id.assigningCode);

      const systems = await mockFetchFacility(
        `/facilities?facilityIds=${systemIds.join(',')}`,
      );

      dispatch({
        type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
        page,
        uiSchema,
        schema,
        systems,
      });
    }
  };
}

export function updateFacilityPageData(page, uiSchema, data) {
  return async (dispatch, getState) => {
    const previousState = getState();
    dispatch(updateFormData(page, uiSchema, data));
    if (
      data.vaSystem &&
      previousState.newAppointment.data.vaSystem !== data.vaSystem &&
      !previousState.newAppointment.facilities?.some(
        facility => facility.facilityId === data.vaSystem,
      )
    ) {
      dispatch({
        type: FORM_FETCH_CHILD_FACILITIES,
      });
      const facilities = await mockInstitutionsFetch(
        `/systems/${data.vaSystem}/facilities?typeOfCareId=${
          data.typeOfCareId
        }`,
      );
      dispatch({
        type: FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
        uiSchema,
        facilities,
      });
    }
  };
}

export function routeToPageInFlow(flow, router, current, action) {
  return async (dispatch, getState) => {
    dispatch({
      type: FORM_PAGE_CHANGE_STARTED,
    });

    const nextAction = flow[current][action];
    let nextPage;

    if (typeof nextAction === 'string') {
      nextPage = flow[nextAction];
    } else {
      const nextStateKey = await nextAction(getState(), dispatch);
      nextPage = flow[nextStateKey];
    }

    if (nextPage?.url) {
      router.push(nextPage.url);
      dispatch({
        type: FORM_PAGE_CHANGE_COMPLETED,
      });
    } else if (nextPage) {
      throw new Error(`Tried to route to a page without a url: ${nextPage}`);
    } else {
      throw new Error('Tried to route to page that does not exist');
    }
  };
}

export function routeToNextAppointmentPage(router, current) {
  return routeToPageInFlow(newAppointmentFlow, router, current, 'next');
}

export function routeToPreviousAppointmentPage(router, current) {
  return routeToPageInFlow(newAppointmentFlow, router, current, 'previous');
}
