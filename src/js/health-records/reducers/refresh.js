import _ from 'lodash';
import moment from 'moment';

const initialState = {
  statuses: {
    succeeded: [],
    failed: [],
  },
};

export default function refresh(state = initialState, action) {
  switch (action.type) {
    case 'REFRESH_POLL_SUCCESS': {
      // returns group in form {'succeeded': [], 'failed': []}
      const statuses = _.groupBy(action.data, (e) => {
        const isCurrentDay = moment().isSame(e.attributes.last_updated, 'day');
        const isStatusOK = e.attributes.status === 'OK';
        return (isCurrentDay && isStatusOK) ? 'succeeded' : 'failed';
      });
      return {
        statuses
      };
    }
    default:
      return state;
  }
}
