import { Actions } from '../util/actionTypes';

const initialState = {
  facilities: [],
  cernerFacilities: [],
};

export const facilitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Facilities.GET_FACILITIES:
      return {
        ...state,
        facilities: action.payload.data.map(facility => {
          return facility.attributes;
        }),
      };
    case Actions.Facilities.GET_CERNER_FACILITIES:
      return {
        ...state,
        cernerFacilities: action.payload.map(facility => {
          return facility.attributes;
        }),
      };
    default:
      return state;
  }
};
