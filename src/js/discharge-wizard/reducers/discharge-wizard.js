import { DW_UPDATE_FIELD } from '../actions';
import _ from 'lodash';

const initialState = {
  '1_reason': null, // 1
  '1_dischargeType': null, // 1a
  '1_intention': null, // 1b
  '2_dischargeYear': undefined, // 2
  '2_dischargeMonth': null, // 2a
  '3_courtMartial': null, // 3
  '4_branchOfService': null, // 4
  '5_prevApplication': null, // 5
  '5_prevApplicationYear': null, // 5a
  '5_prevApplicationType': null, // 5b
};

function form(state = initialState, action) {
  switch (action.type) {
    case DW_UPDATE_FIELD:
    // TODO: reset answers to following questions
      return _.set(state, action.key, action.value);
    default:
      return state;
  }
}

export default form;
