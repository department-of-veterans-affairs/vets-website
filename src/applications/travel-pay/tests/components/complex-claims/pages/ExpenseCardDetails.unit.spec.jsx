import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ExpenseCardDetails from '../../../../components/complex-claims/pages/ExpenseCardDetails';

describe('ExpenseCardDetails', () => {
  const items = [
    { label: 'Address', value: '123 Main St, Apt 4B, Washington, DC 20001' },
    { label: 'Trip type', value: 'One way' },
  ];

  it('renders all labels and values when values are present', () => {
    const { getByText } = render(<ExpenseCardDetails items={items} />);

    items.forEach(item => {
      expect(getByText(item.label)).to.exist;
      expect(getByText(item.value)).to.exist;
    });
  });

  it('does not render items with null, undefined, or empty values', () => {
    const testItems = [
      { label: 'Address', value: '123 Main St' },
      { label: 'Trip type', value: null },
      { label: 'Notes', value: undefined },
      { label: 'Extra', value: '' },
    ];

    const { queryByText } = render(<ExpenseCardDetails items={testItems} />);

    // Only "Address" should render
    expect(queryByText('Address')).to.exist;
    expect(queryByText('123 Main St')).to.exist;

    expect(queryByText('Trip type')).to.be.null;
    expect(queryByText('Notes')).to.be.null;
    expect(queryByText('Extra')).to.be.null;
  });

  it('renders correctly when all values are empty', () => {
    const emptyItems = [
      { label: 'Label1', value: null },
      { label: 'Label2', value: undefined },
      { label: 'Label3', value: '' },
    ];

    const { container } = render(<ExpenseCardDetails items={emptyItems} />);
    expect(container.textContent).to.equal('');
  });
});
