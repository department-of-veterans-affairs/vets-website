import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

class Typeahead extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: this.props.startingValue,
      savedSuggestions: [],
      suggestions: [],
      a11yLongStringMessage: '',
      displayA11yDescriptionFlag: undefined,
    };
  }

  componentDidMount() {
    const { startingValue } = this.props;

    if (startingValue) {
      const suggestions = this.fetchSuggestions(startingValue);
      this.setState({ suggestions });
    }
  }

  // whenever the Input Value changes, call the prop function to export its value to the parent component
  componentDidUpdate(prevProps, prevState) {
    const { inputValue } = this.state;
    const { fetchInputValue } = this.props;

    const inputChanged = prevState.inputValue !== inputValue;

    if (fetchInputValue && inputChanged) {
      fetchInputValue(inputValue);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.fetchSuggestionsTimeout);
  }

  handleInputChange = event => {
    const inputValue = event.target.value;

    this.setState({ inputValue });

    if (inputValue?.length <= 2) {
      this.clearSuggestions();
      return;
    }

    // reset the timeout so we only fetch for suggestions after the debounce timer has elapsed
    clearTimeout(this.fetchSuggestionsTimeout);

    this.fetchSuggestionsTimeout = setTimeout(() => {
      this.fetchSuggestions(inputValue);
    }, 200);
  };

  // call the fetchSuggestions prop and save the returned value into state
  fetchSuggestions = async inputValue => {
    const { fetchSuggestions } = this.props;

    const suggestions = await fetchSuggestions(inputValue);
    this.setState({ suggestions });
  };

  clearSuggestions = () => {
    this.setState({ suggestions: [], savedSuggestions: [] });
  };

  render() {
    const { inputValue, suggestions } = this.state;
    const { id, onInputSubmit } = this.props;

    return (
      <VaSearchInput
        aria-autocomplete="none"
        aria-controls={`${id}-listbox`}
        aria-label="Search"
        autoComplete="off"
        class="vads-u-width--full"
        id={`${id}-input-field`}
        data-e2e-id={`${id}-input-field`}
        onInput={this.handleInputChange}
        onSubmit={() => onInputSubmit(this.state)}
        suggestions={suggestions}
        value={inputValue}
      />
    );
  }
}

Typeahead.propTypes = {
  fetchSuggestions: PropTypes.func.isRequired,
  onInputSubmit: PropTypes.func,
  onSuggestionSubmit: PropTypes.func,
  fetchInputValue: PropTypes.func,
  id: PropTypes.string,
  startingValue: PropTypes.string,
};

export default Typeahead;