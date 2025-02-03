import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SuppliesUnavailable from '../../components/SuppliesUnavailable';

const supplyAccessory = {
  productName: 'Widget thing',
  deviceName: 'Widget consumer',
  productGroup: 'Accessory',
  productId: 6584,
  availableForReorder: false,
  lastOrderDate: '2022-05-16',
  nextAvailabilityDate: '2022-10-16',
  quantity: 5,
};

const setup = (props = {}) => render(<SuppliesUnavailable {...props} />);

describe('<SuppliesUnavailable />', () => {
  it('renders', () => {
    const { container } = setup({ supplies: [supplyAccessory] });
    expect(container).to.not.be.empty;
  });
});
