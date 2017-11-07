import { DW_UPDATE_FIELD } from '../actions';
// import _ from 'lodash';

const initialState = {
  '1_reason': null, // 1
  '1_dischargeType': null, // 1a
  '1_intention': null, // 1b
  '2_dischargeYear': undefined, // 2
  '2_dischargeMonth': undefined, // 2a
  '3_courtMartial': null, // 3
  '4_branchOfService': null, // 4
  '5_prevApplication': null, // 5
  '5_prevApplicationYear': null, // 5a
  '5_prevApplicationType': null, // 5b
  nextQuestion: '1_intention',
};

function nextQuestion(currentQuestion, answer, state) {
  let next;
  switch (currentQuestion) {
    case '1_reason':
      if (answer === '3') {
        next = '1_dischargeType';
      } else if (answer === '5') {
        next = '2_dischargeYear';
      } else {
        next = '1_intention';
      }
      break;
    case '1_dischargeType':
      next = '1_intention';
      break;
    case '1_intention':
      next = '2_dischargeYear';
      break;
    case '2_dischargeYear':
      if (answer === `${(new Date()).getFullYear() - 15}`) {
        next = '2_dischargeMonth';
      } else {
        next = '3_courtMartial';
      }
      break;
    case '3_courtMartial':
      next = '4_branchOfService';
      break;
    case '4_branchOfService':
      next = '5_prevApplication';
      break;
    case '5_prevApplication':
      if (answer === '1' && parseInt(state['1_reason'], 10) < 5) {
        next = '5_prevApplicationYear';
      } else {
        next = null;
      }
      break;
    case '5_prevApplicationYear':
      if (answer.indexOf('after') > -1) {
        next = '5_prevApplicationType';
      } else {
        next = null;
      }
      break;
    default:
      return null;
  }
  return next;
}

function form(state = initialState, action) {
  switch (action.type) {
    case DW_UPDATE_FIELD:
    // TODO: reset answers to following questions
      return {
        ...state,
        [action.key]: action.value,
        nextQuestion: nextQuestion(action.key, action.value),
      };
    default:
      return state;
  }
}

export default form;
