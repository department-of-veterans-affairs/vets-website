import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Contact from './Contact';

const initialProps = {
  contactType: 'Primary Next of Kin',
  prefix: 'Mrs.',
  givenName: 'Rachel',
  middleName: 'Walker',
  familyName: 'Revere',
  addressLine1: '19 N Square',
  city: 'Boston',
  state: 'MA',
  zipCode: '02113',
  primaryPhone: '617-555-1111',
};

const setup = (props = {}) => render(<Contact {...initialProps} {...props} />);

describe('Contact Component', () => {
  it('renders', () => {
    const { container } = setup();
    expect(container.textContent).to.contain('Mrs. Rachel Walker Revere');
    expect(container.textContent).to.contain('19 N Square');
    expect(container.textContent).to.contain('Boston, MA 02113');
    expect(container.textContent).to.contain('617-555-1111');
  });

  it('renders name and phone number if addressLine1 is not present', () => {
    const { container } = setup({ addressLine1: '' });
    expect(container.textContent).to.contain('Mrs. Rachel Walker Revere');
    expect(container.textContent).to.contain('617-555-1111');
    expect(container.textContent).not.to.contain('Boston, MA 02113');
  });

  it('renders name and phone number when contactType is an emergency contact', () => {
    const { container } = setup({ contactType: 'Emergency Contact' });
    expect(container.textContent).to.contain('Mrs. Rachel Walker Revere');
    expect(container.textContent).to.contain('617-555-1111');
    expect(container.textContent).not.to.contain('Boston, MA 02113');
  });
});
