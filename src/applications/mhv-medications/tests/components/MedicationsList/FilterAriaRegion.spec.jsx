import { expect } from 'chai';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import FilterAriaRegion from '../../../components/MedicationsList/FilterAriaRegion';
import {
  filterOptions,
  ALL_MEDICATIONS_FILTER_KEY,
  RENEWAL_FILTER_KEY,
} from '../../../util/constants';

describe('FilterAriaRegion component', () => {
  const setup = filterOption => {
    return render(<FilterAriaRegion filterOption={filterOption} />);
  };

  it('renders with correct aria attributes', () => {
    const screen = setup();
    const ariaLiveRegion = screen.getByTestId('filter-aria-live-region');
    expect(ariaLiveRegion).to.exist;
    expect(ariaLiveRegion.getAttribute('aria-atomic')).to.equal('true');
    expect(ariaLiveRegion.getAttribute('aria-live')).to.equal('polite');
    expect(ariaLiveRegion.classList.contains('sr-only')).to.be.true;
  });

  it('handles null value', () => {
    const screen = setup(null);
    const ariaLiveRegion = screen.getByTestId('filter-aria-live-region');
    expect(ariaLiveRegion.textContent).to.equal('');
  });

  it('handles undefined value', () => {
    const screen = setup(null);
    const ariaLiveRegion = screen.getByTestId('filter-aria-live-region');
    expect(ariaLiveRegion.textContent).to.equal('');
  });

  it('updates text when filter is changed', async () => {
    const screen = setup();
    const ariaLiveRegion = screen.getByTestId('filter-aria-live-region');
    expect(ariaLiveRegion.textContent).to.equal('');

    screen.rerender(<FilterAriaRegion filterOption={RENEWAL_FILTER_KEY} />);
    await waitFor(() => {
      expect(ariaLiveRegion.textContent).to.equal(
        `Filter applied: ${filterOptions[RENEWAL_FILTER_KEY].label}.`,
      );
    });

    screen.rerender(
      <FilterAriaRegion filterOption={ALL_MEDICATIONS_FILTER_KEY} />,
    );
    await waitFor(() => {
      expect(ariaLiveRegion.textContent).to.equal(
        'Filters cleared. Showing all medications.',
      );
    });
  });
});
