import React, { Component } from 'react';
import { kebabCase } from 'lodash/fp';
import classNames from 'classnames';
import Downshift from 'downshift';

import { facilityTypes } from '../config';
import { keyMap } from '../utils/helpers';

const FACILITY_OPTIONS = [
  'all',
  'health',
  'benefits',
  'cemetery',
  'vet_center',
];

const facilityOptionClasses = (item, selected) =>
  classNames(
    'dropdown-option',
    { selected },
    { 'icon-option': item && item !== 'all' },
    { [`${kebabCase(item)}-icon`]: item && item !== 'all' },
  );

const itemToString = item => facilityTypes[item] || 'All Facilities';

const FacilityTypeDropdown = ({
  closeMenu,
  getButtonProps,
  getItemProps,
  highlightedIndex,
  isOpen,
  selectedItem,
}) => {
  const handleKeyDown = e => {
    // Allow blurring focus (with TAB) to close dropdown.
    if (e.keyCode === keyMap.TAB && isOpen) {
      closeMenu();
    }
  };

  const options = FACILITY_OPTIONS.map((item, index) => (
    <li
      key={item}
      {...getItemProps({
        item,
        className: facilityOptionClasses(item, index === highlightedIndex),
        role: 'option',
        'aria-selected': index === highlightedIndex,
      })}
    >
      {itemToString(item)}
    </li>
  ));

  return (
    <div>
      <label htmlFor="facility-dropdown-toggle">Select Facility Type</label>
      <div id="facility-dropdown">
        <button
          {...getButtonProps({
            id: 'facility-dropdown-toggle',
            className: facilityOptionClasses(selectedItem),
            onKeyDown: handleKeyDown,
            tabIndex: 0,
            type: 'button',
            'aria-label': null, // Remove in favor of HTML label above.
            'aria-expanded': isOpen,
          })}
        >
          {itemToString(selectedItem)}
          <i className="fa fa-chevron-down dropdown-toggle" />
        </button>
        {isOpen && (
          <ul className="dropdown" role="listbox">
            {options}
          </ul>
        )}
      </div>
    </div>
  );
};

class Wrapper extends Component {
  render() {
    const facilityType = this.props.facilityType || 'all';
    const highlightedIndex = FACILITY_OPTIONS.indexOf(facilityType);

    return (
      <Downshift
        defaultSelectedItem="all"
        defaultHighlightedIndex={highlightedIndex}
        itemToString={itemToString}
        onChange={this.props.onChange}
        selectedItem={facilityType}
      >
        {FacilityTypeDropdown}
      </Downshift>
    );
  }
}

export default Wrapper;
