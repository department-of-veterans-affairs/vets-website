import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import SignedInViewLayout from '../../containers/SignedInLayout';

describe('SignedInViewLayout', () => {
  const getSignedInViewLayout = props =>
    render(
      <MemoryRouter>
        <SignedInViewLayout {...props} />
      </MemoryRouter>,
    );

  it('renders loading when pilot feature toggle is loading', () => {
    const { getByTestId } = getSignedInViewLayout({
      isPilotToggleLoading: true,
      isInPilot: true,
      hasPOAPermissions: true,
    });
    expect(getByTestId('signed-in-layout-pilot-toggle-loading')).to.exist;
  });

  it('renders alert when user is not in pilot', () => {
    const { getByTestId } = getSignedInViewLayout({
      isPilotToggleLoading: false,
      isInPilot: false,
      hasPOAPermissions: true,
    });
    expect(getByTestId('not-in-pilot-error')).to.exist;
  });

  it('renders alert when user does not have the necessary permissions to manage POA Requests', () => {
    const { getByTestId } = getSignedInViewLayout({
      isPilotToggleLoading: false,
      isInPilot: true,
      hasPOAPermissions: false,
    });
    expect(getByTestId('no-poa-permissions-error')).to.exist;
  });

  it('renders SideNav', () => {
    const { getByTestId } = getSignedInViewLayout({
      isPilotToggleLoading: false,
      isInPilot: true,
      hasPOAPermissions: true,
    });
    expect(getByTestId('sidenav-heading')).to.exist;
  });

  it('renders Breadcrumbs', () => {
    const { getByTestId } = getSignedInViewLayout({
      isPilotToggleLoading: false,
      isInPilot: true,
      hasPOAPermissions: true,
    });
    expect(getByTestId('breadcrumbs')).to.exist;
  });
});
