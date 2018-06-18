import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import Downshift from 'downshift';

import recordEvent from '../../../platform/monitoring/record-event';
import { updateSearchQuery } from '../actions';
import { facilityTypes } from '../config';
import SelectComponent from './Select';

class SearchControls extends Component {

  handleEditSearch = () => {
    this.props.updateSearchQuery({
      active: false,
    });
  }

  // TODO (bshyong): generalize to be able to handle Select box changes
  handleQueryChange = (e) => {
    this.props.onChange({
      searchString: e.target.value,
    });
  }

  handleSearch = (e) => {
    const { onSearch } = this.props;
    e.preventDefault();

    const { facilityType } = this.props.currentQuery;
    // Report event here to only send analytics event when a user clicks on the button
    recordEvent({
      event: 'fl-search',
      'fl-search-fac-type': facilityType
    });

    onSearch();
  }

  renderFacilityTypeDropdown = ({
    closeMenu,
    getButtonProps,
    getItemProps,
    getLabelProps,
    highlightedIndex,
    isOpen,
    selectedItem,
    toggleMenu
  }) => {
    const facilityOptions = ['all', 'health', 'benefits', 'cemetery', 'vet_center'];

    const optionClasses = (item, selected) => classNames(
      'dropdown-option',
      { selected },
      { 'icon-option': item !== 'all' },
      { [`${_.kebabCase(item)}-icon`]: item !== 'all' }
    );

    const handleKeyDown = (e) => {
      if (e.keyCode === 13) { toggleMenu(); }
    };

    return (
      <div>
        <label htmlFor="facility-dropdown" {...getLabelProps()}>
          Select Facility Type
        </label>
        <div id="facility-dropdown">
          <div {...getButtonProps({
            className: optionClasses(selectedItem),
            onBlur: closeMenu,
            onKeyDown: handleKeyDown,
            tabIndex: 0,
            'aria-expanded': isOpen
          })}>
            {facilityTypes[selectedItem] || 'All Facilities'}
            <i className="fa fa-chevron-down dropdown-toggle"/>
          </div>
          {isOpen && (
            <ul
              className="dropdown"
              role="listbox">
              {facilityOptions.map((item, index) => (
                <li key={item} {...getItemProps({
                  item,
                  role: 'option',
                  'aria-selected': index === highlightedIndex,
                  className: optionClasses(item, index === highlightedIndex)
                })}>
                  {facilityTypes[item] || 'All Facilities'}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { currentQuery, isMobile, onChange } = this.props;
    if (currentQuery.active && isMobile) {
      return (
        <div className="search-controls-container">
          <button className="small-12" onClick={this.handleEditSearch}>
            Edit Search
          </button>
        </div>
      );
    }

    return (
      <div className="search-controls-container clearfix">
        <form>
          <div className="columns usa-width-one-third medium-4">
            <label htmlFor="street-city-state-zip" id="street-city-state-zip-label">
              Enter Street, City, State or Zip
            </label>
            <input
              ref="searchField"
              name="street-city-state-zip"
              type="text"
              onChange={this.handleQueryChange}
              value={currentQuery.searchString}
              aria-label="Street, City, State or Zip"
              title="Street, City, State or Zip"/>
          </div>
          <div className="columns usa-width-one-third medium-3">
            <Downshift defaultSelectedItem="all">
              {this.renderFacilityTypeDropdown}
            </Downshift>
          </div>
          <SelectComponent
            optionType="service"
            currentQuery={currentQuery}
            updateSearchQuery={this.props.updateSearchQuery}
            onChange={onChange}
            isMobile={isMobile}/>
          <div className="columns usa-width-one-sixth medium-2">
            <input type="submit" value="Search" onClick={this.handleSearch}/>
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateSearchQuery
};

export default connect(null, mapDispatchToProps)(SearchControls);
