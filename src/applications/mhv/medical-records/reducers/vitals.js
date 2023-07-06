import environment from 'platform/utilities/environment';
import { Actions } from '../util/actionTypes';
import { testing } from '../util/constants';

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

const convertVitalsList = recordList => {
  recordList.entry.map(item => {
    const record = item.resource;
    return {
      name: 'Blood Sugar', // will be replaced by type
      type: record.code.coding.code || record.code.coding.display,
      id: 122,
      measurement: record.component[0].valueQuantity || record.value,
      date: record.effectiveDateTime,
      location: record.encounter,
      facility: 'asdf', // will be replaced by location
      reactions: ['Just this one'], // might only be comments
      comments: record.note.text,
    };
  });
};

export const vitalReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Vitals.GET: {
      return {
        ...state,
        vitalDetails: state.vitalsList.filter(
          vital =>
            vital.name.toLowerCase().replace(/\s+/g, '') === action.vitalType,
        ),
      };
    }
    case Actions.Vitals.GET_LIST: {
      const recordList = action.response;
      let vitalsList;
      if (environment.BUILDTYPE === 'localhost' && testing) {
        convertVitalsList(recordList);
      } else {
        vitalsList = recordList.map(vaccine => {
          return { ...vaccine };
        });
      }
      return {
        ...state,
        vitalsList,
      };
    }
    default:
      return state;
  }
};
