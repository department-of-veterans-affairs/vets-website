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

const focusDropdown = () => document.querySelector('#facility-dropdown-toggle').focus();

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
      // Allow blurring focus (with TAB) to close dropdown.
      case keyMap.TAB:
        if (isOpen) { toggleMenu(); }
        break;

      // Allow ENTER to toggle state of menu without making a selection.
      case keyMap.ENTER:
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

  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
  return (
    <div>
      <label htmlFor="facility-dropdown-toggle" onClick={focusDropdown}>
        Select Facility Type
      </label>
      <div id="facility-dropdown">
        <div {...getButtonProps({
          id: 'facility-dropdown-toggle',
          className: facilityOptionClasses(selectedItem),
          onKeyDown: handleKeyDown,
          tabIndex: 0,
          'aria-expanded': isOpen
        })}>
          {itemToString(selectedItem)}
          <i className="fa fa-chevron-down dropdown-toggle"/>
        </div>
        {isOpen && (<ul className="dropdown" role="listbox">{options}</ul>)}
      </div>
    </div>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
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
        selectedItem={facilityType}>
        {FacilityTypeDropdown}
      </Downshift>
    );
  }
}

export default Wrapper;
