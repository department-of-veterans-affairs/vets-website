// Used for desktop only
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DropDownPanel extends Component {
  componentDidMount() {
    document.body.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleDocumentClick, false);
  }

  handleDocumentClick = event => {
    // If this dropdown is open, and it's not an element within this dropdown being clicked,
    // then the user clicked elsewhere and we should invoke the click handler to toggle this
    // dropdown to closed.
    if (this.props.isOpen && !this.dropdownDiv.contains(event.target)) {
      this.toggleDropDown();
    }
  };

  toggleDropDown = () => {
    this.props.clickHandler();
  };

  render() {
    const { children, isOpen } = this.props;

    return (
      <div
        className="va-dropdown"
        id="va-header-search-container"
        ref={div => {
          this.dropdownDiv = div;
        }}
      >
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
        <button
          aria-controls="search"
          aria-expanded={isOpen}
          className="vads-u-font-size--lg vads-u-margin--0 vads-u-background-color--transparent vads-u-color--primary-darker"
          id="header-search-button"
          onClick={this.toggleDropDown}
          type="button"
        >
          <span>
            <i className="fas fa-solid fa-sm fa-search vads-u-margin-right--0p5" />
            Search
            <i
              className="vads-u-margin-left--1 fas fa-solid fa-caret-down"
              aria-hidden="true"
              hidden={isOpen}
            />
            <i
              className="vads-u-margin-left--1 fas fa-solid fa-caret-up"
              aria-hidden="true"
              hidden={!isOpen}
            />
          </span>
        </button>
        <div
          className="va-header-search-dropdown vads-u-background-color--gray-lightest vads-u-padding--0 vads-u-margin--0 vads-u-margin-left--auto"
          hidden={!isOpen}
        >
          {children}
        </div>
      </div>
    );
  }
}

DropDownPanel.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default DropDownPanel;
