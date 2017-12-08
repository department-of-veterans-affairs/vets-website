import { DW_UPDATE_FIELD } from '../actions';
import _ from 'lodash';

const initialState = {
  '1_branchOfService': null, // 4
  '2_dischargeYear': undefined, // 2
  '3_dischargeMonth': undefined, // 2a
  '4_reason': null, // 1
  '5_dischargeType': null, // 1a
  '6_intention': null, // 1b
  '7_courtMartial': null, // 3
  '8_prevApplication': null, // 5
  '9_prevApplicationYear': null, // 5a
  '10_prevApplicationType': null, // 5b
  '11_priorService': null, // 6
  questions: ['1_branchOfService'], // represents valid question progression
};

function nextQuestion(currentQuestion, answer, state) {
  let next;
  switch (currentQuestion) {
    case '1_branchOfService':
      next = '2_dischargeYear';
      break;
    case '2_dischargeYear':
      if (answer === `${(new Date()).getFullYear() - 15}`) {
        next = '3_dischargeMonth';
      } else {
        next = '4_reason';
      }
      break;
    case '3_dischargeMonth':
      next = '4_reason';
      break;
    case '4_reason':
      if (answer === '3') {
        next = '5_dischargeType';
      } else if (answer === '8') {
        next = '10_prevApplicationType';
      } else {
        next = '6_intention';
      }
      break;
    case '5_dischargeType':
      next = '6_intention';
      break;
    case '6_intention':
      next = '7_courtMartial';
      break;
    case '7_courtMartial':
      next = '8_prevApplication';
      break;
    case '8_prevApplication':
      if (answer === '1') {
        if (parseInt(state['4_reason'], 10) < 5) {
          next = '9_prevApplicationYear';
        } else {
          next = '10_prevApplicationType';
        }
      } else {
        if (state['4_reason'] !== '5' && state['5_dischargeType'] !== '1') {
          next = '11_priorService';
        } else {
          next = 'END';
        }
      }
      break;
    case '9_prevApplicationYear':
      if (answer === '2') {
        next = '10_prevApplicationType';
      } else {
        if (state['4_reason'] !== '5' && state['5_dischargeType'] !== '1') {
          next = '11_priorService';
        } else {
          next = 'END';
        }
      }
      break;
    case '10_prevApplicationType':
      if (state['4_reason'] === '8') {
        next = 'END';
      } else if (state['4_reason'] !== '5' && state['5_dischargeType'] !== '1') {
        next = '11_priorService';
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
  const isPastOrCurrentStep = (e) => {
    const num = e.split('_')[0];
    const nextNum = action.key.split('_')[0];
    return parseInt(num, 10) <= parseInt(nextNum, 10);
  };

  switch (action.type) {
    case DW_UPDATE_FIELD:
      if (nextQuestion(action.key, action.value, state) === 'END') {
        return {
          ...state,
          [action.key]: action.value,
          questions: state.questions.filter(isPastOrCurrentStep).concat([nextQuestion(action.key, action.value, state)]),
        };
      }
      return {
        ...state,
        // reset answers for subsequent questions
        ...Object.keys(initialState).reduce((a, k) => {
          const num = k.split('_')[0];
          const nextNum = action.key.split('_')[0];
          if (parseInt(num, 10) > parseInt(nextNum, 10)) {
            return _.set(a, k, initialState[k]);
          }
          return a;
        }, {}),
        [action.key]: action.value,
        questions: state.questions.filter(isPastOrCurrentStep).concat([nextQuestion(action.key, action.value, state)]),
      };
    default:
      return state;
  }
}

export default form;
