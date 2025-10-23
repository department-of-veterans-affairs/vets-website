import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { SearchResultsHeader } from '../../components/SearchResultsHeader';

describe('SearchResultsHeader Component', () => {
  it('displays no results message', () => {
    const { container } = render(
      <SearchResultsHeader query="Bob" resultCount={0} inProgress={false} />,
    );

    const searchHeader = container.querySelector('.search-header');
    expect(searchHeader).to.exist;
    expect(searchHeader.textContent).to.contain('No results found for "Bob".');
  });

  it('displays one result', () => {
    const { container } = render(
      <SearchResultsHeader query="Bob" resultCount={1} inProgress={false} />,
    );

    const searchHeader = container.querySelector('.search-header');
    expect(searchHeader).to.exist;
    expect(searchHeader.textContent).to.contain('Showing 1 result for "Bob"');
  });
  it('displays multiple results', () => {
    const { container } = render(
      <SearchResultsHeader query="Bob" resultCount={5} inProgress={false} />,
    );

    const searchHeader = container.querySelector('.search-header');
    expect(searchHeader).to.exist;
    expect(searchHeader.textContent).to.contain('Showing 5 results for "Bob"');
  });

  it('does not display when loading in progress', () => {
    const { container } = render(
      <SearchResultsHeader query="Bob" resultCount={5} inProgress />,
    );

    const searchHeader = container.querySelector('.search-header');
    expect(searchHeader).not.to.exist;
  });
});
