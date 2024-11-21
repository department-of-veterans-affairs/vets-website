import { Actions } from '../util/actionTypes';

const initialState = {
  vitals: undefined,
  allergies: undefined,
  familyHistory: undefined,
  vaccines: undefined,
  chemlab: undefined,
  medicalEvents: undefined,
  militaryHistory: undefined,
  providers: undefined,
  healthInsurance: undefined,
  treatmentFacilities: undefined,
  foodJournal: undefined,
  activityJournal: undefined,
  medications: undefined,
};

export const selfEnteredReducer = (state = initialState, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case Actions.SelfEntered.GET_VITALS: {
      console.log('action', action);
      return {
        ...state,
        vitals: action.payload,
      };
    }
    case Actions.SelfEntered.GET_ALLERGIES: {
      return {
        ...state,
        allergies: action.payload,
      };
    }
    case Actions.SelfEntered.GET_FAMILY_HISTORY: {
      return {
        ...state,
        familyHistory: action.payload,
      };
    }
    case Actions.SelfEntered.GET_VACCINES: {
      return {
        ...state,
        vaccines: action.payload,
      };
    }
    case Actions.SelfEntered.GET_CHEMLAB: {
      return {
        ...state,
        chemlab: action.payload,
      };
    }
    case Actions.SelfEntered.GET_MEDICAL_EVENTS: {
      return {
        ...state,
        medicalEvents: action.payload,
      };
    }
    case Actions.SelfEntered.GET_MILITARY_HISTORY: {
      return {
        ...state,
        militaryHistory: action.payload,
      };
    }
    case Actions.SelfEntered.GET_PROVIDERS: {
      return {
        ...state,
        providers: action.payload,
      };
    }
    case Actions.SelfEntered.GET_HEALTH_INSURANCE: {
      return {
        ...state,
        healthInsurance: action.payload,
      };
    }
    case Actions.SelfEntered.GET_TREATMENT_FACILITIES: {
      return {
        ...state,
        treatmentFacilities: action.payload,
      };
    }
    case Actions.SelfEntered.GET_FOOD_JOURNAL: {
      return {
        ...state,
        foodJournal: action.payload,
      };
    }
    case Actions.SelfEntered.GET_ACTIVITY_JOURNAL: {
      return {
        ...state,
        activityJournal: action.payload,
      };
    }
    case Actions.SelfEntered.GET_MEDICATIONS: {
      return {
        ...state,
        medications: action.payload,
      };
    }
    default:
      return state;
  }
};
