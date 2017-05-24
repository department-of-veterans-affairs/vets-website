import _ from 'lodash';
import moment from 'moment';

const initialState = {
  statuses: {
    failed: [],
    incomplete: [],
    succeeded: [],
  },
};

export default function refresh(state = initialState, action) {
  switch (action.type) {
    case 'REFRESH_POLL_SUCCESS': {
      // returns group in form {'succeeded': [], 'failed': []}
      const statuses = _.groupBy(action.data, (e) => {
        const isCurrentDay = moment().isSame(e.attributes.last_updated, 'day');
        const isStatusOK = e.attributes.status === 'OK';
        if (!isCurrentDay) {
          return 'incomplete';
        } else if (isCurrentDay && isStatusOK) {
          return 'succeeded';
        }
        return 'failed';
      });
      return {
        statuses
      };
    }
    default:
      return state;
  }
}
