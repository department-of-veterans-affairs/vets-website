import React from 'react';
import DropDown from './DropDown';
import IconSearch from './svgicons/IconSearch';

class SearchMenu extends React.Component {
  render() {
    const icon = <IconSearch color="#fff"/>;

    const dropDownContents = (
      <form acceptCharset="UTF-8" action="https://search.vets.gov/search" id="search" method="get">
        <div className="csp-inline-patch-header">
          <input name="utf8" type="hidden" value="&#x2713;"/>
        </div>
        <input id="affiliate" name="affiliate" type="hidden" value="vets.gov_search"/>
        <label htmlFor="query" className="usa-sr-only">Search:</label>
        <div className="va-flex">
          <input autoComplete="off" className="usagov-search-autocomplete" id="query" name="query" type="text"/>
          <button type="submit">
            <IconSearch color="#fff"/>
            <span className="usa-sr-only">Search</span>
          </button>
        </div>
      </form>
    );

    return (
      <DropDown
          buttonText="Search"
          contents={dropDownContents}
          cssClass={this.props.cssClass}
          id="searchmenu"
          icon={icon}
          isOpen={false}/>
    );
  }
}

SearchMenu.propTypes = {
  cssClass: React.PropTypes.string
};

export default SearchMenu;
