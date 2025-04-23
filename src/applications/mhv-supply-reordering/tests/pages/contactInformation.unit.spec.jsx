import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Description } from '../../pages/contactInformation';

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
  emailAddress: 'vets.gov.user+1@gmail.com',
};

const setup = () => {
  return render(<Description formData={formData} />);
};

describe('contactInformation', () => {
  it('renders Description', () => {
    const { container } = setup();
    expect(container).to.exist;
  });
});
