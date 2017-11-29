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
      facilityDropdownFocused: false,
      serviceDropdownFocused: false,
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
    this.navigateFacilityDropdown = this.navigateFacilityDropdown.bind(this);
    this.navigateServiceDropdown = this.navigateServiceDropdown.bind(this);
    this.toggleFacilityDropdown = this.toggleFacilityDropdown.bind(this);
    this.toggleServiceDropdown = this.toggleServiceDropdown.bind(this);
    this.setFacilityDropdownFocus = this.setFacilityDropdownFocus.bind(this);
    this.setServiceDropdownFocus = this.setServiceDropdownFocus.bind(this);
  }

  setFacilityDropdownFocus(newState) {
    const dropdownState = false ? !this.state.facilityDropdownActive : this.state.facilityDropdownActive;
    this.setState({
      facilityDropdownFocused: newState,
      facilityDropdownActive: dropdownState
    });
  }

  setServiceDropdownFocus(newState) {
    const dropdownState = false ? !this.state.serviceDropdownActive : this.state.serviceDropdownActive;
    this.setState({
      serviceDropdownFocused: newState,
      serviceDropdownActive: dropdownState
    });
  }

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
    if (isEscape(e.keyCode)) {
      return this.toggleFacilityDropdown();
    }
    if (isSelect(e.keyCode)) {
      return this.handleFacilityFilterSelect(which.id);
    }
    if (isTraverse(e.keyCode)) {
      const increment = getDirection(e.keyCode);
      const newIndex = +this.state.focusedFacilityIndex + increment;
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

  // TODO: use onFocus instead 
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

  // TODO: use onFocus instead 
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
      <ul className="dropdown">
        {
          services.map((k, i) => {
            return (<li className={`${this.state.focusedServiceIndex === i ? 'is-hovered' : ''}`} key={k} value={k}>
              <button tabIndex="-1" ref={ elem => { if (i) this.services[i] = elem; }} id={k} type="button" className="facility-option" onClick={this.handleServiceFilterSelect.bind(this, k)}>
                <span className="flex-center">
                  <span className="legend spacer"></span>
                  {benefitsServices[k] || k}
                </span>
              </button>
            </li>);
          })
        }
      </ul>
    );
  }

  renderSelectOptionWithIcon(facilityType, index) {
    if (facilityType) {
      return (
        <button tabIndex="-1" ref={ elem => { if (index > -1) this.facilities[index] = elem; }} id={facilityType} type="button" className="facility-option" onClick={() => this.handleFacilityFilterSelect(facilityType)} onKeyDown={this.navigateFacilityDropdown}>
          <span className="flex-center"><span className={`legend ${kebabCase(facilityType)}-icon`}></span>{facilityTypes[facilityType]}</span>
        </button>
      );
    }

    return (
      <button tabIndex="-1" type="button" className="facility-option">
        <span className="flex-center all-facilities"><span className="legend spacer"></span>All Facilities</span>
      </button>
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
    const { facilityDropdownActive, serviceDropdownActive, facilityDropdownFocused, serviceDropdownFocused } = this.state;

    if (currentQuery.active && isMobile) {
      return (
        <div className="search-controls-container">
          <button className="small-12" onClick={this.handleEditSearch}>
            Edit Search
          </button>
        </div>
      );
    }

    const serviceDropdownClasses = classNames({
      'facility-dropdown-wrapper': true,
      active: serviceDropdownActive,
      'is-focused': serviceDropdownFocused,
      disabled: !['benefits', 'vet_center'].includes(currentQuery.facilityType),
    });

    return (
      <div className="search-controls-container clearfix">
        <form>
          <div className="columns usa-width-one-third medium-4">
            <label htmlFor="streetCityStateZip">Enter Street, City, State or Zip</label>
            <input ref="searchField" name="streetCityStateZip" type="text" onChange={this.handleQueryChange} value={currentQuery.searchString} aria-label="Street, City, State or Zip" title="Street, City, State or Zip"/>
          </div>
          <div className="columns usa-width-one-fourth medium-3">
            <label htmlFor="facilityType">Select Facility Type</label>
            <div ref={ elem => {this.facilityDropdown = elem; }} onFocus={() => this.setFacilityDropdownFocus(true)} id="facilityDropdown" onBlur={() => this.setFacilityDropdownFocus(false)} onKeyDown={this.toggleFacilityDropdown} tabIndex="0" className={`facility-dropdown-wrapper ${facilityDropdownFocused ? 'is-focused' : ''} ${facilityDropdownActive ? 'active' : ''}`} aria-controls="expandable" aria-expanded="false" role="combobox" onClick={this.toggleFacilityDropdown}>
              <div className="flex-center">
                {this.renderSelectOptionWithIcon(currentQuery.facilityType)}
              </div>
              <ul role="listbox" className="dropdown">
                <li className={`${facilityDropdownFocused && !this.state.facilityDropdownActive ? 'is-hovered' : ''}`}>{this.renderSelectOptionWithIcon()}</li>
                <li className={`${this.state.focusedFacilityIndex === 0 ? 'is-hovered' : ''}`}>{this.renderSelectOptionWithIcon('health', 0)}</li>
                <li className={`${this.state.focusedFacilityIndex === 1 ? 'is-hovered' : ''}`}>{this.renderSelectOptionWithIcon('benefits', 1)}</li>
                <li className={`${this.state.focusedFacilityIndex === 2 ? 'is-hovered' : ''}`}>{this.renderSelectOptionWithIcon('cemetery', 2)}</li>
                <li className={`${this.state.focusedFacilityIndex === 3 ? 'is-hovered' : ''}`}>{this.renderSelectOptionWithIcon('vet_center', 3)}</li>
              </ul>
            </div>
          </div>
          <div className="columns usa-width-one-fourth medium-3">
            <label htmlFor="serviceType">Select Service Type</label>
            <div onFocus={() => this.setServiceDropdownFocus(true)} onBlur={() => this.setServiceDropdownFocus(false)} onKeyDown={this.navigateServiceDropdown} className={serviceDropdownClasses} ref={ elem => { this.serviceDropdown = elem; }} tabIndex="0" role="combobox" aria-controls="expandable" aria-expanded="false" onClick={this.toggleServiceDropdown}>
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
