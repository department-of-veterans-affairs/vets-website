import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import POAPermissionsError from '../../components/POAPermissionsError/POAPermissionsError';

describe('POAPermissionsError', () => {
  const getPOAPermissionsError = () => render(<POAPermissionsError />);

  it('renders', () => {
    const { getByTestId } = getPOAPermissionsError();
    expect(getByTestId('poa-permissions-error')).to.exist;
  });

  it('renders headline', () => {
    const { getByTestId } = getPOAPermissionsError();
    expect(getByTestId('poa-permissions-error-heading')).to.exist;
  });

  it('renders description', () => {
    const { getByTestId } = getPOAPermissionsError();
    expect(getByTestId('poa-permissions-error-description')).to.exist;
  });
});
