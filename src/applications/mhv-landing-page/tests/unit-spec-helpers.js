import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';

import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

export const renderWithRouter = ui =>
  rtlRender(
    <MemoryRouter>
      <Routes>
        <Route index element={ui} />
      </Routes>
    </MemoryRouter>,
  );

export const render = (ui, props) =>
  renderInReduxProvider(
    <MemoryRouter>
      <Routes>
        <Route index element={ui} />
      </Routes>
    </MemoryRouter>,
    props,
  );
