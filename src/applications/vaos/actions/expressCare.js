import moment from 'moment';

import { selectSystemIds } from '../utils/selectors';
import { captureError } from '../utils/error';

import { getFacilitiesBySystemAndTypeOfCare } from '../api';

import { FETCH_STATUS, EXPRESS_CARE } from '../utils/constants';

import {
  getOrganizations,
  getRootOrganization,
  getSiteIdFromOrganization,
} from '../services/organization';

export const FETCH_EXPRESS_CARE_WINDOWS = 'vaos/FETCH_EXPRESS_CARE_WINDOWS';
export const FETCH_EXPRESS_CARE_WINDOWS_FAILED =
  'vaos/FETCH_EXPRESS_CARE_WINDOWS_FAILED';
export const FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED =
  'vaos/FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED';

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
