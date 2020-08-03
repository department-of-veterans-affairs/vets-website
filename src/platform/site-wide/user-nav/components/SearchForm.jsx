import React from 'react';
import environment from 'platform/utilities/environment';
import IconSearch from '@department-of-veterans-affairs/formation-react/IconSearch';

import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';

const typeaheadListId = 'onsite-search-typeahead';
const isTypeaheadEnabled = false; // !environment.isProduction();

class Typeahead extends React.Component {
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
    if (input?.length < 2) return;

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

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchAction: replaceWithStagingDomain('https://www.va.gov/search/'),
      userInput: '',
    };
  }

  componentDidUpdate() {
    this.refs.searchField.focus();
  }

  handleInputChange = e => {
    this.setState({ userInput: e.target.value });
  };

  render() {
    const validUserInput =
      this.state.userInput &&
      this.state.userInput.replace(/\s/g, '').length > 0;

    return (
      <form
        acceptCharset="UTF-8"
        action={this.state.searchAction}
        id="search"
        method="get"
      >
        <label htmlFor="query" className="usa-sr-only">
          Search:
        </label>

        <div className="va-flex">
          <input
            list={typeaheadListId}
            autoComplete="off"
            ref="searchField"
            className="usagov-search-autocomplete"
            id="query"
            name="query"
            type="text"
            onChange={this.handleInputChange}
          />
          <Typeahead userInput={this.state.userInput} />
          <button type="submit" disabled={!validUserInput}>
            <IconSearch color="#fff" />
            <span className="usa-sr-only">Search</span>
          </button>
        </div>
      </form>
    );
  }
}
