import React from 'react';
import environment from 'platform/utilities/environment';

export const isTypeaheadEnabled =
  !environment.isProduction() && document.location.pathname === '/';

export const typeaheadListId = 'onsite-search-typeahead';

export default class Typeahead extends React.Component {
  constructor(props) {
    super(props);
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
    if (input?.length <= 2) return;

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
