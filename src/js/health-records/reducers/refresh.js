import { groupBy } from 'lodash';
import moment from 'moment';

const initialState = {
  statuses: {
    failed: [],
    incomplete: [],
    succeeded: [],
  },
  loading: false,
  errors: []
};

export default function refresh(state = initialState, action) {
  switch (action.type) {
    case 'INITIAL_LOADING':
      return { ...initialState, loading: true };

    case 'INITIAL_REFRESH_SUCCESS':
      return { ...state, loading: false };

    case 'INITIAL_REFRESH_FAILURE':
      return { ...state, loading: false, errors: action.errors };

    case 'REFRESH_POLL_SUCCESS': {
      // returns group in form { succeeded: [], failed: [] }
      const statuses = groupBy(extractStatus => {
        const { lastUpdated, status } = extractStatus.attributes;
        const isUpdated = moment().isSame(lastUpdated, 'day');
        if (!isUpdated) { return 'incomplete'; }
        return (status === 'OK') ? 'succeeded' : 'failed';
      })(action.data);

      return { ...state, statuses };
    }

    default:
      return state;
  }
}
