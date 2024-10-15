import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
// Relative imports.
import SearchDropdownComponent from './SearchDropdownComponent';

describe('Search Dropdown Component <SearchDropdownComponent/>', () => {
  it('renders what we expect', () => {
    const fetchSuggestions = sinon.spy();
    const wrapper = mount(
      <SearchDropdownComponent
        buttonText="Search"
        className="dropdown"
        startingValue="Starting Value"
        fetchSuggestions={fetchSuggestions}
      />,
    );

    expect(fetchSuggestions.called).to.be.true;
    wrapper.unmount();
  });
});
