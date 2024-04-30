import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Typeahead from '.';

describe('Search Dropdown Component <Typeahead/>', () => {
  it('renders what we expect', () => {
    const wrapper = mount(
      <Typeahead
        submitButtonText="Search"
        className="dropdown"
        startingValue="Starting Value"
      />,
    );

    expect(wrapper.find('#search-results-page-dropdown-input-field').exists())
      .to.be.true;
    wrapper.unmount();
  });
});
