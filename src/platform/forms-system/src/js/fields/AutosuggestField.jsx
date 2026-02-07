import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift-v9';
import classNames from 'classnames';
import set from '../../../../utilities/data/set';

import debounce from '../utilities/data/debounce';
import sortListByFuzzyMatch from '../utilities/fuzzy-matching';
import escapeRegExp from '../utilities/data/escapeRegExp';

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
      options = schema.enum.map((id, index) => ({
        id,
        label: uiOptions.labels[id] || schema.enumNames[index],
      }));
      suggestions = this.getSuggestions(options, input);
    }

    const debounceRate =
      uiOptions.debounceRate === undefined ? 1000 : uiOptions.debounceRate;
    this.debouncedGetOptions = debounce(debounceRate, this.getOptions);

    this.state = {
      options,
      input,
      suggestions,
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

  getOptions = inputValue => {
    const { getOptions } = this.props.uiSchema['ui:options'];
    if (getOptions) {
      getOptions(inputValue).then(this.setOptions);
    }
  };

  setOptions = options => {
    if (!this.unmounted) {
      const suggestions = this.getSuggestions(options, this.state.input);
      this.setState({
        options,
        suggestions,
      });

      if (this.state.input && this.state.input.length > 3) {
        const item = this.getItemFromInput(
          this.state.input,
          suggestions,
          this.props.uiSchema['ui:options'],
        );

        this.props.onChange(item);
      }
    }
  };

  getSuggestions = (options, value) => {
    if (value) {
      const uiOptions = this.props.uiSchema['ui:options'];
      return sortListByFuzzyMatch(value, options).slice(
        0,
        uiOptions.maxOptions,
      );
    }

    return options;
  };

  getFormData = suggestion => {
    if (this.useEnum) {
      return suggestion.id;
    }

    // When freeInput is true, we'll return the label to the api instead of the id
    if (this.props.uiSchema['ui:options'].freeInput) {
      return suggestion.label;
    }

    return set('widget', 'autosuggest', suggestion);
  };

  getItemFromInput = (inputValue, suggestions, uiOptions) => {
    let item = { widget: 'autosuggest', label: inputValue };
    // once the input is long enough, check for exactly matching strings so that we don't
    // force a user to click on an item when they've typed an exact match of a label
    if (inputValue && inputValue.length > 3) {
      const matchingItem = suggestions.find(
        suggestion => suggestion.label === inputValue,
      );
      if (matchingItem) {
        item = this.getFormData(matchingItem);
      }
    }

    const { freeInput, inputTransformers } = uiOptions;

    const inputToSave =
      inputTransformers &&
      Array.isArray(inputTransformers) &&
      inputTransformers.length
        ? inputTransformers.reduce(
            (userInput, transformer) => transformer(userInput),
            inputValue,
          )
        : inputValue;

    return freeInput || this.useEnum ? inputToSave : item;
  };

  handleInputValueChange = inputValue => {
    if (inputValue !== this.state.input) {
      const uiOptions = this.props.uiSchema['ui:options'];
      if (uiOptions.queryForResults) {
        this.debouncedGetOptions(inputValue);
      }

      const item = this.getItemFromInput(
        inputValue,
        this.state.suggestions,
        uiOptions,
      );

      this.props.onChange(item);
      this.setState({
        input: inputValue,
        suggestions: this.getSuggestions(this.state.options, inputValue),
      });
    } else if (inputValue === '') {
      this.props.onChange();
      this.setState({
        input: inputValue,
        suggestions: this.getSuggestions(this.state.options, inputValue),
      });
    }
  };

  handleChange = selectedItem => {
    const value = this.getFormData(selectedItem);
    this.props.onChange(value);
    if (this.state.input !== selectedItem.label) {
      this.setState({
        input: selectedItem.label,
      });
    }
  };

  handleKeyDown = event => {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({ input: '' });
    }
  };

  handleBlur = () => {
    this.props.onBlur(this.props.idSchema.$id);
  };

  render() {
    const { idSchema, formContext, formData, uiSchema, schema } = this.props;
    const id = idSchema.$id;

    // wrap matching text in a <span> element
    const highlightText = uiSchema['ui:options']?.highlightText ?? true;
    const { inputProps } = uiSchema['ui:options'];
    const value = this.state.input?.toLowerCase() || '';
    const hint = uiSchema['ui:options'].hint || null;
    const caseInsensitiveMatch = new RegExp(`(${escapeRegExp(value)})`, 'i');
    const highLightMatchingText = query => {
      if (value.length > 2) {
        return query
          .split(caseInsensitiveMatch)
          .map(
            str =>
              str.toLowerCase() === value ? (
                <span className="vads-u-background-color--gold autosuggest-highlight">
                  {str}
                </span>
              ) : (
                str
              ),
          );
      }
      return query;
    };

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
      <>
        {hint && (
          <span id={`${id}-hint`} className="usa-hint">
            {hint}
          </span>
        )}
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
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            selectedItem,
            highlightedIndex,
          }) => (
            <div className="autosuggest-container">
              <input
                {...getInputProps({
                  autoComplete: 'off',
                  id,
                  name: id,
                  className: 'autosuggest-input',
                  'aria-describedby': hint ? `${id}-hint` : undefined, // Associate hint text
                  onBlur: isOpen ? undefined : this.handleBlur,
                  onKeyDown: this.handleKeyDown,
                  ...inputProps,
                })}
              />
              {isOpen && (
                <div className="autosuggest-list" role="listbox">
                  {this.state.suggestions.map((item, index) => (
                    <div
                      {...getItemProps({ item })}
                      role="option"
                      aria-selected={
                        selectedItem === item.label ? 'true' : 'false'
                      }
                      className={classNames('autosuggest-item', {
                        'autosuggest-item-highlighted':
                          highlightedIndex === index,
                        'autosuggest-item-selected':
                          selectedItem === item.label,
                      })}
                      key={item.id}
                    >
                      {highlightText
                        ? highLightMatchingText(item.label)
                        : item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Downshift>
      </>
    );
  }
}

AutosuggestField.propTypes = {
  schema: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formContext: PropTypes.shape({
    reviewMode: PropTypes.bool,
  }),
  formData: PropTypes.object,
  idSchema: PropTypes.shape({
    $id: PropTypes.string,
  }),
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      labels: PropTypes.object,
      getOptions: PropTypes.func,
      debounceRate: PropTypes.number,
      maxOptions: PropTypes.number,
      queryForResults: PropTypes.bool,
      freeInput: PropTypes.bool,
      inputProps: PropTypes.object,
      inputTransformers: PropTypes.arrayOf(PropTypes.func),
    }),
    'ui:title': PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }),
};
