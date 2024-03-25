import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
// Relative imports.
import Typeahead from './Typeahead';

describe('Search Dropdown Component <Typeahead/>', () => {
  it('renders what we expect', () => {
    const fetchSuggestions = sinon.spy();
    const wrapper = mount(
      <Typeahead
        submitButtonText="Search"
        className="dropdown"
        startingValue="Starting Value"
        fetchSuggestions={fetchSuggestions}
      />,
    );

    expect(fetchSuggestions.called).to.be.true;
    wrapper.unmount();
  });
});
