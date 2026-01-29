import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import VAPharmacyText from '../../../components/shared/VaPharmacyText';

const setup = phone => render(<VAPharmacyText phone={phone} />);

describe('VAPharmacyText', () => {
  it('should include not render telephone if no number is provided', () => {
    const { container } = setup();
    const telephone = container.querySelector('va-telephone');
    expect(telephone).to.not.exist;
  });

  it('should include a va-telephone element with the correct phone number', () => {
    const { container } = setup('555-111-5555');
    const telephone = container.querySelector('va-telephone');
    expect(telephone).to.have.attr('contact', '555-111-5555');
  });
});
