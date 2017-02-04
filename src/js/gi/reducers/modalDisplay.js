import { DISPLAY_MODAL } from '../actions';

const INITIAL_STATE = {
  retention: false,
  gradrates: false,
  salaries: false,
  repayment: false,

  gibillstudents: false,

  vetgroups: false,
  yribbon: false,
  poe: false,
  tool: false,
  eightKeys: false,

  accredited: false,
  typeAccredited: false,
  tuitionPolicy: false,
  singleContact: false,
  creditTraining: false,

  facilityCode: false,
  ipedsCode: false,
  opeCode: false,

  cautionInfo: false
};

export default function (state = INITIAL_STATE, action) {
  if (action.type === DISPLAY_MODAL) {
    if (!!action.modal) {
      return {
        ...state,
        [action.modal]: true
      };
    }
    return INITIAL_STATE;
  }
  return state;
}
