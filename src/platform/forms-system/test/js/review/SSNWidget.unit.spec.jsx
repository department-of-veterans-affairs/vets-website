import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import SSNWidget from '../../../src/js/review/SSNWidget';

describe('Schemaform review <SSNWidget>', () => {
  it('should format ssn', () => {
    const { container } = render(<SSNWidget value="123456789" />);

    expect(container.textContent).to.equal('●●●-●●-6789ending with 6 7 8 9');
  });
  it('should render empty value', () => {
    const { container } = render(<SSNWidget />);

    // The only time it will equal '' is when initializing it with value=''
    expect(container.textContent).to.equal('');
  });
});
