import React, { Component } from 'react';
import { kebabCase } from 'lodash/fp';
import classNames from 'classnames';
import Downshift from 'downshift';
import { facilityTypes } from '../config';
import { keyMap } from '../utils/helpers';
import { LOCATION_OPTIONS, LocationType } from '../constants';

const facilityOptionClasses = (item, selected) =>
  classNames(
    'dropdown-option',
    { selected },
    { 'icon-option': item && item !== 'all' },
    { [`${kebabCase(item)}-icon`]: item && item !== 'all' },
  );

const itemToString = item => facilityTypes[item] || 'All Facilities';

class FacilityTypeDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBubble: false,
    };
  }

  // eslint-disable-next-line prettier/prettier
  toggleCCInfo = (e) => {
    e.preventDefault();
    this.setState({
      showBubble: !this.state.showBubble,
    });
  };

  render() {
    const facilityType = this.props.facilityType || 'all';
    const highlightIndex = LOCATION_OPTIONS.indexOf(facilityType);

    return (
      <Downshift
        defaultSelectedItem="all"
        defaultHighlightedIndex={highlightIndex}
        itemToString={itemToString}
        onChange={this.props.onChange}
        selectedItem={facilityType}
      >
        {({
          closeMenu,
          getButtonProps,
          getItemProps,
          highlightedIndex,
          isOpen,
          selectedItem,
        }) => {
          // eslint-disable-next-line prettier/prettier
          const handleKeyDown = (e) => {
            // Allow blurring focus (with TAB) to close dropdown.
            if (e.keyCode === keyMap.TAB && isOpen) {
              closeMenu();
            }
          };

          const options = LOCATION_OPTIONS.map((item, index) => (
            <li
              key={item}
              {...getItemProps({
                item,
                className: facilityOptionClasses(
                  item,
                  index === highlightedIndex,
                ),
                role: 'option',
                'aria-selected': index === highlightedIndex,
              })}
            >
              {itemToString(item)}
            </li>
          ));

          return (
            <div>
              <label
                aria-live="polite"
                aria-relevant="additions"
                htmlFor="facility-dropdown-toggle"
                id="facility-dropdown-label"
              >
                Search for
                {selectedItem === LocationType.CC_PROVIDER && (
                  <span className="cc-info-link-span">
                    <button
                      onClick={this.toggleCCInfo}
                      title="Click for More Information"
                      aria-label="Click for more information about the Community Care Program"
                      rel="noopener noreferrer"
                      target="_blank"
                      className="cc-info-link"
                    >
                      <i className="fa fa-info-circle cc-info-link-icon" />
                    </button>
                  </span>
                )}
                {this.state.showBubble && (
                  <div id="infoBubble">
                    <button
                      className="cc-info-close-btn"
                      type="button"
                      aria-label="Close info bubble"
                      onClick={this.toggleCCInfo}
                    >
                      <i className="fa fa-close" />
                    </button>
                    <h6>What Is Community Care and Am I Eligible?</h6>
                    <p>
                      The Veterans Choice Program is one of several programs
                      through which a Veteran can receive care from a community
                      provider, paid for by the Department of Veterans Affairs.
                      <br />
                      <a
                        href="https://www.va.gov/COMMUNITYCARE/programs/veterans/VCP/index.asp"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Read More
                      </a>
                    </p>
                  </div>
                )}
              </label>
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
        }}
      </Downshift>
    );
  }
}

export default FacilityTypeDropdown;
