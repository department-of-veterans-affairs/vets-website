import React from 'react';
import Downshift from 'downshift';
import classNames from 'classnames';

export default class AutosuggestField extends React.Component {
  constructor(props) {
    super(props);
    const { uiSchema, schema, formData } = props;

    this.state = {
      options: []
    };
  }

    /*(
  filterItems(
    items,
    inputValue,
    getInputProps,
    getItemProps,
    highlightedIndex
  ) {
    if (this.props.loading) {
      return (
        <li className="ds-c-autocomplete__list-item--message">
          {this.props.loadingMessage}
        </li>
      );
    }

    if (items.length) {
      return items.map((item, index) => (
      ));
    }

    return (
      <li className="ds-c-autocomplete__list-item--message">
        {this.props.noResultsMessage}
      </li>
    );
  }
  */

  componentDidMount() {
    this.getOptions();
  }

  getOptions = (inputValue) => {
    const getOptions = this.props.uiSchema['ui:options'].getOptions;
    if (getOptions) {
      getOptions(inputValue).then((items) => {
        this.setState({ items });
      });
    }
  }
  handleInputValueChange = (inputValue) => {
    if (inputValue !== this.state.input) {
      this.setState({
        input: inputValue
      });
    }
    /*
      const uiOptions = this.props.uiSchema['ui:options'];
      if (uiOptions.queryForResults) {
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
    */
}

render() {
  console.log(this.state.items);
  const loading = false; // tie this to the fetch TODO
  const label = 'some heading'; // turn this into a prop with a default value TODO
  const {
    items,
  } = this.state;

  // TODO
  // pull in styles
  //
  // maybe add back className that comes in from props (CMS)
  const rootClassName = classNames(
    'ds-u-clearfix',
    'ds-c-autocomplete'
  );
  // maybe add back autocompleteProps (CMS) TODO
  //
  // forms system is passing custom props into input
  return (
    <Downshift
      onInputValueChange={this.handleInputValueChange}
      inputValue={this.state.input}
      render={({
        clearSelection,
        getInputProps,
        getItemProps,
        highlightedIndex,
        inputValue,
        isOpen
      }) => (
        <div className={rootClassName}>
          <input {...getInputProps()} />
          {isOpen && (loading || items) ? (
            <div className="ds-u-border--1 ds-u-padding--1 ds-c-autocomplete__list">
              {label &&
                  !loading && (
                    <h5
                      className="ds-u-margin--0 ds-u-padding--1"
                      id={this.labelId}
                    >
                      {label}
                    </h5>
                  )}

                  <ul
                    aria-labelledby={label ? this.labelId : null}
                    className="ds-c-list--bare"
                    id={this.listboxId}
                    role="listbox"
                  >
                    {items.map((item, index) => (
                      <li
                        aria-selected={highlightedIndex === index}
                        className={
                          highlightedIndex === index
                            ? 'ds-c-autocomplete__list-item ds-c-autocomplete__list-item--active'
                            : 'ds-c-autocomplete__list-item'
                        }
                        key={index}
                        role="option"
                        {...getItemProps({ item })}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
          ) : null}

          <a
            aria-label={'ariaClearLabel TODO'}
            className="ds-u-float--right ds-u-padding-right--0"
            onClick={clearSelection}
            size="small"
            variation="transparent"
          >
            {'clearInputText TODO'}
          </a>
        </div>
      )}
    />
  );
}
}
