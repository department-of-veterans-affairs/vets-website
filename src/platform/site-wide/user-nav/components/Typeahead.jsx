import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'platform/utilities/data/debounce';

export const typeaheadListId = 'onsite-search-typeahead';

export class Typeahead extends React.Component {
  constructor(props) {
    super(props);
    this.getSuggestions = debounce(
      this.props.debounceRate,
      this.getSuggestions,
    );
    this.state = {
      suggestions: [],
    };
  }

  componentDidUpdate(prevProps) {
    const inputChanged = prevProps.userInput !== this.props.userInput;
    if (inputChanged) {
      this.getSuggestions();
    }
  }

  async getSuggestions() {
    const input = this.props.userInput;

    if (input?.length <= 2) {
      if (this.state.suggestions.length > 0) {
        this.setState({ suggestions: [] });
      }

      return;
    }

    const encodedInput = encodeURIComponent(input);
    const response = await fetch(
      `https://search.usa.gov/sayt?=&name=va&q=${encodedInput}`,
    );

    const suggestions = await response.json();

    this.setState({ suggestions });
  }

  render() {
    // if the feature toggle is off, don't render any suggestions
    if (!this.props.searchTypeaheadEnabled) {
      return null;
    }

    return (
      <datalist id={typeaheadListId}>
        {this.state.suggestions.map(suggestion => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    );
  }
}

Typeahead.propTypes = {
  userInput: PropTypes.string,
  debounceRate: PropTypes.number,
  searchTypeaheadEnabled: PropTypes.bool,
};

Typeahead.defaultProps = {
  debounceRate: 200,
};

export default Typeahead;
