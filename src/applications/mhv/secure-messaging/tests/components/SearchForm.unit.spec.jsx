import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SearchForm from '../../components/SearchForm';

describe('SearchForm component', () => {
  it('should not be empty', () => {
    const { container } = render(<SearchForm />);
    const searchForm = container.querySelector('.search-form');
    expect(searchForm).not.to.be.empty;
  });

  it('should contain one va-text-input element', () => {
    const { container } = render(<SearchForm />);
    const vaTextInputs = container.querySelectorAll('va-text-input');
    expect(vaTextInputs.length).to.equal(1);
  });

  it('should contain four va-text-input elements when advanced search is open', () => {
    const { container } = render(<SearchForm advancedSearchOpen />);
    const vaTextInputs = container.querySelectorAll('va-text-input');
    expect(vaTextInputs.length).to.equal(4);
  });
});
