import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ARNWidget from '../../../src/js/review/ARNWidget';

describe('Schemaform review <ARNWidget>', () => {
  it('should format a 7-digit Alien registration number', () => {
    const { container } = render(<ARNWidget value="1234567" />);

    expect(container.textContent).to.equal('123-456-7');
  });
  it('should format a 9-digit Alien registration number', () => {
    const { container } = render(<ARNWidget value="123456789" />);

    expect(container.textContent).to.equal('123-456-789');
  });
  it('should render empty value', () => {
    const { container } = render(<ARNWidget />);

    // The only time it will equal '' is when initializing it with value=''
    expect(container.textContent).to.equal('');
  });
});
