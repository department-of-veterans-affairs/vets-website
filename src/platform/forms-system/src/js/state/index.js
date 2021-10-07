/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { createInitialState } from '../state/helpers';
import reducers from '../state/reducers';

export default function createSchemaFormReducer(
  formConfig,
  initialState = createInitialState(formConfig),
  formReducers = reducers,
) {
  return (state = initialState, action) => {
    const reducer = formReducers[action.type];
    console.log(reducer, `--> reducer`);
    if (reducer) {
      console.group/* Collapsed */('if(reducer)');
        console.log(state, `--> state`);
        console.log(action, `--> action`);
      console.groupEnd();
      return reducer(state, action);
    }
    console.log(state, `--> state`);
    return state;
  };
}
