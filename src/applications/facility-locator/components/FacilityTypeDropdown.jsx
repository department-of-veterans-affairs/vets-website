import React, { Component } from 'react';
import classNames from 'classnames';
import Downshift from 'downshift';
import { facilityTypes } from '../config';
import { keyMap } from '../utils/helpers';
import { LOCATION_OPTIONS, LocationType } from '../constants';

const facilityOptionClasses = (item, selected) =>
  classNames('dropdown-option', { selected });

const itemToString = item => facilityTypes[item] || 'All Facilities';

class FacilityTypeDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBubble: false,
    };
  }
  /*
    Below is connected to the CC Provider Tooltip
      -- Requires Design Research per rluu/lhunt
      https://github.com/department-of-veterans-affairs/vets.gov-team/issues/15606#issuecomment-447103739
      -- Commenting out for now as quick fix
      -- Plus side: 508 is 👍

    this.setCCInfoRef = (element) => {
      this.ccInfoIcon = element;
    };
    this.focusCCInfoIcon = () => {
      if (this.ccInfoIcon) {
        if (this.ccInfoCloseBtn) {
          this.ccInfoCloseBtn.blur();
        }
        this.ccInfoIcon.focus();
      }
    };

    this.setCCInfoCloseRef = (element) => {
      this.ccInfoCloseBtn = element;
    };
    this.focusCCInfoCloseBtn = () => {
      if (this.ccInfoCloseBtn) {
        this.ccInfoIcon.blur();
        this.ccInfoCloseBtn.focus();
      }
    };
  }

  componentDidUpdate() {
    // Set focus on the correct element (508)
    if (this.state.showBubble) {
      this.focusCCInfoCloseBtn();
    }
  }

  toggleCCInfo = (e) => {
    e.preventDefault();

    this.setState({
      showBubble: !this.state.showBubble,
    });

    // Refocus the "i" info button
    this.focusCCInfoIcon();
  };
  */

  render() {
    const locationOptions = this.props.showCommunityCares
      ? this.props.locationOptions
      : this.props.locationOptions.filter(
          item => item !== LocationType.CC_PROVIDER,
        );
    const facilityType = this.props.facilityType || 'health';
    const highlightIndex = locationOptions.indexOf(facilityType);

    return (
      <Downshift
        defaultSelectedItem="health"
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
          const handleKeyDown = e => {
            // Allow blurring focus (with TAB) to close dropdown.
            if (e.keyCode === keyMap.TAB && isOpen) {
              closeMenu();
            }
          };

          const options = locationOptions.map((item, index) => (
            <li
              key={item}
              {...getItemProps({
                item,
                className: facilityOptionClasses(
                  item,
                  index === highlightedIndex,
                ),
                option: itemToString(item),
                role: 'option',
                'aria-selected': index === highlightedIndex,
              })}
            >
              {itemToString(item)}
            </li>
          ));

          return (
            <div>
              <div className="row">
                <div className="columns medium-6">
                  <label
                    htmlFor="facility-dropdown-toggle"
                    id="facility-dropdown-label"
                  >
                    Choose a VA facility type
                  </label>
                </div>
              </div>
              <div id="facility-dropdown" className="row">
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
              {/* <div className="columns medium-8">
                {selectedItem === LocationType.CC_PROVIDER && (
                  <span className="cc-info-link-span">
                    <button
                      onClick={this.toggleCCInfo}
                      title="Click for More Information"
                      aria-label="Click for more information about the Community Care Program"
                      className="cc-info-link"
                      ref={this.setCCInfoRef}
                    >
                      <i className="fa fa-info-circle cc-info-link-icon" />
                    </button>
                  </span>
                )}
                {this.state.showBubble && (
                  <div
                    aria-live="polite"
                    aria-relevant="additions"
                    id="infoBubble"
                  >
                    <button
                      className="cc-info-close-btn"
                      type="button"
                      aria-label="Close info bubble"
                      onClick={this.toggleCCInfo}
                      ref={this.setCCInfoCloseRef}
                    >
                      <i className="fas fa-times-circle cc-info-close-btn-icon" />
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
              </div> */}
            </div>
          );
        }}
      </Downshift>
    );
  }
}

FacilityTypeDropdown.defaultProps = {
  locationOptions: LOCATION_OPTIONS,
};

export default FacilityTypeDropdown;
