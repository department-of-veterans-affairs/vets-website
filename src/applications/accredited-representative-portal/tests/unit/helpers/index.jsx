import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import createReduxStore from '../../../store';
import rootReducer from '../../../reducers';

export function TestApp({ children, initAction }) {
  const store = createReduxStore(rootReducer);
  if (initAction) store.dispatch(initAction);

  return (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );
}
