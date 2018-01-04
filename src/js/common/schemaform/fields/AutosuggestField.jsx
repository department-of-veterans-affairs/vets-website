import React from 'react';
import _ from 'lodash/fp';
import Downshift from 'downshift';
import { sortListByFuzzyMatch } from '../../utils/helpers';

const ESCAPE_KEY = 27;

function getInput(input, uiSchema, schema) {
  if (input && input.widget === 'autosuggest') {
    return input.label;
  }

  if (typeof input !== 'object' && input) {
    const uiOptions = uiSchema['ui:options'];
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

    this.state = {
      options,
      input,
      selectedItem: formData,
      suggestions
    };
  }

  componentDidMount() {
    if (!this.props.formContext.reviewMode) {
      const getOptions = this.props.uiSchema['ui:options'].getOptions;
      if (getOptions) {
        getOptions().then(options => {
          if (!this.unmounted) {
            this.setState({ options, suggestions: this.getSuggestions(options, this.state.input) });
          }
        });
      }
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getSuggestions = (options, value) => {
    if (value) {
      const uiOptions = this.props.uiSchema['ui:options'];
      return sortListByFuzzyMatch(value, options).slice(0, uiOptions.maxOptions);
    }

    return options;
  }

  getFormData = (suggestion) => {
    if (this.useEnum) {
      return suggestion.id;
    }

    return _.set('widget', 'autosuggest', suggestion);
  }

  handleStateChange = (state) => {
    if (typeof state.selectedItem !== 'undefined') {
      const value = this.getFormData(state.selectedItem);
      this.props.onChange(value);
      this.setState({
        input: state.selectedItem.label,
        suggestions: this.getSuggestions(this.state.options, state.selectedItem.label)
      });
    } else if (typeof state.inputValue !== 'undefined') {
      this.props.onChange({ widget: 'autosuggest', label: state.inputValue });
      this.setState({
        input: state.inputValue,
        suggestions: this.getSuggestions(this.state.options, state.inputValue)
      });
    }
  }

  handleKeyDown = (event) => {
    if (event.keyCode === ESCAPE_KEY) {
      this.props.onChange();
      this.setState({ input: '' });
    }
  }

  handleBlur = () => {
    this.props.onBlur(this.props.idSchema.$id);
  }

  render() {
    const { idSchema, formContext, formData, uiSchema, schema } = this.props;
    const id = idSchema.$id;

    if (formContext.reviewMode) {
      return (
        <div className="review-row">
          <dt>{this.props.uiSchema['ui:title']}</dt>
          <dd><span>{getInput(formData, uiSchema, schema)}</span></dd>
        </div>
      );
    }

    return (
      <Downshift
        onStateChange={this.handleStateChange}
        inputValue={this.state.input}
        selectedItem={this.state.input}
        itemToString={item => {
          if (typeof item === 'string') {
            return item;
          }

          return item.label;
        }}
        render={({
          getInputProps,
          getItemProps,
          isOpen,
          selectedItem,
          highlightedIndex
        }) => (
          <div>
            <input {...getInputProps({ id, name: id, onKeyDown: this.handleKeyDown, onBlur: this.handleBlur })}/>
            {isOpen && (
              <div>
                {this.state.suggestions
                  .map((item, index) => (
                    <div
                      {...getItemProps({ item })}
                      key={item.id}
                      style={{
                        backgroundColor:
                          highlightedIndex === index ? 'gray' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      }}>
                      {item.label}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}>
      </Downshift>
    );
  }
}
