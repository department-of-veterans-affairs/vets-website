import set from 'lodash/fp/set';

const initialState = {
  veteranFullName: {
    first: 'Shonda',
    middle: 'Eileen',
    last: 'Rhimes',
    suffix: '',
  },
  email: 'yearofyes@va.gov'
};

export default function prolfile(state = initialState, action) {
  switch (action.type) {
    // TODO(crew): Change this to reflect what is acutually being returned.
    case 'LOAD_PROFILE_SUCCESS':
      return set('profile', action.data, state);
    default:
      return state;
  }
}
