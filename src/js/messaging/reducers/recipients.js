import set from 'lodash/fp/set';

import {
  FETCH_RECIPIENTS_FAILURE,
  FETCH_RECIPIENTS_SUCCESS,
  LOADING_RECIPIENTS
} from '../utils/constants';

const initialState = {
  data: null,
  loading: false
};

export default function recipients(state = initialState, action) {
  switch (action.type) {
    case FETCH_RECIPIENTS_FAILURE:
      return initialState;

    case FETCH_RECIPIENTS_SUCCESS: {
      // Take the recipients object returned during the fetch operation
      // and one return {label, value} object for each object in the
      // action.recipients.data array.
      const data = action.recipients.data.map((item) => {
        return {
          label: item.attributes.name,
          value: item.attributes.triageTeamId
        };
      });

      return { data, loading: false };
    }

    case LOADING_RECIPIENTS:
      return set('loading', true, state);

    default:
      return state;
  }
}
