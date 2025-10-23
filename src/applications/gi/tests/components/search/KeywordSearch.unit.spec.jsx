import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import createCommonStore from 'platform/startup/store';
import { Provider } from 'react-redux';
import reducer from '../../../reducers';
import KeywordSearch from '../../../components/search/KeywordSearch';

const commonStore = createCommonStore(reducer);

describe('<KeywordSearch>', () => {
  it('should render', () => {
    const tree = mount(
      <Provider store={commonStore}>
        <KeywordSearch
          inputValue="hello"
          location={{ query: 'test' }}
          suggestions={[{ label: 1 }, { label: 2 }]}
          onFetchAutocompleteSuggestions={() => {}}
          onSelection={() => {}}
          onUpdateAutocompleteSearchTerm={() => {}}
        />
        ,
      </Provider>,
    );

    const input = tree.find('input');
    expect(input.props().value).to.equal('hello');
    tree.unmount();
  });

  it('should open suggestion list when input is filled with text', () => {
    const tree = mount(
      <Provider store={commonStore}>
        <KeywordSearch
          inputValue="test"
          location={{ query: 'test' }}
          suggestions={[{ label: 'item1' }, { label: 'item2' }]}
          onChange={() => {}}
          onFetchAutocompleteSuggestions={() => {}}
          onSelection={() => {}}
          onUpdateAutocompleteSearchTerm={() => {}}
        />
        ,
      </Provider>,
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
      <Provider store={commonStore}>
        <KeywordSearch
          location={{ query: 'test' }}
          suggestions={suggestions}
          onChange={() => {}}
          onFetchAutocompleteSuggestions={() => {}}
          onSelection={onSelection}
          onUpdateAutocompleteSearchTerm={() => {}}
        />
        ,
      </Provider>,
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
      <Provider store={commonStore}>
        <KeywordSearch
          location={{ query: 'test' }}
          suggestions={[{ label: 'item1' }, { label: 'item2' }]}
          onChange={() => {}}
          onFetchAutocompleteSuggestions={() => {}}
          onSelection={onSelection}
          onUpdateAutocompleteSearchTerm={() => {}}
        />
        ,
      </Provider>,
    );

    const input = tree.find('input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'item' } });

    expect(onSelection.called).to.be.false;
    tree.unmount();
  });
  it('should call onPressEnter if it exists', () => {
    const onPressEnter = sinon.spy();
    const wrapper = mount(
      <Provider store={commonStore}>
        <KeywordSearch onPressEnter={onPressEnter} inputValue="test" />,
      </Provider>,
    );
    wrapper.find('input').simulate('keyup', { which: 13, keyCode: 13 });
    expect(onPressEnter.calledOnce).to.be.true;
    wrapper.unmount();
  });
  it('should call onSelection with inputValue if onPressEnter is not provided', () => {
    const onSelection = sinon.spy();
    const inputValue = 'test';
    const wrapper = mount(
      <Provider store={commonStore}>
        <KeywordSearch onSelection={onSelection} inputValue={inputValue} />,
      </Provider>,
    );
    wrapper.find('input').simulate('keyup', { which: 13, keyCode: 13 });
    expect(onSelection.calledOnce).to.be.true;
    wrapper.unmount();
  });
  it('should show required error if required and no inputValue', () => {
    const wrapper = mount(
      <Provider store={commonStore}>
        <KeywordSearch label required />
      </Provider>,
    );
    expect(wrapper.find('span.form-required-span').text()).to.equal(
      '(*Required)',
    );
    wrapper.unmount();
  });
  it('itemToString function returns correct value', () => {
    const wrapper = mount(
      <Provider store={commonStore}>
        <KeywordSearch label required />
      </Provider>,
    );
    const item = 'testItem';
    const result = wrapper.find('Downshift').prop('itemToString')(item);
    expect(result).to.equal(item);
    wrapper.unmount();
  });
  it('handles Enter key press correctly', () => {
    const mockOnPressEnter = sinon.spy();
    const mockOnUpdateAutocompleteSearchTerm = sinon.spy();
    const wrapper = mount(
      <Provider store={commonStore}>
        <KeywordSearch
          onPressEnter={mockOnPressEnter}
          onUpdateAutocompleteSearchTerm={mockOnUpdateAutocompleteSearchTerm}
          onSelection={() => {}}
          inputValue="test"
        />
        ,
      </Provider>,
    );
    const event = { keyCode: 13 };
    wrapper.find('input').simulate('keyUp', event);
    expect(mockOnPressEnter.calledOnce).to.be.true;
    wrapper.unmount();
  });
});
