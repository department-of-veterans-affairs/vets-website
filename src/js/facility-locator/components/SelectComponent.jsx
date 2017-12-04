import React, { Component } from 'react';
import classNames from 'classnames';
import { benefitsServices, facilityTypes, vetCenterServices } from '../config';
import {
  getDirection,
  getOtherType,
  getSelection,
  getServices,
  shouldToggle,
  isSelect,
  isToggle,
  isTraverse,
  noServices
} from '../utils/helpers.js';

class SelectComponent extends Component {
  constructor() {
    super();

    this.state = {
      facilityDropdownActive: false,
      serviceDropdownActive: false,
      focusedFacilityIndex: 0,
      focusedServiceIndex: 0
    };
    this.services = [];
    this.facilities = [];
  }

  handleEditSearch = () => {
    this.props.updateSearchQuery({
      active: false,
    });
  }

  handleFilterSelect(newOption, type) {
    const { currentQuery: { facilityType, serviceType } } = this.props; // eslint-disable-line no-unused-vars
    if (type === 'facility' && newOption !== facilityType) {
      this.props.updateSearchQuery({
        facilityType: newOption,
        serviceType: null
      });
      this.setState({
        focusedServiceIndex: null
      });
    }
    if (type === 'service') {
      if (newOption === 'All') {
        this.props.updateSearchQuery({
          serviceType: null,
        });
      } else {
        this.props.updateSearchQuery({
          serviceType: newOption
        });
      }
    }
    return this.toggleDropdown(null, type);
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
    window.dataLayer.push({
      event: 'fl-search',
      'fl-search-fac-type': facilityType
    });

    onSearch();
  }

  navigateDropdown = (e, type) => {
    const titleType = type[0].toUpperCase() + type.slice(1);
    const isActive = this.state[`${type}DropdownActive`];
    const which = e.target;
    if (isToggle(e, isActive)) {
      if (isActive && isSelect(e.keyCode)) {
        this.handleFilterSelect(which.id, type);
      }
      return this.toggleDropdown(e, type);
    }
    if (isActive && isTraverse(e)) {
      const increment = getDirection(e.keyCode);
      const newIndex = this.state[`focused${titleType}Index`] + increment;
      return this.focusOption(this.props.refs[newIndex], newIndex, type);
    }
    return false;
  }

  toggleDropdown = (e, type) => {
    const titleType = type[0].toUpperCase() + type.slice(1);
    const isActive = this.state[`${type}DropdownActive`];
    const { currentQuery: { facilityType, serviceType } } = this.props; // eslint-disable-line no-unused-vars
    const queryType = type === 'service' ? serviceType : facilityType;
    if (type === 'service' && noServices(type, facilityType)) {
      return;
    }
    // To handle unrelated key events
    if (e) {
      const shouldNotToggle = e.keyCode && !isToggle(e, isActive);
      if (shouldNotToggle) return;
    }
    if (isActive) {
      this[`${type}Dropdown`].focus();
    } else {
      console.log('searching refs', this.props.refs);
            console.log('for queryType', queryType)
      const {selection, id} = getSelection(this.props.refs, queryType);
      console.log('setting focus on selection', selection);
            console.log('setting focus on selection id', id);
      this.focusOption(selection, id, type);
    }
    this.setState({
      [`${type}DropdownActive`]: !this.state[`${type}DropdownActive`],
      [`${getOtherType(type)}DropdownActive`]: false
    });
  }

  focusOption = (option, index, type) => {
    const titleType = type[0].toUpperCase() + type.slice(1);
    if (option) {
      option.focus();
    }
    if (this.props.refs[index]) {
      this.setState({
        [`focused${titleType}Index`]: index
      });
    }
  }

  isSelectedOption = (option, type) => {
    return this.props.currentQuery[type] === option;
  }

  render() {
    const { optionType } = this.props;
    const { currentQuery: { facilityType, serviceType }} = this.props;
    let queryType = optionType === 'service' ? serviceType : facilityType;
    queryType = queryType || 'All';
    console.log('refs', this.props.refs);
    const titleType = optionType[0].toUpperCase() + optionType.slice(1);
    const dropdownClasses = classNames({
      'facility-dropdown-wrapper': true,
      active: this.state[`${optionType}DropdownActive`],
      disabled: optionType === 'service' && !['benefits', 'vet_center'].includes(facilityType)
    });
    return (
      <div className="columns usa-width-one-fourth medium-3">
        <label htmlFor={`${optionType}Type`} id={`${optionType}-label`}>{`Select ${titleType} Type`}</label>
        <div
          onKeyDown={e => this.navigateDropdown(e, optionType)}
          className={dropdownClasses}
          ref={elem => this[`${optionType}Dropdown`] = elem}
          tabIndex="0"
          role="combobox"
          aria-controls="expandable"
          aria-expanded="false"
          aria-labelledby={`${optionType}-label`}
          aria-required="false"
          aria-activedescendant={queryType}
          onClick={this.toggleDropdown}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default SelectComponent;
