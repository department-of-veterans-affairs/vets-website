import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import SearchDescription from '../../../components/inbox/SearchDescription';

describe('SearchDescription', () => {
  it('renders correct sentence with default settings', () => {
    const sentence =
      'Showing 1-5 of 5 results with the status set to "All" and the category set to "All."';
    const view = render(
      <SearchDescription
        categoryFilter="All"
        statusFilter="All"
        total={5}
        pageStart={1}
        pageEnd={5}
      />,
    );
    const heading = view.getByRole('heading', { level: 3, name: /showing/i });
    expect(heading.textContent).to.equal(sentence);

    expect(view.queryByTestId('no-results-suggestion')).to.not.exist;
  });

  it('renders correct sentence with no results', () => {
    const sentence =
      'Showing no results with the status set to "All" and the category set to "All."Search 1 of these 3 things to get more results:Reference numberCategory nameOriginal question';
    const view = render(
      <SearchDescription
        categoryFilter="All"
        statusFilter="All"
        total={0}
        pageStart={undefined}
        pageEnd={0}
      />,
    );
    const heading = view.getByRole('heading', { level: 3, name: /showing/i });
    expect(view.queryByTestId('no-results-suggestion')).to.exist;
    expect(heading.parentElement.textContent).to.equal(sentence);
  });

  it('renders correct sentence with filters', () => {
    const sentence =
      'Showing 5-8 of 10 results with the status set to "Replied" and the category set to "Heath care."';
    const view = render(
      <SearchDescription
        categoryFilter="Heath care"
        statusFilter="Replied"
        total={10}
        pageStart={5}
        pageEnd={8}
      />,
    );
    const heading = view.getByRole('heading', { level: 3, name: /showing/i });
    expect(heading.textContent).to.equal(sentence);
  });

  it('renders correct sentence with search', () => {
    const sentence =
      'Showing 1-4 of 5 results for "last week" with the status set to "All" and the category set to "All."';
    const view = render(
      <SearchDescription
        categoryFilter="All"
        statusFilter="All"
        total={5}
        pageStart={1}
        pageEnd={4}
        query="last week"
      />,
    );
    const heading = view.getByRole('heading', { level: 3, name: /showing/i });
    expect(heading.textContent).to.equal(sentence);
  });

  it('renders correct sentence with tabs', () => {
    const sentence =
      'Showing 1-5 of 5 results with the status set to "All" and the category set to "All" in "Business."';
    const view = render(
      <SearchDescription
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
