import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import PermissionsPage from '../../containers/PermissionsPage.jsx';

describe('Permissions page', () => {
  it('renders', () => {
    const container = render(<PermissionsPage />);

    expect(container.getByRole('heading', { name: 'Permissions' })).to.exist;

    expect(container.getByTestId('permissions-add-button')).to.exist;
    expect(container.getByTestId('permissions-upload-csv-button')).to.exist;
  });
});
