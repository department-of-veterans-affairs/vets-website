import React from 'react';
import { Provider } from 'react-redux';
import {
  createMemoryRouter,
  RouterProvider,
  MemoryRouter,
} from 'react-router-dom';
import { render } from '@testing-library/react';

import createReduxStore from '../../../utilities/store';

/**
 * Beginning to look like an overwrought wrapping of multiple underlying APIs'
 * options. Can look out for a refactor.
 */
export function renderTestApp(children, { initAction, initialEntries } = {}) {
  const store = createReduxStore();
  if (initAction) store.dispatch(initAction);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>,
  );
}

export function renderTestComponent(element) {
  const router = createMemoryRouter([
    {
      path: '/',
      element,
    },
  ]);

  return render(<RouterProvider router={router} />);
}

export function renderTestRoutes(routes) {
  const router = createMemoryRouter(routes);

  return render(<RouterProvider router={router} />);
}
