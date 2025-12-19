import { expect } from 'chai';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import MedicationsListResultsAriaRegion from '../../../components/MedicationsList/MedicationsListResultsAriaRegion';
import {
  filterOptions,
  ACTIVE_FILTER_KEY,
  ALL_MEDICATIONS_FILTER_KEY,
  RENEWAL_FILTER_KEY,
  rxListSortingOptions,
} from '../../../util/constants';

describe('MedicationsListResultsAriaRegion component', () => {
  const setup = (props = {}) => {
    return render(<MedicationsListResultsAriaRegion {...props} />);
  };

  it('renders with correct aria attributes', () => {
    const screen = setup();
    const ariaLiveRegion = screen.getByTestId('filter-aria-live-region');
    expect(ariaLiveRegion).to.exist;
    expect(ariaLiveRegion.getAttribute('aria-atomic')).to.equal('true');
    expect(ariaLiveRegion.getAttribute('aria-live')).to.equal('polite');
    expect(ariaLiveRegion.classList.contains('sr-only')).to.be.true;
  });

  it('handles null values', () => {
    const screen = setup({
      filterOption: null,
      sortOption: null,
      resultsText: null,
    });
    const ariaLiveRegion = screen.getByTestId('filter-aria-live-region');
    expect(ariaLiveRegion.textContent).to.equal('');
  });

  it('handles undefined values', () => {
    const screen = setup({});
    const ariaLiveRegion = screen.getByTestId('filter-aria-live-region');
    expect(ariaLiveRegion.textContent).to.equal('');
  });

  it('updates text when filter is changed', async () => {
    const screen = setup();
    const ariaLiveRegion = screen.getByTestId('filter-aria-live-region');
    expect(ariaLiveRegion.textContent).to.equal('');

    screen.rerender(
      <MedicationsListResultsAriaRegion filterOption={RENEWAL_FILTER_KEY} />,
    );
    await waitFor(() => {
      expect(ariaLiveRegion.textContent).to.equal(
        `Filter applied: ${filterOptions[RENEWAL_FILTER_KEY].label}.`,
      );
    });

    screen.rerender(
      <MedicationsListResultsAriaRegion filterOption={ACTIVE_FILTER_KEY} />,
    );
    await waitFor(() => {
      expect(ariaLiveRegion.textContent).to.equal('Filter applied: Active.');
    });
  });

  it('updates text when filter is cleared', async () => {
    const screen = setup();
    const ariaLiveRegion = screen.getByTestId('filter-aria-live-region');
    expect(ariaLiveRegion.textContent).to.equal('');

    screen.rerender(
      <MedicationsListResultsAriaRegion filterOption={RENEWAL_FILTER_KEY} />,
    );
    await waitFor(() => {
      expect(ariaLiveRegion.textContent).to.equal(
        `Filter applied: ${filterOptions[RENEWAL_FILTER_KEY].label}.`,
      );
    });

    screen.rerender(
      <MedicationsListResultsAriaRegion
        filterOption={ALL_MEDICATIONS_FILTER_KEY}
      />,
    );
    screen.rerender(
      <MedicationsListResultsAriaRegion resultsText="Showing all medications." />,
    );
    await waitFor(() => {
      expect(ariaLiveRegion.textContent).to.equal(
        'Filters cleared. Showing all medications.',
      );
    });
  });

  it('updates text when sort option is changed', async () => {
    const screen = setup();
    const ariaLiveRegion = screen.getByTestId('filter-aria-live-region');
    expect(ariaLiveRegion.textContent).to.equal('');

    screen.rerender(
      <MedicationsListResultsAriaRegion sortOption="alphabeticallyByStatus" />,
    );
    await waitFor(() => {
      expect(ariaLiveRegion.textContent).to.equal(
        `Sorting: ${rxListSortingOptions.alphabeticallyByStatus.LABEL}.`,
      );
    });

    screen.rerender(
      <MedicationsListResultsAriaRegion sortOption="lastFilledFirst" />,
    );
    await waitFor(() => {
      expect(ariaLiveRegion.textContent).to.equal(
        `Sorting: ${rxListSortingOptions.lastFilledFirst.LABEL}.`,
      );
    });
  });

  it('updates text when resultsText is changed', async () => {
    const screen = setup();
    const ariaLiveRegion = screen.getByTestId('filter-aria-live-region');
    expect(ariaLiveRegion.textContent).to.equal('');

    screen.rerender(
      <MedicationsListResultsAriaRegion resultsText="Showing 1 - 10 of 25 medications" />,
    );
    await waitFor(() => {
      expect(ariaLiveRegion.textContent).to.equal(
        'Showing 1 - 10 of 25 medications',
      );
    });

    screen.rerender(
      <MedicationsListResultsAriaRegion resultsText="Showing 11 - 20 of 25 medications" />,
    );
    await waitFor(() => {
      expect(ariaLiveRegion.textContent).to.equal(
        'Showing 11 - 20 of 25 medications',
      );
    });
  });
});
