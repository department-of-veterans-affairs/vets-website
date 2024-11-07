import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import { render } from '@testing-library/react';

import createReduxStore from '../../../store';
import rootReducer from '../../../reducers';

export function renderTestApp(children, { initAction } = {}) {
  const store = createReduxStore(rootReducer);
  if (initAction) store.dispatch(initAction);

  return render(
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>,
  );
}
