import { get } from 'lodash';
import { apiRequest } from '~/platform/utilities/api';

const GET_REMAINING_ENTITLEMENT_SUCCESS = 'GET_REMAINING_ENTITLEMENT_SUCCESS';

export function getRemainingEntitlement(apiVersion = { apiVersion: 'v0' }) {
  return dispatch =>
    apiRequest('/post911_gi_bill_status', apiVersion)
      .then(response => {
        return dispatch({
          type: GET_REMAINING_ENTITLEMENT_SUCCESS,
          data: {
            remainingEntitlement: get(
              response.data.attributes,
              'remainingEntitlement',
            ),
          },
        });
      })
      .catch(_error => {});
}
