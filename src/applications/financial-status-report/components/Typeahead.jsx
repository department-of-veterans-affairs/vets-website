import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import classNames from 'classnames';
import sortListByFuzzyMatch from 'platform/forms-system/src/js/utilities/fuzzy-matching';

const getInput = (input, uiSchema) => {
  if (input && input.widget === 'autosuggest') {
    return input.label;
  }

  if (typeof input !== 'object' && input) {
    const uiOptions = uiSchema['ui:options'];

    if (!uiOptions.labels) {
      return input;
    }

    if (uiOptions.labels[input]) {
      return uiOptions.labels[input];
    }
  }
  return '';
};

class Typeahead extends React.Component {
  constructor(props) {
    super(props);
    const { uiSchema, formData } = props;

    const input = getInput(formData, uiSchema);

    this.state = {
      suggestions: [],
      input,
    };
  }

  componentDidMount() {
    const getOptions = this.props.uiSchema['ui:options'].getOptions;
    getOptions().then(this.setOptionsArr);
  }

  setOptionsArr = options => {
    const suggestions = this.getSuggestions(options, this.state.input);

    this.setState({
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

  getItemFromInput = (inputValue, uiOptions) => {
    const { inputTransformers } = uiOptions;

    return inputTransformers &&
      Array.isArray(inputTransformers) &&
      inputTransformers.length
      ? inputTransformers.reduce(
          (userInput, transformer) => transformer(userInput),
          inputValue,
        )
      : inputValue;
  };

  handleInputValueChange = inputValue => {
    if (inputValue !== this.state.input) {
      const uiOptions = this.props.uiSchema['ui:options'];
      const item = this.getItemFromInput(
        inputValue,
        this.state.suggestions,
        uiOptions,
      );
      this.props.onChange(item);
      this.setState({
        input: inputValue,
        suggestions: this.getSuggestions(this.state.suggestions, inputValue),
      });
    } else if (inputValue === '') {
      this.props.onChange();
      this.setState({
        input: inputValue,
        suggestions: this.getSuggestions(this.state.suggestions, inputValue),
      });
    }
  };

  handleKeyDown = event => {
    const escapeKey = 27;
    if (event.keyCode === escapeKey) {
      this.setState({ input: '' });
    }
  };

  handleBlur = () => {
    this.props.onBlur(this.props.idSchema.$id);
  };

  render() {
    const { idSchema } = this.props;
    const id = idSchema.$id;

    return (
      <Downshift
        onInputValueChange={this.handleInputValueChange}
        inputValue={this.state.input}
        selectedItem={this.state.input}
        onOuterClick={this.handleBlur}
        itemToString={item => (typeof item === 'string' ? item : item.label)}
        render={({
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
                onBlur: isOpen ? undefined : this.handleBlur,
                onKeyDown: this.handleKeyDown,
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
                      'autosuggest-item-selected': selectedItem === item.label,
                    })}
                    key={index}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      />
    );
  }
}

Typeahead.propTypes = {
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      labels: PropTypes.object,
      getOptions: PropTypes.func.isRequired,
      maxOptions: PropTypes.number,
      inputTransformers: PropTypes.arrayOf(PropTypes.func),
    }),
    'ui:title': PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }),
  formData: PropTypes.string,
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  idSchema: PropTypes.shape({
    $id: PropTypes.string,
  }),
};

export default Typeahead;
