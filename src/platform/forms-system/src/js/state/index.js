import { applyFormMiddleware } from './middleware';
import { createInitialState } from './helpers';
import reducers from './reducers';

export default function createSchemaFormReducer(
  formConfig,
  initialState = createInitialState(formConfig),
  formReducers = reducers,
) {
  return (state = initialState, action) => {
    applyFormMiddleware(state, action);
    const reducer = formReducers[action.type];

    if (reducer) {
      return reducer(state, action);
    }

    return state;
  };
}
