import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

// When using react-router hooks, the component that uses the
// hooks has to be wrapped in a <Router> component. This is a
// helper to reduce the amount of code needed when calling the
// render method on a component
export const renderWithRouter = element => {
  return render(
    <MemoryRouter>
      <Routes>
        <Route index element={element} />
      </Routes>
    </MemoryRouter>,
  );
};

// When using react-router hooks, the component that uses the
// hooks has to be wrapped in a <Router> component. This is a
// helper to reduce the amount of code needed when calling the
// rerender method on a component
export const rerenderWithRouter = (rerender, element) => {
  return rerender(
    <MemoryRouter>
      <Routes>
        <Route index element={element} />
      </Routes>
    </MemoryRouter>,
  );
};

// When using components that need both Redux state and React Router hooks, the component
// has to be wrapped in both <Router> and Redux Provider components. This is a helper to
// reduce the amount of code needed when calling the render method on a component
export const renderWithReduxAndRouter = (element, options = {}) => {
  return renderInReduxProvider(
    <MemoryRouter>
      <Routes>
        <Route index element={element} />
      </Routes>
    </MemoryRouter>,
    options,
  );
};

// When using components that need a custom Redux store and React Router hooks, the component
// has to be wrapped in both <Router> and Redux Provider components. This is a helper to
// reduce the amount of code needed when calling the render method on a component
export const renderWithCustomStore = (element, store) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={element} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};
