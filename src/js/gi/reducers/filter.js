import { INSTITUTION_FILTER_CHANGED } from '../actions';

const INITIAL_STATE = {
  type: 'all',
  country: 'ALL',
  state: 'ALL',
  without_caution_flags: false,
  student_vet_group: false,
  yellow_ribbon_scholarship: false,
  principles_of_excellence: false,
  eight_keys_to_veteran_success: false,
  type_name: 'ALL',
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case INSTITUTION_FILTER_CHANGED:
      return {
        ...state,
        [action.field]: action.value
      };
    default:
      return state;
  }
}
