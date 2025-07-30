import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import VAFileNumberWidget from '../../../src/js/review/VAFileNumberWidget';

describe('Schemaform review <VAFileNumberWidget>', () => {
  it('should format ssn when 9 characters', () => {
    const { container } = render(<VAFileNumberWidget value="123456789" />);

    expect(container.textContent).to.equal('●●●-●●-6789ending with 6 7 8 9');
  });

  it('should not format when 8 characters', () => {
    const { container } = render(<VAFileNumberWidget value="12345678" />);

    expect(container.textContent).to.equal('12345678');
  });

  it('should render empty value', () => {
    const { container } = render(<VAFileNumberWidget />);

    // The only time it will equal '' is when initializing it with value=''
    expect(container.textContent).to.equal('');
  });
});
