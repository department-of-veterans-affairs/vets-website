import { Actions } from '../util/actionTypes';
import { loincCodes, EMPTY_FIELD } from '../util/constants';
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
      item => item.code.coding[0].code === loincCodes.SYSTOLIC,
    );
    const diastolic = record.component.find(
      item => item.code.coding[0].code === loincCodes.DIASTOLIC,
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
    measurement: getMeasurement(record, type) || EMPTY_FIELD,
    date: record.effectiveDateTime || EMPTY_FIELD,
    location: record.encounter || EMPTY_FIELD,
    notes:
      (isArrayAndHasItems(record.note) && record.note[0].text) || EMPTY_FIELD,
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
        vitalsList:
          action.response.entry?.map(vital => {
            return convertVital(vital.resource);
          }) || [],
      };
    }
    default:
      return state;
  }
};
