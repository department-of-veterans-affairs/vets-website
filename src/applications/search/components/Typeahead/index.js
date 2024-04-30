import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchTypeaheadSuggestions } from '~/platform/utilities/search-utilities';

class Typeahead extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: this.props.startingValue,
      savedSuggestions: [],
      suggestions: [],
    };
  }

  componentDidMount() {
    const { startingValue } = this.props;

    if (startingValue) {
      const suggestions = this.fetchSuggestions(startingValue);
      this.setState({ suggestions });
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

  fetchSuggestions = async inputValue => {
    const suggestions = await fetchTypeaheadSuggestions(inputValue);
    this.setState({ suggestions });
  };

  clearSuggestions = () => {
    this.setState({ suggestions: [], savedSuggestions: [] });
  };

  render() {
    const { inputValue, suggestions } = this.state;
    const { onInputSubmit } = this.props;

    return (
      <VaSearchInput
        class="vads-u-width--full"
        id="search-results-page-dropdown-input-field"
        data-e2e-id="search-results-page-dropdown-input-field"
        onInput={this.handleInputChange}
        onSubmit={() => onInputSubmit(this.state)}
        suggestions={suggestions}
        value={inputValue}
      />
    );
  }
}

Typeahead.propTypes = {
  onInputSubmit: PropTypes.func.isRequired,
  startingValue: PropTypes.string,
};

export default Typeahead;
