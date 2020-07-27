import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';

import newExpressCareRequestFlow from '../newExpressCareRequestFlow';
import { selectSystemIds } from '../utils/selectors';
import {
  getPreferences,
  updatePreferences,
  getFacilitiesBySystemAndTypeOfCare,
  submitRequest,
} from '../api';
import { GA_PREFIX, EXPRESS_CARE } from '../utils/constants';
import { resetDataLayer } from '../utils/events';
import { captureError, getErrorCodes } from '../utils/error';

import {
  getOrganizations,
  getRootOrganization,
  getSiteIdFromOrganization,
} from '../services/organization';

import {
  transformFormToExpressCareRequest,
  createPreferenceBody,
} from '../utils/data';

export const FORM_PAGE_OPENED = 'expressCare/FORM_PAGE_OPENED';
export const FORM_DATA_UPDATED = 'expressCare/FORM_DATA_UPDATED';
export const FORM_PAGE_CHANGE_STARTED = 'expressCare/FORM_PAGE_CHANGE_STARTED';
export const FORM_PAGE_CHANGE_COMPLETED =
  'expressCare/FORM_PAGE_CHANGE_COMPLETED';
export const FORM_RESET = 'expressCare/FORM_RESET';
export const FORM_SUBMIT = 'expressCare/FORM_SUBMIT';
export const FORM_SUBMIT_SUCCEEDED = 'expressCare/FORM_SUBMIT_SUCCEEDED';
export const FORM_SUBMIT_FAILED = 'expressCare/FORM_SUBMIT_FAILED';
export const FETCH_EXPRESS_CARE_WINDOWS =
  'expressCare/FETCH_EXPRESS_CARE_WINDOWS';
export const FETCH_EXPRESS_CARE_WINDOWS_FAILED =
  'expressCare/FETCH_EXPRESS_CARE_WINDOWS_FAILED';
export const FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED =
  'expressCare/FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED';

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

export function fetchExpressCareWindows() {
  return async (dispatch, getState) => {
    dispatch({
      type: FETCH_EXPRESS_CARE_WINDOWS,
    });

    const initialState = getState();
    const appointments = initialState.appointments;
    let parentFacilities = appointments.parentFacilities;
    const userSiteIds = selectSystemIds(initialState);

    try {
      if (!parentFacilities) {
        parentFacilities = await getOrganizations({
          siteIds: userSiteIds,
          useVSP: false,
        });
        if (parentFacilities.length) {
          const ids = parentFacilities.map(parent => parent.id);
          const facilityData = [];

          if (ids.length < 20) {
            const paramsArray = parentFacilities.map(parent => {
              const rootOrg = getRootOrganization(parentFacilities, parent.id);
              return {
                siteId: getSiteIdFromOrganization(rootOrg || parent),
                parentId: parent.id.replace('var', ''),
                typeOfCareId: EXPRESS_CARE,
              };
            });

            facilityData.push(
              ...(await Promise.all(
                paramsArray.map(p =>
                  getFacilitiesBySystemAndTypeOfCare(
                    p.siteId,
                    p.parentId,
                    p.typeOfCareId,
                  ),
                ),
              )),
            );
          }

          dispatch({
            type: FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
            facilityData,
            nowUtc: moment.utc(),
          });
        }
      }
    } catch (error) {
      captureError(error);
      dispatch({
        type: FETCH_EXPRESS_CARE_WINDOWS_FAILED,
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
      dispatch({
        type: FORM_PAGE_CHANGE_COMPLETED,
      });
      router.push(nextPage.url);
    } else if (nextPage) {
      throw new Error(`Tried to route to a page without a url: ${nextPage}`);
    } else {
      throw new Error('Tried to route to page that does not exist');
    }
  };
}

export function routeToNextAppointmentPage(router, current) {
  return routeToPageInFlow(newExpressCareRequestFlow, router, current, 'next');
}

export function routeToPreviousAppointmentPage(router, current) {
  return routeToPageInFlow(
    newExpressCareRequestFlow,
    router,
    current,
    'previous',
  );
}

async function buildPreferencesDataAndUpdate(expressCare) {
  const preferenceData = await getPreferences();
  const preferenceBody = createPreferenceBody(preferenceData, expressCare.data);
  return updatePreferences(preferenceBody);
}

export function submitExpressCareRequest(router) {
  return async (dispatch, getState) => {
    const state = getState();
    const expressCare = state.expressCare;

    dispatch({
      type: FORM_SUBMIT,
    });

    let requestBody;

    recordEvent({
      event: `${GA_PREFIX}-express-care-submission`,
    });

    try {
      requestBody = transformFormToExpressCareRequest(getState());
      const requestData = await submitRequest('va', requestBody);

      try {
        await buildPreferencesDataAndUpdate(expressCare);
      } catch (error) {
        // These are ancillary updates, the request went through if the first submit
        // succeeded
        captureError(error, false, 'Express Care preferences error');
      }

      dispatch({
        type: FORM_SUBMIT_SUCCEEDED,
        requestData,
      });

      recordEvent({
        event: `${GA_PREFIX}-express-care-submission-successful`,
      });
      resetDataLayer();
      router.push('/new-appointment/confirmation');
    } catch (error) {
      captureError(error, true, 'Express Care submission failure');
      dispatch({
        type: FORM_SUBMIT_FAILED,
        isVaos400Error: getErrorCodes(error).includes('VAOS_400'),
      });

      recordEvent({
        event: `${GA_PREFIX}-express-care-submission-failed`,
      });
      resetDataLayer();
    }
  };
}
