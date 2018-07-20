import React from 'react';
import _ from 'lodash/fp';
import Downshift from 'downshift';

import debounce from 'us-forms-system/lib/js/utilities/data/debounce';
import sortListByFuzzyMatch from 'us-forms-system/lib/js/utilities/fuzzy-matching';

const ESCAPE_KEY = 27;

function getInput(input, uiSchema, schema) {
  if (input && input.widget === 'autosuggest') {
    return input.label;
  }

  if (typeof input !== 'object' && input) {
    const uiOptions = uiSchema['ui:options'];
    // When using this field in an array item, editing the item will throw an error
    //  if there uiOptions.label is undefined (as when we queryForResults), so we
    //  have to have this safety valve
    if (!uiOptions.labels) {
      return input;
    }

    if (uiOptions.labels[input]) {
      return uiOptions.labels[input];
    }

    const index = schema.enum.indexOf(input) >= 0;
    if (schema.enumNames && index >= 0) {
      return uiOptions.labels[input] || schema.enumNames[index];
    }
  }

  return '';
}

export default class AutosuggestField extends React.Component {
  constructor(props) {
    super(props);
    const { uiSchema, schema, formData } = props;
    const input = getInput(formData, uiSchema, schema);
    const uiOptions = uiSchema['ui:options'];

    let options = [];
    let suggestions = [];

    if (!uiOptions.getOptions) {
      this.useEnum = true;
      options = schema.enum.map((id, index) => {
        return {
          id,
          label: uiOptions.labels[id] || schema.enumNames[index]
        };
      });
      suggestions = this.getSuggestions(options, input);
    }

    const debounceRate = uiOptions.debounceRate === undefined ? 1000 : uiOptions.debounceRate;
    this.debouncedGetOptions = debounce(debounceRate, this.getOptions);

    this.state = {
      listLabel: uiOptions.listLabel,
      loading: false,
      options,
      input,
      suggestions
    };
  }

  componentDidMount() {
    if (!this.props.formContext.reviewMode) {
      this.getOptions();
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.debouncedGetOptions.cancel();
  }

  getOptions = (inputValue) => {
    const getOptions = this.props.uiSchema['ui:options'].getOptions;
    if (getOptions) {
      getOptions(inputValue)
        .then(({ options, searchTerm }) =>
          // match response to current request
          searchTerm === this.state.searchTerm &&
          this.setOptions(options));
    }
  }

  setOptions = (options) => {
    if (!this.unmounted) {
      const optionsOrDefault = options.length > 0 ?
        options :
        [{ value: null, label: 'No results' }];
      this.setState({
        loading: false,
        searchTerm: '',
        options: optionsOrDefault,
        suggestions: this.getSuggestions(optionsOrDefault, this.state.input)
      });
    }
  }

  getSuggestions = (options, value) => {
    if (value) {
      const uiOptions = this.props.uiSchema['ui:options'];
      const sortedOptions = sortListByFuzzyMatch(value, options).slice(0, uiOptions.maxOptions);
      return sortedOptions;
    }

    return options;
  }

  getFormData = (suggestion) => {
    if (this.useEnum) {
      return suggestion.id;
    }

    // When freeInput is true, we'll return the label to the api instead of the id
    if (this.props.uiSchema['ui:options'].freeInput) {
      return suggestion.label;
    }

    return _.set('widget', 'autosuggest', suggestion);
  }

  handleClearSelection = (e, downshiftClear) => {
    e.preventDefault();
    // using Downshift's clear sets the correct focus state after using clear
    downshiftClear(() => this.setState({
      input: '',
      searchTerm: '',
      loading: false
    }));
  }

  handleInputValueChange = (inputValue) => {
    if (inputValue !== this.state.input) {
      const uiOptions = this.props.uiSchema['ui:options'];
      if (uiOptions.queryForResults) {
        this.setState({
          loading: true,
          searchTerm: inputValue
        });
        this.debouncedGetOptions(inputValue);
      }

      let item = { widget: 'autosuggest', label: inputValue };
      // once the input is long enough, check for exactly matching strings so that we don't
      // force a user to click on an item when they've typed an exact match of a label
      if (inputValue && inputValue.length > 3) {
        const matchingItem = this.state.suggestions.find(suggestion => suggestion.label === inputValue);
        if (matchingItem) {
          item = this.getFormData(matchingItem);
        }
      }

      this.props.onChange((this.props.uiSchema['ui:options'].freeInput || this.useEnum) ? inputValue : item);
      this.setState({
        input: inputValue,
        suggestions: this.getSuggestions(this.state.options, inputValue)
      });
    } else if (inputValue === '') {
      this.props.onChange();
      this.setState({
        input: inputValue,
        suggestions: this.getSuggestions(this.state.options, inputValue)
      });
    }
  }

  handleChange = (selectedItem) => {
    const value = this.getFormData(selectedItem);
    this.props.onChange(value);
    if (this.state.input !== selectedItem.label) {
      this.setState({
        input: selectedItem.label,
      });
    }
  }

  handleKeyDown = (event) => {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({ input: '' });
    }
  }

