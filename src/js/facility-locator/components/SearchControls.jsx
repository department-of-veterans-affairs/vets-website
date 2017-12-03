import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { truncate, kebabCase } from 'lodash';
import { updateSearchQuery } from '../actions';
import React, { Component } from 'react';
import classNames from 'classnames';
import SelectComponent from './SelectComponent';
import { benefitsServices, facilityTypes, vetCenterServices } from '../config';
import {
  getDirection,
  getOtherType,
  getServices,
  isSelect,
  isToggle,
  isTraverse,
  noServices,
  pluralize
} from '../utils/helpers.js';

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
  }

  handleEditSearch = () => {
    this.props.updateSearchQuery({
      active: false,
    });
  }

  handleFilterSelect(newOption, type) {
    const { currentQuery: { facilityType, serviceType } } = this.props; // eslint-disable-line no-unused-vars
    if (type === 'facility') {
      if (['benefits', 'vet_center'].includes(newOption) && newOption === facilityType) {
        this.props.updateSearchQuery({
          facilityType: newOption
        });
      } else {
        this.props.updateSearchQuery({
          facilityType: newOption,
          serviceType: null
        });
      }
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
    const plural = pluralize(type);
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
      return this.focusOption(this[plural][newIndex], newIndex, type);
    }
    return false;
  }

  toggleDropdown = (e, type) => {
    const plural = pluralize(type);
    const titleType = type[0].toUpperCase() + type.slice(1);
    const isActive = this.state[`${type}DropdownActive`];
    const { currentQuery: { facilityType, serviceType } } = this.props; // eslint-disable-line no-unused-vars
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
      const increment = getDirection(e.keyCode);
      const newIndex = this.state[`focused${titleType}Index`] + increment;
      this.focusOption(this[plural][newIndex], newIndex, type);
    }
    this.setState({
      [`${type}DropdownActive`]: !this.state[`${type}DropdownActive`],
      [`${getOtherType(type)}DropdownActive`]: false
    });
  }

  focusOption = (option, index, type) => {
    const titleType = type[0].toUpperCase() + type.slice(1);
    const plural = pluralize(type);
    if (option) {
      option.focus();
    }
    if (this[plural][index]) {
      this.setState({
        [`focused${titleType}Index`]: index
      });
    }
  }

  isSelectedOption = (option, type) => {
    return this.props.currentQuery[type] === option;
  }

  renderSelectOptions = () => {
    const { currentQuery: { facilityType } } = this.props;
    const services = getServices(facilityType, benefitsServices, vetCenterServices);

    return (
      <ul
        className="dropdown"
        role="listbox"
        id="service-list">
        {services && services.map((k, i) => {
          const serviceOptionClasses = classNames({
            'dropdown-option': true,
            'facility-option': true,
            'is-hovered': this.isSelectedOption(k, 'serviceType')
          });
          return (
            <li
              tabIndex={this.serviceDropdownActive ? '1' : '-1'}
              role="option"
              aria-selected={k === facilityType}
              className={serviceOptionClasses}
              key={k}
              value={k}
              ref={ elem => { this.services[i] = elem; }}
              id={k} onClick={() => this.handleFilterSelect(k, 'service')}>
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
      'is-hovered': this.isSelectedOption(facilityType, 'facilityType')
    });
    const facilityIconClasses = classNames({
      legend: true,
      spacer: !facilityType,
      [`${kebabCase(facilityType)}-icon`]: facilityType
    });

    return (
      <li role="option"
        tabIndex={this.state.serviceDropdownActive ? '1' : '-1'}
        aria-selected={this.isSelectedOption((facilityType || 'AllFacilities'), 'facilityType')}
        ref={ elem => { this.facilities[index] = elem; }}
        id={index > -1 ? (facilityType || 'AllFacilities') : null}
        className={facilityOptionClasses}
        onClick={() => this.handleFilterSelect(facilityType, 'filter')}
        onKeyDown={this.navigateFacilityDropdown}>
        <span className="flex-center">
          <span className={facilityIconClasses}></span>{facilityTypes[facilityType] || 'All Facilities'}
        </span>
      </li>
    );
  }

  renderSelectOption(serviceType, isMobile) {
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
    const { facilityDropdownActive } = this.state;
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
      active: this.state.serviceDropdownActive,
      disabled: !['benefits', 'vet_center'].includes(currentQuery.facilityType)
    });
    const facilityDropdownClasses = classNames({
      'facility-dropdown-wrapper': true,
      active: facilityDropdownActive
    });

    return (
      <div className="search-controls-container clearfix">
        <form>
          <div className="columns usa-width-one-third medium-4">
            <label htmlFor="streetCityStateZip" id="facility-label">Enter Street, City, State or Zip</label>
            <input ref="searchField" name="streetCityStateZip" type="text" onChange={this.handleQueryChange} value={currentQuery.searchString} aria-label="Street, City, State or Zip" title="Street, City, State or Zip"/>
          </div>
          <SelectComponent
            optionType="facility"
            selectedType={currentQuery.facilityType}
            setDropdown={elem => this.facilityDropdown = elem} // eslint-disable-line no-return-assign
            toggleDropdown={(e) => this.toggleDropdown(e, 'facility')}
            dropdownClasses={facilityDropdownClasses}
            navigateDropdown={e => this.navigateDropdown(e, 'facility')}
            dropdownActive={this.state.facilityDropdownActive}>
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
          </SelectComponent>
          <SelectComponent
            optionType="service"
            selectedType={currentQuery.serviceType}
            setDropdown={elem => this.serviceDropdown = elem} // eslint-disable-line no-return-assign
            toggleDropdown={(e) => this.toggleDropdown(e, 'service')}
            dropdownClasses={serviceDropdownClasses}
            navigateDropdown={e => this.navigateDropdown(e, 'service')}
            dropdownActive={this.state.serviceDropdownActive}>
            {this.renderSelectOption(currentQuery.serviceType, this.props.isMobile)}
            {this.renderSelectOptions()}
          </SelectComponent>
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
