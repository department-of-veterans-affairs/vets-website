import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';

export const renderWithRouter = element => {
  return render(
    <MemoryRouter>
      <Routes>
        <Route index element={element} />
      </Routes>
    </MemoryRouter>,
  );
};

export const rerenderWithRouter = (rerender, element) => {
  return rerender(
    <MemoryRouter>
      <Routes>
        <Route index element={element} />
      </Routes>
    </MemoryRouter>,
  );
};
