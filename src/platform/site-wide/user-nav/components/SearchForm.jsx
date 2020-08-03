import React from 'react';
import environment from 'platform/utilities/environment';
import IconSearch from '@department-of-veterans-affairs/formation-react/IconSearch';

import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';

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
    const icon = <IconSearch color="#fff" role="presentation" />;
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
            autoComplete="off"
            ref="searchField"
            className="usagov-search-autocomplete"
            id="query"
            name="query"
            type="text"
            onChange={this.handleInputChange}
          />
          <button type="submit" disabled={!validUserInput}>
            <IconSearch color="#fff" />
            <span className="usa-sr-only">Search</span>
          </button>
        </div>
      </form>
    );
  }
}
