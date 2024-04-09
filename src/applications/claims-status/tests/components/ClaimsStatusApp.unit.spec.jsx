import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';

import { AppContent } from '../../containers/ClaimsStatusApp';

describe('<AppContent>', () => {
  it('should render loading indicator if feature toggles are not available', () => {
    const screen = render(
      <AppContent featureFlagsLoading>
        <div data-testid="children" />
      </AppContent>,
    );

    expect(screen.getByTestId('feature-flags-loading')).to.exist;
    expect(screen.queryByTestId('children')).to.not.exist;
  });

  it('should render nested route if feature toggles are available', () => {
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppContent featureFlagsLoading={false} />}>
            <Route index element={<div data-testid="children" />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('feature-flags-loading')).to.not.exist;
    expect(screen.queryByTestId('children')).to.exist;
  });
});
