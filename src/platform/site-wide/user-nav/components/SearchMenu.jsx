import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';

import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';
import IconSearch from '@department-of-veterans-affairs/formation-react/IconSearch';
import DropDownPanel from '@department-of-veterans-affairs/formation-react/DropDownPanel';

import Typeahead, { typeaheadListId } from './Typeahead';

export class SearchMenu extends React.Component {
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

  makeForm = () => {
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
            list={typeaheadListId}
            onChange={this.handleInputChange}
          />
          <Typeahead
            userInput={this.state.userInput}
            searchTypeaheadEnabled={this.props.searchTypeaheadEnabled}
          />
          <button type="submit" disabled={!validUserInput}>
            <IconSearch color="#fff" />
            <span className="usa-sr-only">Search</span>
          </button>
        </div>
      </form>
    );
  };

  render() {
    const buttonClasses = classNames(
      this.props.cssClass,
      'va-btn-withicon',
      'va-dropdown-trigger',
    );

    const icon = <IconSearch color="#fff" role="presentation" />;

    return (
      <DropDownPanel
        onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
        buttonText="Search"
        clickHandler={this.props.clickHandler}
        cssClass={buttonClasses}
        id="search-menu"
        icon={icon}
        isOpen={this.props.isOpen}
      >
        {this.makeForm()}
      </DropDownPanel>
    );
  }
}

SearchMenu.propTypes = {
  cssClass: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func,
  searchTypeaheadEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  searchTypeaheadEnabled: toggleValues(store)[
    FEATURE_FLAG_NAMES.searchTypeaheadEnabled
  ],
});

export default connect(mapStateToProps)(SearchMenu);
