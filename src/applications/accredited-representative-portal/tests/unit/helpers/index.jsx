import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom-v5-compat';

export function TestAppContainer({ children, store }) {
  return (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );
}
