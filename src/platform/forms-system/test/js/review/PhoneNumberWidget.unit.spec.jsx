import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PhoneNumberWidget from '../../../src/js/review/PhoneNumberWidget';

describe('Schemaform review <PhoneNumberWidget>', () => {
  it('should format phone number', () => {
    const { container } = render(<PhoneNumberWidget value="1234567890" />);
    expect(container.innerHTML).to.contain(
      'va-telephone contact="1234567890" not-clickable',
    );
  });

  it('should render empty value', () => {
    const { container } = render(<PhoneNumberWidget />);
    expect(container.textContent).to.equal('');
  });
});
