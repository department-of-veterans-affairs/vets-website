import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Help from '../../components/Help';

describe('<SuppliesAvailable />', () => {
  it('renders', () => {
    const { container } = render(<Help />);
    expect(container.textContent).to.contain('Denver Logistics Center');
  });
});
