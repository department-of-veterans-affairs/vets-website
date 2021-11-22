import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import KeywordSearch from '../../../components/search/KeywordSearch';

describe('<KeywordSearch>', () => {
  it('should render', () => {
    const tree = mount(
      <KeywordSearch
        inputValue="hello"
        location={{ query: 'test' }}
        suggestions={[{ label: 1 }, { label: 2 }]}
        onFetchAutocompleteSuggestions={() => {}}
        onSelection={() => {}}
        onUpdateAutocompleteSearchTerm={() => {}}
      />,
    );

    const input = tree.find('input');
    expect(input.props().value).to.equal('hello');
    tree.unmount();
  });

  it('should open suggestion list when input is filled with text', () => {
    const tree = mount(
      <KeywordSearch
        inputValue="test"
        location={{ query: 'test' }}
        suggestions={[{ label: 'item1' }, { label: 'item2' }]}
        onChange={() => {}}
        onFetchAutocompleteSuggestions={() => {}}
        onSelection={() => {}}
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
    tree.unmount();
  });

  it('should call on select when an suggestion is selected', () => {
    const onSelection = sinon.spy();
    const suggestions = [{ label: 'item1' }, { label: 'item2' }];
    const tree = mount(
      <KeywordSearch
        location={{ query: 'test' }}
        suggestions={suggestions}
        onChange={() => {}}
        onFetchAutocompleteSuggestions={() => {}}
        onSelection={onSelection}
        onUpdateAutocompleteSearchTerm={() => {}}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'item' } });

    const items = tree.find('.suggestion');
    items.at(1).simulate('click');
    expect(onSelection.called).to.be.true;
    expect(onSelection.args[0]).to.deep.equal([suggestions[1]]);
    tree.unmount();
  });

  it('should not call on select when a suggestion is not selected', () => {
    const onSelection = sinon.spy();
    const tree = mount(
      <KeywordSearch
        location={{ query: 'test' }}
        suggestions={[{ label: 'item1' }, { label: 'item2' }]}
        onChange={() => {}}
        onFetchAutocompleteSuggestions={() => {}}
        onSelection={onSelection}
        onUpdateAutocompleteSearchTerm={() => {}}
      />,
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'item' } });

    expect(onSelection.called).to.be.false;
    tree.unmount();
  });
});
