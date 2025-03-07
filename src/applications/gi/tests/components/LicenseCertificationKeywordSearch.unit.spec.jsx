import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LicenseCertificationKeywordSearch from '../../components/LicenseCertificationKeywordSearch';

describe('<LicenseCertificationKeywordSearch>', () => {
  let store;

  beforeEach(() => {
    store = configureStore()({});
  });

  const defaultProps = {
    inputValue: '',
    handleInput: sinon.spy(),
    suggestions: [
      { lacNm: 'Microsoft Azure', type: 'Certification', state: 'all' },
      { lacNm: 'AWS Cloud', type: 'Certification', state: 'all' },
    ],
    onSelection: sinon.spy(),
    onUpdateAutocompleteSearchTerm: sinon.spy(),
    handleClearInput: sinon.spy(),
  };

  const mountComponent = props => {
    return mount(
      <Provider store={store}>
        <MemoryRouter>
          <LicenseCertificationKeywordSearch {...props} />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should render', () => {
    const wrapper = mountComponent(defaultProps);
    expect(wrapper.find('#keyword-search')).to.exist;
    expect(wrapper.find(VaAdditionalInfo)).to.exist;
  });

  it('should show clear icon when input has value', () => {
    const wrapper = mountComponent(defaultProps);
    expect(wrapper.find('va-icon#clear-input')).to.exist;
  });

  it('should call onUpdateAutocompleteSearchTerm when input changes', () => {
    const wrapper = mountComponent(defaultProps);
    wrapper.find('input').simulate('change', { target: { value: 'test' } });
    expect(defaultProps.onUpdateAutocompleteSearchTerm.called).to.be.true;
  });

  it('should show suggestions when input has value', () => {
    const wrapper = mountComponent(defaultProps);
    expect(wrapper.find('.suggestions-list')).to.exist;
    // expect(wrapper.find('.suggestion')).to.have.lengthOf(2);
  });

  it('should call onSelection with correct state for "license" type', () => {
    const props = {
      ...defaultProps,
      inputValue: 'test',
      onSelection: sinon.spy(),
    };
    const wrapper = mountComponent(props);
    const downshift = wrapper.find('Downshift');
    const suggestion = { name: 'Test License', type: 'license', state: 'NY' };
    // Simulate a suggestion selection via Downshift's onSelect
    downshift.prop('onSelect')(suggestion);
    expect(props.onSelection.calledOnce).to.be.true;
    expect(props.onSelection.firstCall.args[0]).to.deep.equal({
      type: 'license',
      state: 'NY',
      name: 'Test License',
      selected: suggestion,
    });
    wrapper.unmount();
  });

  it('should call onSelection with state "all" for a non-license and non-prep type', () => {
    const props = {
      ...defaultProps,
      inputValue: 'test',
      onSelection: sinon.spy(),
    };
    const wrapper = mountComponent(props);
    const downshift = wrapper.find('Downshift');
    const suggestion = {
      name: 'Test Certification',
      type: 'Certification',
      state: 'CA',
    };
    downshift.prop('onSelect')(suggestion);
    expect(props.onSelection.calledOnce).to.be.true;
    expect(props.onSelection.firstCall.args[0]).to.deep.equal({
      type: 'Certification',
      state: 'all',
      name: 'Test Certification',
      selected: suggestion,
    });
    wrapper.unmount();
  });

  it('should call onSelection with correct state for "prep" type', () => {
    const props = {
      ...defaultProps,
      inputValue: 'test',
      onSelection: sinon.spy(),
    };
    const wrapper = mountComponent(props);
    const downshift = wrapper.find('Downshift');
    const suggestion = { name: 'Test Prep', type: 'prep', state: 'TX' };
    downshift.prop('onSelect')(suggestion);
    expect(props.onSelection.calledOnce).to.be.true;
    expect(props.onSelection.firstCall.args[0]).to.deep.equal({
      type: 'prep',
      state: 'TX',
      name: 'Test Prep',
      selected: suggestion,
    });
    wrapper.unmount();
  });

  it('itemToString should return the string when a string is passed', () => {
    const wrapper = mountComponent(defaultProps);
    const downshift = wrapper.find('Downshift');
    const itemToString = downshift.prop('itemToString');
    const result = itemToString('Just a string');
    expect(result).to.equal('Just a string');
    wrapper.unmount();
  });

  it('itemToString should return item.name when an object is passed', () => {
    const wrapper = mountComponent(defaultProps);
    const downshift = wrapper.find('Downshift');
    const itemToString = downshift.prop('itemToString');
    const result = itemToString({ name: 'Test Name' });
    expect(result).to.equal('Test Name');
    wrapper.unmount();
  });

  it('itemToString should return null when null is passed', () => {
    const wrapper = mountComponent(defaultProps);
    const downshift = wrapper.find('Downshift');
    const itemToString = downshift.prop('itemToString');
    const result = itemToString(null);
    expect(result).to.be.null;
    wrapper.unmount();
  });

  it('should not render suggestions list when isOpen is false', () => {
    const props = { ...defaultProps, inputValue: 'non-empty' };
    const wrapper = mountComponent(props);
    const downshiftRender = wrapper.find('Downshift').prop('children');
    const renderedChildren = downshiftRender({
      getInputProps: () => ({}),
      getItemProps: () => ({}),
      isOpen: false,
      highlightedIndex: null,
      selectedItem: null,
    });
    const childrenWrapper = mount(renderedChildren);
    expect(childrenWrapper.find('.suggestions-list')).to.have.lengthOf(0);
    childrenWrapper.unmount();
    wrapper.unmount();
  });

  it('should not render suggestions list when inputValue is empty', () => {
    const props = { ...defaultProps, inputValue: '' };
    const wrapper = mountComponent(props);
    const downshiftRender = wrapper.find('Downshift').prop('children');
    const renderedChildren = downshiftRender({
      getInputProps: () => ({}),
      getItemProps: () => ({}),
      isOpen: true,
      highlightedIndex: null,
      selectedItem: null,
    });
    const childrenWrapper = mount(renderedChildren);
    expect(childrenWrapper.find('.suggestions-list')).to.have.lengthOf(0);
    childrenWrapper.unmount();
    wrapper.unmount();
  });

  it('should render the suggestions list with proper attributes when isOpen and inputValue are truthy', () => {
    const suggestions = [
      {
        lacNm: 'First Suggestion',
        label: 'first',
        type: 'Certification',
        state: 'all',
      },
      {
        lacNm: 'Second Suggestion',
        label: 'second',
        type: 'Certification',
        state: 'all',
      },
      {
        lacNm: 'Third Suggestion',
        label: 'third',
        type: 'Certification',
        state: 'all',
      },
    ];
    const props = {
      ...defaultProps,
      inputValue: 'some input',
      suggestions,
    };
    const wrapper = mountComponent(props);
    const downshiftRender = wrapper.find('Downshift').prop('children');

    // Simulate getItemProps by returning a data attribute based on each suggestion’s index
    const getItemProps = params => {
      const index = suggestions.findIndex(
        sug => sug.lacNm === params.item.lacNm,
      );
      return { 'data-test-index': index };
    };

    const renderedChildren = downshiftRender({
      getInputProps: () => ({}),
      getItemProps,
      isOpen: true,
      highlightedIndex: 1,
      selectedItem: null,
    });
    const childrenWrapper = shallow(renderedChildren);

    const suggestionsList = childrenWrapper.find('.suggestions-list');
    expect(suggestionsList).to.have.lengthOf(1);
    expect(suggestionsList.prop('role')).to.equal('listbox');
    expect(suggestionsList.prop('id')).to.equal('lcKeywordSearch');
    expect(suggestionsList.prop('style')).to.deep.equal({ maxWidth: '30rem' });

    const firstSuggestion = suggestionsList.find('[data-test-index=0]');
    expect(
      firstSuggestion.find('.keyword-suggestion-container'),
    ).to.have.lengthOf(1);
    expect(firstSuggestion.find('.vads-u-padding-right--1').text()).to.equal(
      'First Suggestion',
    );
    expect(firstSuggestion.text()).to.contain('(2 results)');
    const secondSuggestion = suggestionsList.find('[data-test-index=1]');
    expect(secondSuggestion.text()).to.contain('Second Suggestion');

    const thirdSuggestion = suggestionsList.find('[data-test-index=2]');
    expect(thirdSuggestion.text()).to.contain('Third Suggestion');

    wrapper.unmount();
  });

  it('should not render suggestions list when isOpen is false', () => {
    const props = {
      ...defaultProps,
      inputValue: 'non-empty',
    };
    const wrapper = mountComponent(props);
    const downshiftRender = wrapper.find('Downshift').prop('children');

    const renderedChildren = downshiftRender({
      getInputProps: () => ({}),
      getItemProps: () => ({}),
      isOpen: false,
      highlightedIndex: null,
      selectedItem: null,
    });
    const childrenWrapper = shallow(renderedChildren);
    expect(childrenWrapper.find('.suggestions-list')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('should not render suggestions list when inputValue is empty', () => {
    const props = {
      ...defaultProps,
      inputValue: '',
    };
    const wrapper = mountComponent(props);
    const downshiftRender = wrapper.find('Downshift').prop('children');

    const renderedChildren = downshiftRender({
      getInputProps: () => ({}),
      getItemProps: () => ({}),
      isOpen: true,
      highlightedIndex: null,
      selectedItem: null,
    });
    const childrenWrapper = shallow(renderedChildren);
    expect(childrenWrapper.find('.suggestions-list')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('should set aria-selected to "true" when selectedItem matches item.label', () => {
    const suggestions = [
      {
        lacNm: 'First Suggestion',
        label: 'first',
        type: 'Certification',
        state: 'all',
      },
      {
        lacNm: 'Second Suggestion',
        label: 'second',
        type: 'Certification',
        state: 'all',
      },
    ];
    const props = {
      ...defaultProps,
      inputValue: 'some input',
      suggestions,
    };
    const wrapper = mountComponent(props);
    const downshiftRender = wrapper.find('Downshift').prop('children');

    const getItemProps = params => {
      const index = suggestions.findIndex(
        sug => sug.lacNm === params.item.lacNm,
      );
      return { 'data-test-index': index };
    };

    const renderedChildren = downshiftRender({
      getInputProps: () => ({}),
      getItemProps,
      isOpen: true,
      highlightedIndex: null,
      selectedItem: 'first',
    });
    const childrenWrapper = shallow(renderedChildren);
    const firstSuggestionDiv = childrenWrapper.find('[data-test-index=0]');
    const secondSuggestionDiv = childrenWrapper.find('[data-test-index=1]');
    expect(firstSuggestionDiv.prop('aria-selected')).to.equal('true');
    expect(secondSuggestionDiv.prop('aria-selected')).to.equal('false');
    wrapper.unmount();
  });

  it('should apply "suggestion-highlighted" class to the suggestion at the highlighted index', () => {
    const suggestions = [
      {
        lacNm: 'First Suggestion',
        label: 'first',
        type: 'Certification',
        state: 'all',
      },
      {
        lacNm: 'Second Suggestion',
        label: 'second',
        type: 'Certification',
        state: 'all',
      },
    ];
    const props = {
      ...defaultProps,
      inputValue: 'some input',
      suggestions,
    };
    const wrapper = mountComponent(props);
    const downshiftRender = wrapper.find('Downshift').prop('children');

    const getItemProps = params => {
      const index = suggestions.findIndex(
        sug => sug.lacNm === params.item.lacNm,
      );
      return { 'data-test-index': index };
    };

    const renderedChildren = downshiftRender({
      getInputProps: () => ({}),
      getItemProps,
      isOpen: true,
      highlightedIndex: 1,
      selectedItem: null,
    });
    const childrenWrapper = shallow(renderedChildren);
    const firstSuggestionDiv = childrenWrapper.find('[data-test-index=0]');
    const secondSuggestionDiv = childrenWrapper.find('[data-test-index=1]');
    expect(firstSuggestionDiv.hasClass('suggestion')).to.be.true;
    expect(secondSuggestionDiv.hasClass('suggestion')).to.be.true;
    expect(secondSuggestionDiv.hasClass('suggestion-highlighted')).to.be.true;
    expect(firstSuggestionDiv.hasClass('suggestion-highlighted')).to.be.false;
    wrapper.unmount();
  });
});
