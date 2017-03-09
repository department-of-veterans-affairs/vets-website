import React from 'react';
import classNames from 'classnames';

import IconSearch from './svgicons/IconSearch';

class SearchMenu extends React.Component {
  constructor(props) {
    super(props);
    this.makeForm = this.makeForm.bind(this);
    this.toggleSearchForm = this.toggleSearchForm.bind(this);
    this.state = {
      isOpen: false
    };
  }

  componentDidUpdate() {
    this.refs.searchField.focus();
  }

  toggleSearchForm() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  makeForm() {
    return (
      <form
          acceptCharset="UTF-8"
          action="https://search.vets.gov/search"
          className="va-dropdown-panel"
          hidden={!this.state.isOpen}
          id="search"
          method="get">
        <div className="csp-inline-patch-header">
          <input name="utf8" type="hidden" value="&#x2713;"/>
        </div>
        <input id="affiliate" name="affiliate" type="hidden" value="vets.gov_search"/>
        <label htmlFor="query" className="usa-sr-only">Search:</label>

        <div className="va-flex">
          <input autoComplete="off" ref="searchField" className="usagov-search-autocomplete" id="query" name="query" type="text"/>
          <button type="submit">
            <IconSearch color="#fff"/>
            <span className="usa-sr-only">Search</span>
          </button>
        </div>
      </form>);
  }

  render() {
    const buttonClasses = classNames(
      this.props.cssClass,
      'va-btn-withicon',
      'va-dropdown-trigger'
    );

    return (
      <div className="va-dropdown">
        <button className={buttonClasses}
            aria-controls="search"
            aria-expanded={this.state.isOpen}
            onClick={this.toggleSearchForm}
            ref="clickTrigger">
          <span>
            <IconSearch color="#fff"/>
            Search
          </span>
        </button>
        {this.makeForm()}
      </div>

    );
  }
}

SearchMenu.propTypes = {
  cssClass: React.PropTypes.string
};

export default SearchMenu;
