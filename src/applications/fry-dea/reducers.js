import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import { FETCH_VETERANS_FAILED, FETCH_VETERANS_SUCCESS } from './actions';
import formConfig from './config/form';
import { RELATIONSHIP } from './constants';

const initialState = {
  data: {},
  form: {},
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  data: (state = initialState, action) => {
    switch (action.type) {
      case FETCH_VETERANS_SUCCESS:
        return {
          ...state,
          veterans: action?.response?.attributes,
        };
      case FETCH_VETERANS_FAILED:
        return {
          ...state,
          veterans: [
            {
              dateOfBirth: '1978-07-18',
              deaEligibility: 36,
              fryEligibility: 45,
              id: '1',
              name: 'Hector Stanley',
              relationship: RELATIONSHIP.CHILD,
            },
            {
              dateOfBirth: '1979-10-11',
              deaEligibility: 36,
              id: '2',
              name: 'Nancy Stanley',
              relationship: RELATIONSHIP.CHILD,
            },
            {
              dateOfBirth: '1996-07-18',
              fryEligibility: 45,
              id: '3',
              name: 'Jane Doe',
              relationship: RELATIONSHIP.SPOUSE,
            },
          ],
        };
      default:
        return state;
    }
  },
};
