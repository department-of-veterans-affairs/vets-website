import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ExpenseCardDetails from '../../../../components/complex-claims/pages/ExpenseCardDetails';

describe('ExpenseCardDetails', () => {
  const items = [
    { label: 'Address', value: '123 Main St, Apt 4B, Washington, DC 20001' },
    { label: 'Trip type', value: 'One way' },
  ];

  it('renders all labels and values', () => {
    const { getByText } = render(<ExpenseCardDetails items={items} />);

    items.forEach(item => {
      expect(getByText(item.label)).to.exist;
      expect(getByText(item.value)).to.exist;
    });
  });
});
