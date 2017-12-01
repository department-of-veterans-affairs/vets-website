import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { truncate, kebabCase } from 'lodash';
import { updateSearchQuery } from '../actions';
import React, { Component } from 'react';
import classNames from 'classnames';
import { benefitsServices, facilityTypes, vetCenterServices } from '../config';
import { getDirection, getSelection, isTraverse, isEscape, isSpace, shouldToggle, isSelect } from '../utils/helpers.js';

class SearchControls extends Component {

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
    this.focusFacilityOption = this.focusFacilityOption.bind(this);
    this.focusServiceOption = this.focusServiceOption.bind(this);
    this.goToFacilityDropdown = this.goToFacilityDropdown(this);
    this.handleFacilityFilterSelect = this.handleFacilityFilterSelect.bind(this);
    this.handleServiceFilterSelect = this.handleServiceFilterSelect.bind(this);
    this.isSelectedFacility = this.isSelectedFacility.bind(this);
    this.isFocusedFacilityIndex = this.isFocusedFacilityIndex.bind(this);
    this.navigateFacilityDropdown = this.navigateFacilityDropdown.bind(this);
    this.navigateServiceDropdown = this.navigateServiceDropdown.bind(this);
    this.toggleFacilityDropdown = this.toggleFacilityDropdown.bind(this);
    this.toggleServiceDropdown = this.toggleServiceDropdown.bind(this);
  }

  // TODO(ceh): arrowize to make consistent
  goToFacilityDropdown() {
    if (this.facilityDropdown) {
      this.facilityDropdown.focus();
    }
  }

  handleEditSearch = () => {
    this.props.updateSearchQuery({
      active: false,
    });
  }

  handleFacilityFilterSelect(newFacilityType) {
    const { currentQuery: { facilityType } } = this.props;
    this.toggleFacilityDropdown();
    if (['benefits', 'vet_center'].includes(newFacilityType) &&
      newFacilityType === facilityType) {
      return this.props.updateSearchQuery({
        facilityType: newFacilityType,
      });
    }
    return this.props.updateSearchQuery({
      facilityType: newFacilityType,
      serviceType: null,
    });
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

  handleServiceFilterSelect(serviceType) {
    if (serviceType === 'All') {
      this.props.updateSearchQuery({
        serviceType: null,
      });
    } else {
      this.props.updateSearchQuery({
        serviceType,
      });
    }
  }

  navigateFacilityDropdown(e) {
    const which = e.target;
    const facilityType = which.id === 'AllFacilities' ? null : which.id;
    if (isEscape(e.keyCode)) {
      return this.toggleFacilityDropdown();
    }
    if (isSelect(e.keyCode)) {
      return this.handleFacilityFilterSelect(facilityType);
    }
    if (isTraverse(e.keyCode)) {
      const increment = getDirection(e.keyCode);
      const newIndex = this.state.focusedFacilityIndex + increment;
      return this.focusFacilityOption(this.facilities[newIndex], newIndex);
    }
    return false;
  }

  navigateServiceDropdown(e) {
    const which = e.target;
    if (isEscape(e.keyCode) || isSpace(e.keyCode)) {
      return this.toggleServiceDropdown(e);
    }
    if (isSelect(e.keyCode)) {
      if (!this.state.serviceDropdownActive) return this.toggleServiceDropdown(e);
      return this.handleServiceFilterSelect(which.id);
    }
    if (isTraverse(e.keyCode)) {
      if (!this.state.serviceDropdownActive) return this.toggleServiceDropdown(e);
      const increment = getDirection(e.keyCode);
      const newIndex = +this.state.focusedServiceIndex + increment;
      return this.focusServiceOption(this.services[newIndex], newIndex);
    }
    return false;
  }

  toggleFacilityDropdown(e) {
    if (e) {
      const shouldNotToggle = e.keyCode && !shouldToggle(e, this.state.facilityDropdownActive);
      if (shouldNotToggle) return true;
    }
    const isActive = this.state.facilityDropdownActive;
    const selection = getSelection(this.facilities, this.props.currentQuery, 'facilityType');
    if (isActive) {
      this.facilityDropdown.focus();
    } else {
      this.focusFacilityOption(selection.selection, selection.id);
    }
    return this.setState({
      facilityDropdownActive: !this.state.facilityDropdownActive,
      serviceDropdownActive: false
    });
  }

  toggleServiceDropdown(e) {
    const { currentQuery: { facilityType } } = this.props;
    const noServices = !['benefits', 'vet_center'].includes(facilityType);
    if (noServices) return;
    if (e) {
      const shouldNotToggle = e.keyCode && !shouldToggle(e, this.state.serviceDropdownActive);
      if (shouldNotToggle) return;
    }
    const isActive = this.state.serviceDropdownActive;
    const selection = getSelection(this.services, this.props.currentQuery, 'serviceType');
    if (isActive) {
      this.serviceDropdown.focus();
    } else {
      this.focusServiceOption(selection.selection, selection.id);
    }
    this.setState({
      serviceDropdownActive: !this.state.serviceDropdownActive,
      facilityDropdownActive: false
    });
  }

  focusFacilityOption(option, index) {
    if (option) {
      option.focus();
    }
    if (this.facilities[index]) {
      this.setState({
        focusedFacilityIndex: index
      });
    }
  }

  focusServiceOption(option, index) {
    if (option) {
      option.focus();
    }
    if (this.services[index]) {
      this.setState({
        focusedServiceIndex: index
      });
    }
  }

  isSelectedFacility(facilityType) {
    return this.props.currentQuery.facilityType === facilityType;
  }

  isFocusedFacilityIndex(facilityIndex) {
    return this.state.focusedFacilityIndex === facilityIndex;
  }

  renderServiceFilterOptions() {
    const { currentQuery: { facilityType } } = this.props;
    let services;
    this.services = [];
    switch (facilityType) {
      case 'benefits':
        services = Object.keys(benefitsServices);
        break;
      case 'vet_center':
        services = ['All', ...vetCenterServices];
        break;
      default:
        return null;
    }

    return (
      <ul
        className="dropdown"
        role="listbox"
        id="service-list">
        {services.map((k, i) => {
          const serviceOptionClasses = classNames({
            'dropdown-option': true,
            'facility-option': true,
            'is-hovered': this.isFocusedFacilityIndex(i)
          });
          return (
            <li
              tabIndex={this.serviceDropdownActive ? '1' : '-1'}
              role="option"
              aria-selected={k === facilityType} className={serviceOptionClasses}
              key={k}
              value={k}
              ref={ elem => { this.services[i] = elem; }}
              id={k} onClick={this.handleServiceFilterSelect.bind(this, k)}>
              <span className="flex-center">
                <span className="legend spacer"></span>
                {benefitsServices[k] || k}
              </span>
            </li>
          );
        })
        }
      </ul>
    );
  }

  renderSelectOptionWithIcon(facilityType, index) {
    const facilityOptionClasses = classNames({
      'dropdown-option': true,
      'facility-option': true,
      'is-hovered': this.isFocusedFacilityIndex(index)
    });
    const facilityIconClasses = classNames({
      legend: true,
      spacer: !facilityType,
      [`${kebabCase(facilityType)}-icon`]: facilityType
    });

    return (
      <li role="option"
        tabIndex={this.serviceDropdownActive ? '1' : '-1'}
        aria-selected={this.isSelectedFacility('AllFacilities')}
        ref={ elem => { this.facilities[index] = elem; }}
        id={index > -1 ? (facilityType || 'AllFacilities') : null}
        className={facilityOptionClasses}
        onClick={() => this.handleFacilityFilterSelect(facilityType)}
        onKeyDown={this.navigateFacilityDropdown}>
        <span className="flex-center">
          <span className={facilityIconClasses}></span>{facilityTypes[facilityType] || 'All Facilities'}
        </span>
      </li>
    );
  }

  renderServiceSelectOption(serviceType) {
    const { isMobile } = this.props;

    return (
      <div className="flex-center">
        <button id="serviceDropdown" tabIndex="-1" type="button" className="facility-option">
          <span className="flex-center">
            <span className="legend spacer"></span>
            {truncate((benefitsServices[serviceType] || serviceType || 'All'), { length: (isMobile ? 38 : 27) })}
          </span>
        </button>
      </div>
    );
  }

  render() {
    const { currentQuery, isMobile } = this.props;
    const { facilityDropdownActive, serviceDropdownActive } = this.state;
    const facilityType = this.props.currentQuery.facilityType || 'AllFacilities';
    const serviceType = this.props.currentQuery.serviceType || 'All';
    if (currentQuery.active && isMobile) {
      return (
        <div className="search-controls-container">
          <button className="small-12" onClick={this.handleEditSearch}>
            Edit Search
          </button>
        </div>
      );
    }

    const facilityDropdownClasses = classNames({
      'facility-dropdown-wrapper': true,
      active: facilityDropdownActive
    });
    const serviceDropdownClasses = classNames({
      'facility-dropdown-wrapper': true,
      active: serviceDropdownActive,
      disabled: !['benefits', 'vet_center'].includes(currentQuery.facilityType)
    });

    return (
      <div className="search-controls-container clearfix">
        <form>
          <div className="columns usa-width-one-third medium-4">
            <label htmlFor="streetCityStateZip" id="facility-label">Enter Street, City, State or Zip</label>
            <input ref="searchField" name="streetCityStateZip" type="text" onChange={this.handleQueryChange} value={currentQuery.searchString} aria-label="Street, City, State or Zip" title="Street, City, State or Zip"/>
          </div>
          <div className="columns usa-width-one-fourth medium-3">
            <label htmlFor="facilityType">Select Facility Type</label>
            <div
              ref={ elem => {this.facilityDropdown = elem; }}
              id="facility-list"
              onKeyDown={this.toggleFacilityDropdown}
              tabIndex="0"
              className={facilityDropdownClasses}
              aria-autocomplete="none"
              aria-owns="facility-list"
              aria-controls="expandable"
              aria-expanded="false"
              aria-labelledby="facility-label"
              aria-required="false"
              aria-activedescendant={facilityType}
              role="combobox"
              onClick={this.toggleFacilityDropdown}>
              <div className="flex-center">
                {this.renderSelectOptionWithIcon(currentQuery.facilityType)}
              </div>
              <ul role="listbox" className="dropdown">
                {this.renderSelectOptionWithIcon(null, 0)}
                {this.renderSelectOptionWithIcon('health', 1)}
                {this.renderSelectOptionWithIcon('benefits', 2)}
                {this.renderSelectOptionWithIcon('cemetery', 3)}
                {this.renderSelectOptionWithIcon('vet_center', 4)}
              </ul>
            </div>
          </div>
          <div className="columns usa-width-one-fourth medium-3">
            <label htmlFor="serviceType" id="service-label">Select Service Type</label>
            <div
              onKeyDown={this.navigateServiceDropdown}
              className={serviceDropdownClasses}
              ref={ elem => { this.serviceDropdown = elem; }}
              tabIndex="0"
              role="combobox"
              aria-controls="expandable"
              aria-expanded="false"
              aria-labelledby="service-label"
              aria-required="false"
              aria-activedescendant={serviceType}
              onClick={this.toggleServiceDropdown}>
              <div className="flex-center">
                {this.renderServiceSelectOption(currentQuery.serviceType)}
              </div>
              {this.renderServiceFilterOptions()}
            </div>
          </div>
          <div className="columns usa-width-one-sixth medium-2">
            <input type="submit" value="Search" onClick={this.handleSearch}/>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSearchQuery,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchControls);
