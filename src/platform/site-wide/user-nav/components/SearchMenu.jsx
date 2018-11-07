import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import IconSearch from '@department-of-veterans-affairs/formation/IconSearch';
import DropDownPanel from '@department-of-veterans-affairs/formation/DropDownPanel';

class SearchMenu extends React.Component {
  // TODO: make the action url environment specific
  constructor(props) {
    super(props);
    this.makeForm = this.makeForm.bind(this);
    this.toggleSearchForm = this.toggleSearchForm.bind(this);
    this.state = {
      searchAction: 'https://www.va.gov/search/',
      userInput: '',
    };
  }

  componentDidUpdate() {
    this.refs.searchField.focus();
  }

  toggleSearchForm() {
    this.props.clickHandler();
  }

  handleInputChange = e => {
    this.setState({
      userInput: e.target.value,
    });
  };

  makeForm() {
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

  render() {
    const buttonClasses = classNames(
      this.props.cssClass,
      'va-btn-withicon',
      'va-dropdown-trigger',
    );

    const icon = <IconSearch color="#fff" role="presentation" />;

    return (
      <DropDownPanel
        buttonText="Search"
        clickHandler={this.props.clickHandler}
        cssClass={buttonClasses}
        id="searchmenu"
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
};

export default SearchMenu;
