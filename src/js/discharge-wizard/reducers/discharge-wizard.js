import { DW_UPDATE_FIELD } from '../actions';
import _ from 'lodash';

const initialState = {
  reason: null, // 1
  dischargeType: null, // 1a
  intention: null, // 1b
  dischargeYear: null, // 2
  dischargeMonth: null, // 2a
  courtMartial: null, // 3
  branchOfService: null, // 4
  prevApplication: null, // 5
  prevApplicationYear: null, // 5a
  prevApplicationType: null, // 5b
};

function dischargeWizard(state = initialState, action) {
  switch (action.type) {
    case DW_UPDATE_FIELD:
      return _.set(action.key, action.value, state);
    default:
      return state;
  }
}

export default dischargeWizard;
