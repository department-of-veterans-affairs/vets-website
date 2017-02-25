import _ from 'lodash';

const initialState = {
  statuses: {},
};

export default function refresh(state = initialState, action) {
  switch (action.type) {
    case 'REFRESH_POLL_SUCCESS': {
      const statuses = _.reduce(action.data, (o, e) => {
        return {
          ...o,
          [e.attributes.extract_type]: {
            status: e.attributes.status,
            last_updated: e.attributes.last_updated, // eslint-disable-line camelcase
          }
        };
      }, {});
      // returns object in form {extractType: {status: 'OK', last_updated: ISO8601}}
      return {
        statuses
      };
    }
    default:
      return state;
  }
}
