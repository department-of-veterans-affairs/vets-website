import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import NoPOAPermissionsAlert from '../../components/NoPOAPermissionsAlert/NoPOAPermissionsAlert';

describe('NoPOAPermissionsAlert', () => {
  const getNoPOAPermissionsAlert = () => render(<NoPOAPermissionsAlert />);

  it('renders alert', () => {
    const { getByTestId } = getNoPOAPermissionsAlert();
    expect(getByTestId('no-poa-permissions-alert')).to.exist;
  });

  it('renders heading', () => {
    const { getByTestId } = getNoPOAPermissionsAlert();
    expect(getByTestId('no-poa-permissions-alert-heading').textContent).to.eq(
      'You do not have permission to manage power of attorney requests',
    );
  });

  it('renders description', () => {
    const { getByTestId } = getNoPOAPermissionsAlert();
    expect(getByTestId('no-poa-permissions-alert-description')).to.exist;
  });
});
