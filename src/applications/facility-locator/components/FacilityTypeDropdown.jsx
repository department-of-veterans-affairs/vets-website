import React, { Component } from 'react';
import { kebabCase } from 'lodash/fp';
import classNames from 'classnames';
import Downshift from 'downshift';

import { facilityTypes } from '../config';
import { keyMap } from '../utils/helpers';

const FACILITY_OPTIONS = ['all', 'health', 'benefits', 'cemetery', 'vet_center'];

const facilityOptionClasses = (item, selected) => classNames(
  'dropdown-option',
  { selected },
  { 'icon-option': item && item !== 'all' },
  { [`${kebabCase(item)}-icon`]: item && item !== 'all' }
);

const itemToString = (item) => facilityTypes[item] || 'All Facilities';

const FacilityTypeDropdown = ({
  getButtonProps,
  getItemProps,
  highlightedIndex,
  isOpen,
  selectedItem,
  toggleMenu
}) => {
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

  const options = FACILITY_OPTIONS.map((item, index) => (
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
        Select Facility Type
      </label>
      <div id="facility-dropdown">
        <button {...getButtonProps({
          id: 'facility-dropdown-toggle',
          className: facilityOptionClasses(selectedItem),
          onKeyDown: handleKeyDown,
          tabIndex: 0,
          type: 'button',
          'aria-expanded': isOpen
        })}>
          {itemToString(selectedItem)}
          <i className="fa fa-chevron-down dropdown-toggle"/>
        </button>
        {isOpen && (<ul className="dropdown" role="listbox">{options}</ul>)}
      </div>
    </div>
  );
};

class Wrapper extends Component {
  render() {
    const { facilityType } = this.props;
    const highlightedIndex = FACILITY_OPTIONS.indexOf(facilityType);

    return (
      <Downshift
        defaultHighlightedIndex={highlightedIndex}
        itemToString={itemToString}
        onChange={this.props.onChange}
        selectedItem={facilityType || 'all'}>
        {FacilityTypeDropdown}
      </Downshift>
    );
  }
}

export default Wrapper;
