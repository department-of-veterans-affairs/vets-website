import React from 'react';
import { render } from '@testing-library/react';
import AuthorityField from '../../components/AuthorityField';

describe('AuthorityField', () => {
  it('should render', () => {
    const formData = {
      name: 'Test authority',
      address: {
        addressLine1: '123 Main St.',
        addressLine2: 'Ste 3',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'USA',
      },
    };

    const tree = render(<AuthorityField formData={formData} />);

    // look for substring/ignore whitespace
    tree.getByText(formData.name, { exact: false });
    tree.getByText(formData.address.addressLine1, { exact: false });
    tree.getByText(formData.address.addressLine2, { exact: false });
    tree.getByText(formData.address.city, { exact: false });
    tree.getByText(formData.address.state, { exact: false });
    tree.getByText(formData.address.postalCode, { exact: false });
    tree.getByText(formData.address.country, { exact: false });
  });
});
