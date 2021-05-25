import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import KeywordSearch from '../../../components/search/KeywordSearch';

describe('<KeywordSearch>', () => {
  it.skip('should render', () => {
    const tree = mount(
      <KeywordSearch
        placeholder="test"
        location={{ query: 'test' }}
        autocomplete={{
          searchTerm: 'hello',
          suggestions: [{ a: 1 }, { b: 2 }],
        }}
        onClearAutocompleteSuggestions={() => {}}
        onFetchAutocompleteSuggestions={() => {}}
        onSelection={() => {}}
        onUpdateAutocompleteSearchTerm={() => {}}
      />,
    );

    const input = tree.find('input');
    expect(input.props().value).to.equal('hello');
    tree.unmount();
  });

  it.skip('should open suggestion list when input is filled with text', () => {
    const validateSearchQuery = sinon.spy();
    const tree = mount(
      <KeywordSearch
        placeholder="test"
        location={{ query: 'test' }}
        autocomplete={{
          searchTerm: '',
          suggestions: [{ label: 'item1' }, { label: 'item2' }],
        }}
        onChange={() => {}}
        onClearAutocompleteSuggestions={() => {}}
        onFetchAutocompleteSuggestions={() => {}}
        onSelection={() => {}}
        onUpdateAutocompleteSearchTerm={() => {}}
        validateSearchQuery={validateSearchQuery}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'item' } });
    const suggestionList = tree.find('.suggestions-list');
    expect(suggestionList.length).to.equal(1);
    const suggestions = tree.find('.suggestion');
    expect(suggestions.length).to.equal(2);
    tree.unmount();
  });

  it.skip('should call on select when an suggestion is selected', () => {
    const onSelection = sinon.spy();
    const validateSearchQuery = sinon.spy();
    const tree = mount(
      <KeywordSearch
        placeholder="test"
        location={{ query: 'test' }}
        autocomplete={{
          searchTerm: '',
          suggestions: [{ label: 'item1' }, { label: 'item2' }],
        }}
        onChange={() => {}}
        onClearAutocompleteSuggestions={() => {}}
        onFetchAutocompleteSuggestions={() => {}}
        onSelection={onSelection}
        onUpdateAutocompleteSearchTerm={() => {}}
        validateSearchQuery={validateSearchQuery}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'item' } });

    const suggestions = tree.find('.suggestion');
    suggestions.at(1).simulate('click');
    expect(onSelection.called).to.be.true;
    expect(onSelection.args[0]).to.deep.equal(['item2']);
    tree.unmount();
  });

  it.skip('should not call on select when a suggestion is not selected', () => {
    const onSelection = sinon.spy();
    const validateSearchQuery = sinon.spy();
    const tree = mount(
      <KeywordSearch
        placeholder="test"
        location={{ query: 'test' }}
        autocomplete={{
          searchTerm: '',
          suggestions: [{ label: 'item1' }, { label: 'item2' }],
        }}
        onChange={() => {}}
        onClearAutocompleteSuggestions={() => {}}
        onFetchAutocompleteSuggestions={() => {}}
        onSelection={onSelection}
        onUpdateAutocompleteSearchTerm={() => {}}
        validateSearchQuery={validateSearchQuery}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'item' } });

    expect(onSelection.called).to.be.false;
    tree.unmount();
  });
});
