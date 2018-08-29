import React, { Component } from 'react';
import { kebabCase } from 'lodash/fp';
import classNames from 'classnames';
import Downshift from 'downshift';
// import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

import { facilityTypes } from '../config';
import { keyMap } from '../utils/helpers';
import { LOCATION_OPTIONS, LocationType } from '../constants';

const facilityOptionClasses = (item, selected) => classNames(
  'dropdown-option',
  { selected },
  { 'icon-option': item && item !== 'all' },
  { [`${kebabCase(item)}-icon`]: item && item !== 'all' }
);

const itemToString = (item) => facilityTypes[item] || 'All Facilities';

const FacilityTypeDropdown = ({
  closeMenu,
  getButtonProps,
  getItemProps,
  highlightedIndex,
  isOpen,
  selectedItem
}) => {
  const handleKeyDown = (e) => {
    // Allow blurring focus (with TAB) to close dropdown.
    if (e.keyCode === keyMap.TAB && isOpen) { closeMenu(); }
  };

  const options = LOCATION_OPTIONS.map((item, index) => (
    <li key={item} {...getItemProps({
      item,
      className: facilityOptionClasses(item, index === highlightedIndex),
      role: 'option',
      'aria-selected': index === highlightedIndex
    })}>
      {itemToString(item)}
    </li>
  ));

  return (
    <div>
      <label htmlFor="facility-dropdown-toggle">
        Search for
      </label>
      <div id="facility-dropdown">
        <button {...getButtonProps({
          id: 'facility-dropdown-toggle',
          className: facilityOptionClasses(selectedItem),
          onKeyDown: handleKeyDown,
          tabIndex: 0,
          type: 'button',
          'aria-label': null, // Remove in favor of HTML label above.
          'aria-expanded': isOpen
        })}>
          {itemToString(selectedItem)}
          <i className="fa fa-chevron-down dropdown-toggle"/>
        </button>
        {isOpen && (<ul className="dropdown" role="listbox">{options}</ul>)}
      </div>
      { selectedItem === LocationType.CC_PROVIDER &&
        <div className="pull-left">
          <a href="https://www.va.gov/COMMUNITYCARE/programs/veterans/VCP/index.asp"
            rel="noopener noreferrer" target="_blank" className="cc-info-link">
            What's Community Care and am I eligible?
          </a>
        </div>
      }
    </div>
  );
};

class Wrapper extends Component {
  render() {
    const facilityType = this.props.facilityType || 'all';
    const highlightedIndex = LOCATION_OPTIONS.indexOf(facilityType);

    return (
      <Downshift
        defaultSelectedItem="all"
        defaultHighlightedIndex={highlightedIndex}
        itemToString={itemToString}
        onChange={this.props.onChange}
        selectedItem={facilityType}>
        {FacilityTypeDropdown}
      </Downshift>
    );
  }
}

export default Wrapper;
