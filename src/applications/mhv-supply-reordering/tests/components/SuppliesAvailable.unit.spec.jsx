import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SuppliesAvailable from '../../components/SuppliesAvailable';

const supplies = [
  { productId: '1', productName: 'Product #1' },
  { productId: '2', productName: 'Product #2' },
];

const setup = (props = {}) => render(<SuppliesAvailable {...props} />);

describe('<SuppliesAvailable />', () => {
  it('renders', () => {
    const { container } = setup({ supplies });
    expect(container).to.not.be.empty;
  });
});
