import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import Typeahead from '.';

describe('Typeahead', () => {
  it('renders what we expect', () => {
    const fetchSuggestions = sinon.spy();
    const wrapper = mount(
      <Typeahead
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
