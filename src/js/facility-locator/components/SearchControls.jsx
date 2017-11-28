import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { truncate, kebabCase } from 'lodash';
import { updateSearchQuery } from '../actions';
import React, { Component } from 'react';
import classNames from 'classnames';
import { benefitsServices, facilityTypes, vetCenterServices } from '../config';
import { getDirection, getFacility, getService, isTraverse, isEscape, shouldToggle, keyMap, isSelect, resetMenus } from '../utils/helpers.js';

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
    this.resetMenus = this.resetMenus.bind(this);
    this.focusFacilityOption = this.focusFacilityOption.bind(this);
    this.focusServiceOption = this.focusServiceOption.bind(this);
    this.navigateFacilityDropdown = this.navigateFacilityDropdown.bind(this);
    this.navigateServiceDropdown = this.navigateServiceDropdown.bind(this);
    this.toggleFacilityDropdown = this.toggleFacilityDropdown.bind(this);
    this.toggleServiceDropdown = this.toggleServiceDropdown.bind(this);
    this.handleFacilityFilterSelect = this.handleFacilityFilterSelect.bind(this);
  }

  // TODO (bshyong): generalize to be able to handle Select box changes
  handleQueryChange = (e) => {
    this.props.onChange({
      searchString: e.target.value,
    });
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

  handleEditSearch = () => {
    this.props.updateSearchQuery({
      active: false,
    });
  }
  // is there some other focusing to do/state variable to set to style the box properly?
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

  // is there some other focusing to do/state variable to set to style the box properly?
  focusServiceOption(option, index) {
    if (option) {
      option.focus();
    }
    if (this.services[index]) {
      this.setstate({
        focusedServiceIndex: index
      });
    }
  }

  navigateFacilityDropdown(e) {
    const which = e.target;
    // console.log('navigateFacilityDropdown', e.target);
    if (isEscape(e.keyCode)) {
      return this.toggleFacilityDropdown();
    }
    if (isSelect(e.keyCode)) {
      return this.handleFacilityFilterSelect(which.id);
    }
    if (isTraverse(e.keyCode)) {
      // console.log('traversing', e.target);
      const increment = getDirection(e.keyCode);
      // console.log('increment', increment);
      const newIndex = +this.state.focusedFacilityIndex + increment;
      // console.log(this.state.focusedFacilityIndex);
      // console.log('newIndex', newIndex);
      return this.focusFacilityOption(this.facilities[newIndex], newIndex);
    }
    return false;
  }

  navigateServiceDropdown(e) {
    const which = e.target;
    // console.log('navigateServiceDropdown', e.target);
    if (isEscape(e.keyCode)) {
      return this.toggleServiceDropdown();
    }
    if (isSelect(e.keyCode)) {
      return this.handleServiceFilterSelect(which.id);
    }
    if (isTraverse(e.keyCode)) {
      // console.log('traversing', e.target);
      const newIndex = +this.state.focusedServiceIndex - getDirection(e.keyCode);
      // console.log('newIndex', newIndex);
      // console.log(this.state.focusedServiceIndex);
      return this.focusServiceOption(this.services[newIndex], newIndex);
    }
    return false;
  }

  toggleFacilityDropdown(e) {
    // this seems redundant?
    // console.log('toggleFacilityDropdown', e.target);
    // this.resetMenus(e)
    const shouldNotToggle = e.keyCode && !shouldToggle(e.keyCode, this.state.facilityDropdownActive);
    e.preventDefault();
    // to account for mouse events
    if (shouldNotToggle) {
      return;
    }
    if (!this.state.facilityDropdownActive) {
      const selection = getFacility(this.facilities, this.props.currentQuery);
      this.focusFacilityOption(selection);
    }
    this.setState({
      facilityDropdownActive: !this.state.facilityDropdownActive,
      serviceDropdownActive: false,
    });
  }

  toggleServiceDropdown(e) {
    // this seems redundant?
    // this.resetMenus(e)
    // console.log('toggleservdrop', e.target);
    e.preventDefault();
    const { currentQuery: { facilityType } } = this.props;
    const shouldNotToggle = e.keyCode && !shouldToggle(e.keyCode, this.state.serviceDropdownActive);
    if (shouldNotToggle) {
      return;
    }
    if (!this.state.serviceDropdownActive) {
      const selection = getService(this.services, this.props.currentQuery);
      this.focusServiceOption(selection);
    }
    if (['benefits', 'vet_center'].includes(facilityType)) {
      this.setState({
        serviceDropdownActive: !this.state.serviceDropdownActive,
        facilityDropdownActive: false,
      });
    }
  }

  handleFacilityFilterSelect(newFacilityType) {
    const { currentQuery: { facilityType } } = this.props;
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

  resetMenus(e) {
    const tabbedAway = keyMap.TAB === e.keyCode;
    if (!tabbedAway) return;
    e.preventDefault();
    const { facilityDropdownActive, serviceDropdownActive } = this.state;
    const formsToReset = resetMenus(facilityDropdownActive, serviceDropdownActive);
    if (formsToReset && formsToReset.includes('facility')) {
      this.toggleFacilityDropdown(e);
    }
    if (formsToReset && formsToReset.includes('service')) {
      this.toggleServiceDropdown(e);
    }
  }

  renderServiceFilterOptions() {
    const { currentQuery: { facilityType } } = this.props;
    let services;

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
              <button ref={ elem => { this.services[i] = elem; }} onKeyUp={this.navigateServiceDropdown} id={k} type="button" className="facility-option" onClick={this.handleServiceFilterSelect.bind(this, k)}>
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

  renderSelectOptionWithIcon(facilityType) {
    if (facilityType) {
      return (
        <button ref={ elem => { this.facilities.push(elem); }} id={facilityType} type="button" className="facility-option" onClick={() => this.handleFacilityFilterSelect(facilityType)} onKeyUp={this.navigateFacilityDropdown}>
          <span className="flex-center"><span className={`legend ${kebabCase(facilityType)}-icon`}></span>{facilityTypes[facilityType]}</span>
        </button>
      );
    }

    return (
      <button type="button" className="facility-option">
        <span className="flex-center all-facilities"><span className="legend spacer"></span>All Facilities</span>
      </button>
    );
  }

  renderServiceSelectOption(serviceType) {
    const { isMobile } = this.props;

    return (
      <div className="flex-center">
        <button id="serviceDropdown" type="button" className="facility-option">
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
    const { facilityDropdownActive, serviceDropdownActive, serviceDropdownFocused } = this.state;

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
          <div className="columns usa-width-one-third medium-4" >
            <label htmlFor="streetCityStateZip">Enter Street, City, State or Zip</label>
            <input ref="searchField" name="streetCityStateZip" type="text" onChange={this.handleQueryChange} value={currentQuery.searchString} aria-label="Street, City, State or Zip" title="Street, City, State or Zip"/>
          </div>
          <div className="columns usa-width-one-fourth medium-3">
            <label htmlFor="facilityType">Select Facility Type</label>
            <div onKeyUp={this.toggleFacilityDropdown} tabIndex="0" className={`facility-dropdown-wrapper ${this.state.facilityDropdownFocused ? 'is-focused' : ''} ${facilityDropdownActive ? 'active' : ''}`} aria-controls="expandable" aria-expanded="false" role="combobox" onClick={this.toggleFacilityDropdown}>
              <div className="flex-center">
                {this.renderSelectOptionWithIcon(currentQuery.facilityType)}
              </div>
              <ul role="listbox" className="dropdown">
                <li className={`${this.state.facilityDropdownFocused && !this.state.facilityDropdownActive ? 'is-hovered' : ''}`}>{this.renderSelectOptionWithIcon()}</li>
                <li className={`${this.state.focusedFacilityIndex === 0 ? 'is-hovered' : ''}`}>{this.renderSelectOptionWithIcon('health')}</li>
                <li className={`${this.state.focusedFacilityIndex === 1 ? 'is-hovered' : ''}`}>{this.renderSelectOptionWithIcon('benefits')}</li>
                <li className={`${this.state.focusedFacilityIndex === 2 ? 'is-hovered' : ''}`}>{this.renderSelectOptionWithIcon('cemetery')}</li>
                <li className={`${this.state.focusedFacilityIndex === 3 ? 'is-hovered' : ''}`}>{this.renderSelectOptionWithIcon('vet_center')}</li>
              </ul>
            </div>
          </div>
          <div className="columns usa-width-one-fourth medium-3">
            <label htmlFor="serviceType">Select Service Type</label>
            <div onKeyUp={this.toggleServiceDropdown} className={serviceDropdownClasses} ref="serviceDropdown" tabIndex="0" role="combobox" aria-controls="expandable" aria-expanded="false" onClick={this.toggleServiceDropdown}>
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
