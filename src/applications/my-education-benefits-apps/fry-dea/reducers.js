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
              deaEligibility: true,
              deaStartDate: '2022-03-12',
              fryEligibility: true,
              fryStartDate: '2022-01-15',
              id: '1',
              name: 'Hector Stanley',
              relationship: RELATIONSHIP.CHILD,
            },
            {
              dateOfBirth: '1979-10-11',
              deaEligibility: true,
              deaStartDate: '2022-04-05',
              id: '2',
              name: 'Nancy Stanley',
              relationship: RELATIONSHIP.CHILD,
            },
            {
              dateOfBirth: '1996-07-18',
              fryEligibility: true,
              fryStartDate: '2021-11-09',
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
