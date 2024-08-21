import React from 'react';

import TestingLibrary from '@testing-library/react';

import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';

import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

/**
 * Unit spec helper that renders ui within a react-router@v6 <Route />.
 * @param {React.ReactElement} ui
 * @returns {TestingLibrary.RenderResult}
 */
export const renderWithRouter = ui =>
  TestingLibrary.render(
    <MemoryRouter>
      <Routes>
        <Route index element={ui} />
      </Routes>
    </MemoryRouter>,
  );

/**
 * Unit spec helper that renders ui within a react-router@v6 <Route /> with redux.
 *   Calls renderInReduxProvider from src/platform/testing/unit/react-testing-library-helpers.js
 * @param {React.ReactElement} ui
 * @param {Object} options
 * @returns {TestingLibrary.RenderResult}
 */
export const render = (ui, options = {}) =>
  renderInReduxProvider(
    <MemoryRouter>
      <Routes>
        <Route index element={ui} />
      </Routes>
    </MemoryRouter>,
    options,
  );
