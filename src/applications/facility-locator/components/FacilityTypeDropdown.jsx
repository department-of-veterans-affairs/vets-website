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
  let showBubble = false;
  
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
      <label htmlFor="facility-dropdown-toggle" id="facility-dropdown-label">
        Search for
        { selectedItem === LocationType.CC_PROVIDER &&
        <span className="cc-info-link-span">
          <a onClick={ e => { e.preventDefault(); showBubble = !showBubble;} } href="{null}" title="Click for More Information" rel="noopener noreferrer" target="_blank" className="cc-info-link"><i className="fa fa-info-circle cc-info-link-icon"/></a>
        </span>
        }
        { showBubble &&
          <div id="infoBubble">
            <span>X</span>
            <h6>What Is Community Care and Am I Eligible?</h6>
            <p>The Veterans Choice Program is one of several programs through which a Veteran can receive care from a community provider, paid for by the Department of Veterans Affairs. <a href="https://www.va.gov/COMMUNITYCARE/programs/veterans/VCP/index.asp" target="_blank">Read More</a></p>
          </div>
        }

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
      {/*
      { selectedItem === LocationType.CC_PROVIDER &&
        <div className="pull-left">
          <a href="https://www.va.gov/COMMUNITYCARE/programs/veterans/VCP/index.asp"
            rel="noopener noreferrer" target="_blank" className="cc-info-link">
            What's Community Care and am I eligible?
          </a>
        </div>
      }
    */}
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
