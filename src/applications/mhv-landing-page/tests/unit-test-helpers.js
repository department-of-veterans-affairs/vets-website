import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';

import ErrorBoundary from '../containers/ErrorBoundary';

export const renderWithRouter = element => {
  return render(
    <ErrorBoundary>
      <MemoryRouter>
        <Routes>
          <Route index element={element} />
        </Routes>
      </MemoryRouter>
    </ErrorBoundary>,
  );
};