  handleBlur = () => {
    this.props.onBlur(this.props.idSchema.$id);
  }

  render() {
    const { formContext, formData, uiSchema, schema } = this.props;

    const {
      loading,
      options: items
    } = this.state;
    const listLabel = loading ? 'Loading...' : this.state.listLabel;

    if (formContext.reviewMode) {
      const readOnlyData = <span>{getInput(formData, uiSchema, schema)}</span>;

      // If this is an non-object field then the label will
      // be included by ReviewFieldTemplate
      if (schema.type !== 'object') {
        return readOnlyData;
      }

      return (
        <div className="review-row">
          <dt>{this.props.uiSchema['ui:title']}</dt>
          <dd>{readOnlyData}</dd>
        </div>
      );
    }

    return (
      <div>
        <Downshift
          onChange={this.handleChange}
          onInputValueChange={this.handleInputValueChange}
          inputValue={this.state.input}
          selectedItem={this.state.input}
          onOuterClick={this.handleBlur}
          itemToString={item => {
            if (typeof item === 'string') {
              return item;
            }

            return item.label;
          }}
          render={({
            clearSelection,
            getInputProps,
            getItemProps,
            isOpen,
            highlightedIndex
          }) => (
            <div className="edu-complaint-input-controls">
              <input {...getInputProps()}/>
              {isOpen && (loading || items) ? (
                <div className="ds-u-border--1 ds-u-padding--1 ds-c-autocomplete__list">
                  {listLabel && (
                    <h5
                      className="ds-u-margin--0 ds-u-padding--1"
                      id={this.labelId}>
                      {listLabel}
                    </h5>
                  )}

                  <ul
                    aria-labelledby={listLabel ? this.labelId : null}
                    className="ds-c-list--bare"
                    id={this.listboxId}
                    role="listbox">
                    {!loading && this.state.suggestions
                      .map(({ label: itemLabel, value: itemValue }, index) => (
                        <li
                          aria-selected={highlightedIndex === index}
                          className={
                            highlightedIndex === index
                              ? 'ds-c-autocomplete__list-item ds-c-autocomplete__list-item--active'
                              : 'ds-c-autocomplete__list-item'
                          }
                          key={index}
                          role="option"
                          {...getItemProps({
                            item: {
                              label: itemLabel,
                              value: itemValue
                            }
                          })}>
                          {itemLabel}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}

              <button
                aria-label={'clear all fields on this page'}
                className="ds-u-float--right ds-u-padding-right--0"
                onClick={e => this.handleClearSelection(e, clearSelection)}>
                {'Clear search'}
              </button>
            </div>
          )}>
        </Downshift>
        <h1>test</h1>
      </div>
    );
  }
}
