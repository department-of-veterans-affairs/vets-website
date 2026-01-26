import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import FilterSummary from '../../../components/dashboard/FilterSummary';

describe('FilterSummary', () => {
  it('renders correct sentence when unfiltered', () => {
    const sentence =
      'Showing 1-5 of 5 results for "All" statuses and "All" categories';
    const view = render(
      <FilterSummary
        categoryFilter="All"
        statusFilter="All"
        total={5}
        pageStart={1}
        pageEnd={5}
      />,
    );
    const heading = view.getByRole('heading', { level: 3, name: /showing/i });
    expect(heading.textContent).to.equal(sentence);
  });

  it('renders correct sentence when filtered', () => {
    const sentence =
      'Showing no results for "Replied" status and "Heath care" category';
    const view = render(
      <FilterSummary
        categoryFilter="Heath care"
        statusFilter="Replied"
        total={undefined}
        pageStart={undefined}
        pageEnd={0}
      />,
    );
    const heading = view.getByRole('heading', { level: 3, name: /showing/i });
    expect(heading.textContent).to.equal(sentence);
  });

  it('renders correct sentence with tabs', () => {
    const sentence =
      'Showing 1-5 of 5 results for "All" statuses and "All" categories in "Business"';
    const view = render(
      <FilterSummary
        categoryFilter="All"
        statusFilter="All"
        total={5}
        pageStart={1}
        pageEnd={5}
        tabName="Business"
      />,
    );
    const heading = view.getByRole('heading', {
      level: 3,
      name: /showing/i,
    });
    expect(heading.textContent).to.equal(sentence);
  });
});
