import { fetchAndUpdateSessionExpiration as fetch } from '@department-of-veterans-affairs/platform-utilities/api';
import {
  FETCH_ORGANIZATIONS,
  FETCH_ORGANIZATIONS_DONE,
  FETCH_ORGANIZATIONS_FAILED,
} from '../../utils/actionTypes';

import { getApi, getEndpointOptions } from '../../config';
/**
 * Handles the API call to get the list of accredited VSO organizations
 */
export const fetchOrganizations = async dispatch => {
  dispatch({ type: FETCH_ORGANIZATIONS });
  try {
    const { fetchOrganizationsEndpoint } = getEndpointOptions();
    const { requestUrl, apiSettings } = getApi(fetchOrganizationsEndpoint);
    const resp = await fetch(requestUrl, apiSettings);
    if (!resp.ok) {
      dispatch({
        type: FETCH_ORGANIZATIONS_FAILED,
        error: resp.body,
      });
      return;
    }

    dispatch({ type: FETCH_ORGANIZATIONS_DONE, payload: await resp.json() });
  } catch (error) {
    dispatch({ type: FETCH_ORGANIZATIONS_FAILED, error: error.message });
    throw error;
  }
};
