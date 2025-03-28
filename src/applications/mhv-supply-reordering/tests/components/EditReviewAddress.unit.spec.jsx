import React from 'react';
import { render } from '@testing-library/react';

import EditReviewAddress from '../../components/EditReviewAddress';

const title = 'Shipping address';
const defaultEditButton = () => {};
const formData = {
  permanentAddress: {
    'view:militaryBaseDescription': {},
    country: 'USA',
    street: '101 EXAMPLE STREET',
    street2: 'APT 2',
    city: 'KANSAS CITY',
    state: 'MO',
    postalCode: '64117',
  },
};
const setup = () => {
  return render(
    <div>
      <EditReviewAddress
        formData={formData}
        title={title}
        defaultEditButton={defaultEditButton}
      />
    </div>,
  );
};

describe('EditReviewAddress', () => {
  it('renders', () => {
    const { getByRole, getByText } = setup();
    getByRole('heading', { level: 4, name: title });
    getByText(/101 EXAMPLE STREET/);
    getByText(/APT 2/);
    getByText(/KANSAS CITY, MO 64117/);
  });
});
