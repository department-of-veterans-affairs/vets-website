import { createInitialState } from './helpers';
import reducers from './reducers';
import { applyFormMiddleware } from './middleware';

export default function createSchemaFormReducer(
  formConfig,
  initialState = createInitialState(formConfig),
  formReducers = reducers,
) {
  return (state = initialState, action) => {
    const formAction = applyFormMiddleware(state, action);
    const reducer = formReducers[formAction.type];

    if (reducer) {
      return reducer(state, formAction);
    }

    return state;
  };
}
