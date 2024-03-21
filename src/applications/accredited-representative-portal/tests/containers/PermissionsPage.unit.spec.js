import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import PermissionsPage from '../../containers/PermissionsPage';

describe('Permissions Page', () => {
  it('renders Permissions Page', () => {
    const { getByTestId } = render(<PermissionsPage />);

    expect(getByTestId('permissions-heading').textContent).to.equal(
      'Permissions',
    );
    expect(
      getByTestId('permissions-add-button').to.have.attribute('text', 'Add'),
    );
    expect(
      getByTestId('permissions-upload-csv-button').to.have.attribute(
        'text',
        'Upload CSV',
      ),
    );
  });
});
