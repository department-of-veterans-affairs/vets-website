import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import NoPOAPermissionsError from '../../components/NoPOAPermissionsError/NoPOAPermissionsError';

describe('NoPOAPermissionsError', () => {
  const getNoPOAPermissionsError = () => render(<NoPOAPermissionsError />);

  it('renders error', () => {
    const { getByTestId } = getNoPOAPermissionsError();
    expect(getByTestId('not-in-pilot-error')).to.exist;
  });

  it('renders heading', () => {
    const { getByTestId } = getNoPOAPermissionsError();
    expect(getByTestId('not-in-pilot-error-heading').textContent).to.equal(
      'You do not have permission to manage POA Requests',
    );
  });

  it('renders description', () => {
    const { getByTestId } = getNoPOAPermissionsError();
    expect(getByTestId('not-in-pilot-error-description')).to.exist;
  });
});
