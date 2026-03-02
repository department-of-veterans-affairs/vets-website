import { get } from 'lodash';
import { apiRequest } from '~/platform/utilities/api';
import environment from 'platform/utilities/environment';

const GET_REMAINING_ENTITLEMENT_SUCCESS = 'GET_REMAINING_ENTITLEMENT_SUCCESS';

export function getRemainingEntitlement(enableForm10203ClaimantService) {
  return dispatch => {
    const sobUrl = `${environment.API_URL}/sob/v0/ch33_status`;

    const request = enableForm10203ClaimantService
      ? apiRequest(sobUrl)
      : apiRequest('/post911_gi_bill_status', { apiVersion: 'v1' });

    return request
      .then(response => {
        return dispatch({
          type: GET_REMAINING_ENTITLEMENT_SUCCESS,
          data: {
            remainingEntitlement: get(
              response?.data?.attributes,
              'remainingEntitlement',
            ),
          },
        });
      })
      .catch(_error => {});
  };
}
