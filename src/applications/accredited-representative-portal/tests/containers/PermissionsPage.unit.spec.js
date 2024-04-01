import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import PermissionsPage from '../../containers/PermissionsPage';

describe('PermissionsPage', () => {
  const getPermissionsPage = () => render(<PermissionsPage />);

  it('renders heading', () => {
    const { getByTestId } = getPermissionsPage();
    expect(getByTestId('permissions-page-heading').textContent).to.eq(
      'Permissions',
    );
  });

  it('renders buttons', () => {
    const { getByTestId } = getPermissionsPage();
    expect(getByTestId('permissions-page-add-button')).to.have.attribute(
      'text',
      'Add',
    );
    expect(getByTestId('permissions-page-upload-csv-button')).to.have.attribute(
      'text',
      'Upload CSV',
    );
  });
});
