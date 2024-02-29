import { render, within } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import PermissionsPage from '../../containers/PermissionsPage.jsx';

describe('Permissions page', () => {
  it('renders', () => {
    const container = render(<PermissionsPage />);

    const header = container.querySelector('h1');
    expect(within(header).getByText('Permissions')).to.exist;

    expect(container.getByText('Add')).to.exist;
    expect(container.getByText('Upload CSV')).to.exist;
  });

  it('renders breadcrumbs', () => {
    const { container } = render(<PermissionsPage />);

    const breadcrumbs = container.querySelector('va-breadcrumbs');
    expect(within(breadcrumbs).getByText('Home')).to.exist;
  });
});
