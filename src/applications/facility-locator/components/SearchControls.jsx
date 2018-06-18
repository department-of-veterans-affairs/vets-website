import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Downshift from 'downshift';

import recordEvent from '../../../platform/monitoring/record-event';
import { benefitsServices, facilityTypes, vetCenterServices } from '../config';
import { keyMap } from '../utils/helpers';

class SearchControls extends Component {
  handleEditSearch = () => {
    this.props.onChange({ active: false });
  }

  handleQueryChange = (e) => {
    this.props.onChange({ searchString: e.target.value });
  }

  handleFacilityTypeChange = (option) => {
    const facilityType = (option === 'all') ? null : option;
    this.props.onChange({ facilityType, serviceType: null });
  }

  handleServiceTypeChange = (option) => {
    const serviceType = (option === 'All') ? null : option;
    this.props.onChange({ serviceType });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { facilityType } = this.props.currentQuery;
    // Report event here to only send analytics event when a user clicks on the button
    recordEvent({
      event: 'fl-search',
      'fl-search-fac-type': facilityType
    });

    this.props.onSubmit();
  }

  renderFacilityTypeDropdown = ({
    getButtonProps,
    getItemProps,
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
      switch (e.keyCode) {
        // Allow (1) ENTER with nothing highlighted or
        // (2) blurring focus (with TAB) to close dropdown.
        case keyMap.ENTER:
        case keyMap.TAB:
          if (isOpen) { toggleMenu(); }
          break;

        // Allow SPACE to toggle state of menu without making a selection.
        case keyMap.SPACE:
          toggleMenu();
          break;

        default: // Do nothing.
      }
    };

    return (
      <div>
        <label htmlFor="facility-dropdown-toggle">
          Select Facility Type
        </label>
        <div id="facility-dropdown">
          <button {...getButtonProps({
            id: 'facility-dropdown-toggle',
            className: optionClasses(selectedItem),
            onKeyDown: handleKeyDown,
            tabIndex: 0,
            type: 'button',
            'aria-expanded': isOpen
          })}>
            {facilityTypes[selectedItem] || 'All Facilities'}
            <i className="fa fa-chevron-down dropdown-toggle"/>
          </button>
          {isOpen && (
            <ul
              className="dropdown"
              role="listbox">
              {facilityOptions.map((item, index) => (
                <li key={item} {...getItemProps({
                  item,
                  className: optionClasses(item, index === highlightedIndex),
                  role: 'option',
                  'aria-selected': index === highlightedIndex
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

  renderServiceTypeDropdown = () => {
    const { facilityType } = this.props.currentQuery;
    const disabled = !['benefits', 'vet_center'].includes(facilityType);
    let services;

    // Determine what service types to display for the facility type.
    switch (facilityType) {
      case 'benefits':
        services = Object.keys(benefitsServices);
        break;
      case 'vet_center':
        services = ['All', ...vetCenterServices];
        break;
      default:
        services = [];
    }

    // Create option elements for each service type.
    const options = services.map((service) => (
      <option key={service} value={service}>
        {benefitsServices[service] || service}
      </option>
    ));

    return (
      <div className="columns usa-width-one-fourth medium-3">
        <label htmlFor="service-type-dropdown">
          Select Service Type
        </label>
        <select
          id="service-type-dropdown"
          disabled={disabled}
          onChange={this.handleServiceTypeChange}>
          {options}
        </select>
      </div>
    );
  }

  render() {
    const { currentQuery, isMobile } = this.props;

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
        <form onSubmit={this.handleSubmit}>
          <div className="columns usa-width-one-third medium-4">
            <label htmlFor="street-city-state-zip" id="street-city-state-zip-label">
              Enter Street, City, State or Zip
            </label>
            <input
              id="street-city-state-zip"
              name="street-city-state-zip"
              type="text"
              onChange={this.handleQueryChange}
              value={currentQuery.searchString}
              aria-label="Street, City, State or Zip"
              title="Street, City, State or Zip"/>
          </div>
          <div className="columns usa-width-one-fourth medium-3">
            <Downshift defaultSelectedItem="all" onChange={this.handleFacilityTypeChange}>
              {this.renderFacilityTypeDropdown}
            </Downshift>
          </div>
          {this.renderServiceTypeDropdown()}
          <div className="columns usa-width-one-sixth medium-2">
            <input type="submit" value="Search"/>
          </div>
        </form>
      </div>
    );
  }
}

export default SearchControls;
