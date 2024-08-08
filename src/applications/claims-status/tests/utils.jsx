import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';

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
