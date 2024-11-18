import React from 'react';
import { expect } from 'chai';

import { renderTestApp } from '../helpers';
import SignedInLayout from '../../../containers/SignedInLayout';

describe('SignedInLayout', () => {
  it('renders loading when pilot feature toggle is loading', () => {
    const { getByTestId } = renderTestApp(
      <SignedInLayout
        isPilotToggleLoading
        isProduction
        isInPilot
        hasPOAPermissions
      />,
    );

    expect(getByTestId('signed-in-layout-pilot-toggle-loading')).to.exist;
  });

  it('renders alert when user is not in pilot', () => {
    const { getByTestId } = renderTestApp(
      <SignedInLayout
        isPilotToggleLoading={false}
        isProduction
        isInPilot={false}
        hasPOAPermissions
      />,
    );

    expect(getByTestId('not-in-pilot-alert')).to.exist;
  });

  it('renders alert when user does not have the necessary permissions to manage POA Requests', () => {
    const { getByTestId } = renderTestApp(
      <SignedInLayout
        isPilotToggleLoading={false}
        isProduction
        isInPilot
        hasPOAPermissions={false}
      />,
    );

    expect(getByTestId('no-poa-permissions-alert')).to.exist;
  });

  it('renders content', () => {
    const { getByTestId } = renderTestApp(
      <SignedInLayout
        isPilotToggleLoading={false}
        isProduction
        isInPilot
        hasPOAPermissions
      />,
    );

    expect(getByTestId('signed-in-layout-content')).to.exist;
  });
});
