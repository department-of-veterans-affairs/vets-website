import { DW_UPDATE_FIELD } from '../actions';
import _ from 'lodash';

const initialState = {
  '1_reason': null, // 1
  '2_dischargeType': null, // 1a
  '3_intention': null, // 1b
  '4_dischargeYear': undefined, // 2
  '5_dischargeMonth': undefined, // 2a
  '6_courtMartial': null, // 3
  '7_branchOfService': null, // 4
  '8_prevApplication': null, // 5
  '9_prevApplicationYear': null, // 5a
  '10_prevApplicationType': null, // 5b
  questions: ['1_reason'],
};

function nextQuestion(currentQuestion, answer, state) {
  let next;
  switch (currentQuestion) {
    case '1_reason':
      if (answer === '3') {
        next = '2_dischargeType';
      } else if (answer === '5') {
        next = '4_dischargeYear';
      } else {
        next = '3_intention';
      }
      break;
    case '2_dischargeType':
      next = '3_intention';
      break;
    case '3_intention':
      next = '4_dischargeYear';
      break;
    case '4_dischargeYear':
      if (answer === `${(new Date()).getFullYear() - 15}`) {
        next = '5_dischargeMonth';
      } else {
        next = '6_courtMartial';
      }
      break;
    case '5_dischargeMonth':
      next = '6_courtMartial';
      break;
    case '6_courtMartial':
      next = '7_branchOfService';
      break;
    case '7_branchOfService':
      next = '8_prevApplication';
      break;
    case '8_prevApplication':
      if (answer === '1' && parseInt(state['1_reason'], 10) < 5) {
        next = '9_prevApplicationYear';
      } else {
        next = 'END';
      }
      break;
    case '9_prevApplicationYear':
      if (answer === '2') {
        next = '10_prevApplicationType';
      } else {
        next = 'END';
      }
      break;
    default:
      return 'END';
  }
  return next;
}

function form(state = initialState, action) {
  switch (action.type) {
    case DW_UPDATE_FIELD:
      if (nextQuestion(action.key, action.value, state) === 'END') {
        return {
          ...state,
          [action.key]: action.value,
          questions: state.questions.filter(e => {
            const num = e.split('_')[0];
            const nextNum = action.key.split('_')[0];
            return parseInt(num, 10) <= parseInt(nextNum, 10);
          }).concat([nextQuestion(action.key, action.value, state)]),
        };
      }
      return {
        ...state,
        ...Object.keys(initialState).reduce((a, k) => {
          const num = k.split('_')[0];
          const nextNum = action.key.split('_')[0];
          if (parseInt(num, 10) > parseInt(nextNum, 10)) {
            return _.set(a, k, initialState[k]);
          }
          return a;
        }, {}),
        [action.key]: action.value,
        questions: state.questions.filter(e => {
          const num = e.split('_')[0];
          const nextNum = action.key.split('_')[0];
          return parseInt(num, 10) <= parseInt(nextNum, 10);
        }).concat([nextQuestion(action.key, action.value, state)]),
      };
    default:
      return state;
  }
}

export default form;
