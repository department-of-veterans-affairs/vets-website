import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import debounce from 'platform/utilities/data/debounce';

export const isTypeaheadEnabled =
  !environment.isProduction() && document.location.pathname === '/';

export const typeaheadListId = 'onsite-search-typeahead';

export default class Typeahead extends React.Component {
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
};

Typeahead.defaultProps = {
  debounceRate: 200,
};
