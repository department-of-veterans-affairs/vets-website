import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import KeywordSearch from '../../components/search/KeywordSearch';

describe('<KeywordSearch>', () => {
  it('should render', () => {
    const tree = mount(
      <KeywordSearch
        label="test"
        location={{ query: 'test' }}
        autocomplete={{
          searchTerm: 'hello',
          suggestions: [{ a: 1 }, { b: 2 }],
        }}
        onClearAutocompleteSuggestions={() => {}}
        onFetchAutocompleteSuggestions={() => {}}
        onFilterChange={() => {}}
        onUpdateAutocompleteSearchTerm={() => {}}
      />,
    );

    const input = tree.find('input');
    expect(input.props().value).to.equal('hello');
  });

  it('should open suggestion list when input is filled with text', () => {
    const onChange = sinon.spy();
    const tree = mount(
      <KeywordSearch
        label="test"
        location={{ query: 'test' }}
        autocomplete={{
          searchTerm: '',
          suggestions: [{ label: 'item1' }, { label: 'item2' }],
        }}
        onChange={onChange}
        onClearAutocompleteSuggestions={() => {}}
        onFetchAutocompleteSuggestions={() => {}}
        onFilterChange={() => {}}
        onUpdateAutocompleteSearchTerm={() => {}}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'item' } });
    const suggestionList = tree.find('.suggestions-list');
    expect(suggestionList.length).to.equal(1);
    const suggestions = tree.find('.suggestion');
    expect(suggestions.length).to.equal(2);
  });

  it('should call on select when an suggestion is selected', () => {
    const onChange = sinon.spy();
    const onFilterChange = sinon.spy();
    const tree = mount(
      <KeywordSearch
        label="test"
        location={{ query: 'test' }}
        autocomplete={{
          searchTerm: '',
          suggestions: [{ label: 'item1' }, { label: 'item2' }],
        }}
        onChange={onChange}
        onClearAutocompleteSuggestions={() => {}}
        onFetchAutocompleteSuggestions={() => {}}
        onFilterChange={onFilterChange}
        onUpdateAutocompleteSearchTerm={() => {}}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'item' } });

    const suggestions = tree.find('.suggestion');
    suggestions.at(1).simulate('click');
    expect(onFilterChange.called).to.be.true;
    expect(onFilterChange.args[0]).to.deep.equal(['name', 'item2']);
  });
});
