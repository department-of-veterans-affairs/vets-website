import { apiRequest } from 'platform/utilities/api';
import { get } from 'lodash';

const GET_REMAINING_ENTITLEMENT_SUCCESS = 'GET_REMAINING_ENTITLEMENT_SUCCESS';

export function getRemainingEntitlement() {
  return dispatch =>
    apiRequest('/post911_gi_bill_status', null, response => {
      return dispatch({
        type: GET_REMAINING_ENTITLEMENT_SUCCESS,
        data: {
          remainingEntitlement: get(
            response.data.attributes,
            'remainingEntitlement',
          ),
        },
      });
    }).catch(_error => {});
}
