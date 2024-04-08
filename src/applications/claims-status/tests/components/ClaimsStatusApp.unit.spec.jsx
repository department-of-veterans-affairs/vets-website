import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';

import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { AppContent, ClaimsStatusApp } from '../../containers/ClaimsStatusApp';

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

  it.skip('should render ClaimsStatusApp', () => {
    const props = {
      dispatchSetLastPage: sinon.spy(),
      featureFlagsLoading: false,
      user: {
        login: { currentlyLoggedIn: true, hasCheckedKeepAlive: false },
        profile: {
          services: [
            backendServices.EVSS_CLAIMS,
            backendServices.APPEALS_STATUS,
            backendServices.LIGHTHOUSE,
          ],
        },
      },
    };
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<ClaimsStatusApp {...props} />}>
            <Route index element={<div data-testid="children" />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('feature-flags-loading')).to.not.exist;
    expect(screen.queryByTestId('children')).to.exist;
    expect(props.dispatchSetLastPage.called).to.be.false;
  });
});
