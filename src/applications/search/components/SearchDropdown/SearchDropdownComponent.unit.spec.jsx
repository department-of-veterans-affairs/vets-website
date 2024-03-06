import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import SearchDropdownComponent from './SearchDropdownComponent';

describe('Search Dropdown Component <SearchDropdownComponent/>', () => {
  it('renders what we expect', () => {
    const fetchSuggestions = sinon.spy();
    render(
      <SearchDropdownComponent
        buttonText="Search"
        className="dropdown"
        startingValue="Starting Value"
        fetchSuggestions={fetchSuggestions}
      />,
    );

    expect(fetchSuggestions.called).to.be.true;
  });
});
