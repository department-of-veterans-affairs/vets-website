import { Actions } from '../util/actionTypes';
import { LoincCodes, emptyField } from '../util/constants';
import { isArrayAndHasItems, macroCase } from '../util/helpers';

const initialState = {
  /**
   * The list of vaccines returned from the api
   * @type {array}
   */
  vitalsList: undefined,
  /**
   * The vaccine currently being displayed to the user
   */
  vitalDetails: undefined,
};

const getMeasurement = (record, type) => {
  if (type === 'BLOOD_PRESSURE') {
    const systolic = record.component.find(
      item => item.code.coding[0].code === LoincCodes.SYSTOLIC,
    );
    const diastolic = record.component.find(
      item => item.code.coding[0].code === LoincCodes.DIASTOLIC,
    );
    return `${systolic.valueQuantity.value}/${diastolic.valueQuantity.value}`;
  }
  return record.valueQuantity?.value + record.valueQuantity?.code;
};

export const convertVital = record => {
  const type = macroCase(record.code?.text);
  return {
    name:
      record.code?.text ||
      (isArrayAndHasItems(record.code?.coding) &&
        record.code?.coding[0].display),
    type,
    id: record.id,
    measurement: getMeasurement(record, type) || emptyField,
    date: record.effectiveDateTime || emptyField,
    location: record.encounter || emptyField,
    notes:
      (isArrayAndHasItems(record.note) && record.note[0].text) || emptyField,
  };
};

export const vitalReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Vitals.GET: {
      return {
        ...state,
        vitalDetails: state.vitalsList.filter(
          vital => vital.type === action.vitalType,
        ),
      };
    }
    case Actions.Vitals.GET_LIST: {
      return {
        ...state,
        vitalsList: action.response.entry?.map(item =>
          convertVital(item.resource),
        ),
      };
    }
    default:
      return state;
  }
};
