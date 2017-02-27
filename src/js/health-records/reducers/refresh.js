import _ from 'lodash';

const initialState = {
  statuses: {
    OK: [],
    ERROR: [],
  },
};

export default function refresh(state = initialState, action) {
  switch (action.type) {
    case 'REFRESH_POLL_SUCCESS': {
      // returns group in form {'OK': [], 'Error': []}
      const statuses = _.groupBy(action.data, 'e.attributes.status');
      return {
        statuses
      };
    }
    default:
      return state;
  }
}
