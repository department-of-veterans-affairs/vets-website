import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import SignedInLayout from '../../containers/SignedInLayout';

describe('SignedInLayout', () => {
  const getSignedInLayout = props =>
    render(
      <MemoryRouter>
        <SignedInLayout {...props} />
      </MemoryRouter>,
    );

  it('renders loading when pilot feature toggle is loading', () => {
    const { getByTestId } = getSignedInLayout({
      isPilotToggleLoading: true,
      isProduction: true,
      isInPilot: true,
      hasPOAPermissions: true,
    });
    expect(getByTestId('signed-in-layout-pilot-toggle-loading')).to.exist;
  });

  it('renders alert when user is not in pilot', () => {
    const { getByTestId } = getSignedInLayout({
      isPilotToggleLoading: false,
      isProduction: true,
      isInPilot: false,
      hasPOAPermissions: true,
    });
    expect(getByTestId('not-in-pilot-alert')).to.exist;
  });

  it('renders alert when user does not have the necessary permissions to manage POA Requests', () => {
    const { getByTestId } = getSignedInLayout({
      isPilotToggleLoading: false,
      isProduction: true,
      isInPilot: true,
      hasPOAPermissions: false,
    });
    expect(getByTestId('no-poa-permissions-alert')).to.exist;
  });

  it('renders content', () => {
    const { getByTestId } = getSignedInLayout({
      isPilotToggleLoading: false,
      isProduction: true,
      isInPilot: true,
      hasPOAPermissions: true,
    });
    expect(getByTestId('signed-in-layout-content')).to.exist;
  });
});
