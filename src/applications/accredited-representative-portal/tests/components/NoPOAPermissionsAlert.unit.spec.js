import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import NoPOAPermissionsAlert from '../../components/NoPOAPermissionsAlert/NoPOAPermissionsAlert';

describe('NoPOAPermissionsAlert', () => {
  const getNoPOAPermissionsAlert = () => render(<NoPOAPermissionsAlert />);

  it('renders alert', () => {
    const { getByTestId } = getNoPOAPermissionsAlert();
    expect(getByTestId('not-in-pilot-alert')).to.exist;
  });

  it('renders heading', () => {
    const { getByTestId } = getNoPOAPermissionsAlert();
    expect(getByTestId('not-in-pilot-alert-heading').textContent).to.equal(
      'You do not have permission to manage POA Requests',
    );
  });

  it('renders description', () => {
    const { getByTestId } = getNoPOAPermissionsAlert();
    expect(getByTestId('not-in-pilot-alert-description')).to.exist;
  });
});
