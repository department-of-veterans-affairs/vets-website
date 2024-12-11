import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import createReduxStore from '../../../store';
import rootReducer from '../../../reducers';

/**
 * Beginning to look like an overwrought wrapping of multiple underlying APIs'
 * options. Can look out for a refactor.
 */
export function renderTestApp(children, { initAction, initialEntries } = {}) {
  const store = createReduxStore(rootReducer);
  if (initAction) store.dispatch(initAction);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>,
  );
}
