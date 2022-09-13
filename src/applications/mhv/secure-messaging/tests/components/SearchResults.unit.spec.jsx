import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SearchResults from '../../components/SearchResults';

describe('SearchResults component', () => {
  it('should not be empty', () => {
    const { container } = render(<SearchResults />);
    const searchResults = container.querySelector('.search-results');
    expect(searchResults).not.to.be.empty;
  });

  it('should contain one va-select element', () => {
    const { container } = render(<SearchResults advancedSearchOpen />);
    const vaSelect = container.querySelectorAll('va-select');
    expect(vaSelect.length).to.equal(1);
  });

  it('should contain one search-results-list element', () => {
    const { container } = render(<SearchResults />);
    const vaSearchInputs = container.querySelectorAll('.search-results-list');
    expect(vaSearchInputs.length).to.equal(1);
  });
});
