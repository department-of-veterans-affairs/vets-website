import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationPage from '../../../containers/ConfirmationPage';

describe('ConfirmationPage', () => {
  const subject = () => render(<ConfirmationPage />);

  it('renders the main heading', () => {
    const { container } = subject();

    const headingEl = container.querySelector('#heading');
    expect(headingEl).to.exist;
    expect(headingEl.textContent).to.equal('Discover Your Benefits');
  });

  it('displays default filter text on initial render', () => {
    const { container } = subject();

    const filterText = container.querySelector('#filter-text');
    expect(filterText).to.exist;
  });

  it('updates filter text after selecting "Housing" and clicking "Update Results"', () => {
    const { container } = subject();
    const filterSelect = container.querySelector('.filter-benefits');
    const updateButton = container.querySelector('#update-results');
    const filterText = container.querySelector('#filter-text');

    filterSelect.__events.vaSelect({ target: { value: 'Housing' } });
    fireEvent.click(updateButton);

    expect(filterText.textContent).to.equal(
      'Showing 2 results, filtered to show time-sensitive benefits, sorted alphabetically by benefit name.',
    );
  });

  it('updates sort text after selecting "Type" and clicking "Update Results"', () => {
    const { container } = subject();
    const sortSelect = container.querySelector('.sort-benefits');
    const updateButton = container.querySelector('#update-results');
    const filterText = container.querySelector('#filter-text');

    sortSelect.__events.vaSelect({ target: { value: 'category' } });
    fireEvent.click(updateButton);

    expect(filterText.textContent).to.equal(
      'Showing 21 results, filtered to show time-sensitive benefits, sorted alphabetically by benefit category.',
    );
  });
});
