import React, { Component } from 'react';
import classNames from 'classnames';
import { truncate, kebabCase } from 'lodash';
import Listbox from './Listbox';
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

class Select extends Component {
  constructor() {
    super();

    this.state = {
      dropdownActive: false,
      focusedIndex: 0
    };
    this.options = [];
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
    }
    if (type === 'service' && newOption !== serviceType) {
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

  navigateDropdown = (e) => {
    const type = this.props.optionType;
    const titleType = type[0].toUpperCase() + type.slice(1);
    const isActive = this.state.dropdownActive;
    const which = e.target;
    if (isToggle(e, isActive)) {
      if (isActive && isSelect(e.keyCode)) {
        this.handleFilterSelect(which.id, type);
      }
      return this.toggleDropdown(e, type);
    }
    if (isActive && isTraverse(e)) {
      const increment = getDirection(e.keyCode);
      const newIndex = this.state.focusedIndex + increment;
      return this.focusOption(this.options[newIndex], newIndex, type);
    }
    return false;
  }

  handleBlur = (e) => {
    const type = this.props.optionType;
    const { currentTarget } = e;
    setTimeout( () => {
      if(!currentTarget.contains(document.activeElement)){
        this.setState({
          dropdownActive: false
        })
      }
    })
  }

  toggleDropdown = (e) => {
    const type = this.props.optionType;
    const titleType = type[0].toUpperCase() + type.slice(1);
    const isActive = this.state.dropdownActive;
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
      this.dropdown.focus();
    } else {
      console.log('searching options', this.options);
            console.log('for queryType', queryType)
      const {selection, id} = getSelection(this.options, queryType);
      console.log('setting focus on selection', selection);
            console.log('setting focus on selection id', id);
      this.focusOption(selection, id, type);
    }
    this.setState({
      dropdownActive: !this.state.dropdownActive
    });
  }

  focusOption = (option, index, type) => {
    const titleType = type[0].toUpperCase() + type.slice(1);
    if (option) {
      option.focus();
    }
    if (this.options[index]) {
      this.setState({
        focusedIndex: index
      });
    }
  }

  isSelectedOption = (option, type) => {
    return this.props.currentQuery[type] === option;
  }

  renderSelectOptions = () => {
    const { currentQuery: { facilityType } } = this.props;
    const services = getServices(facilityType, benefitsServices, vetCenterServices);
    console.log('service render');
    console.log('options', this.options);
    return (
      <ul
        className="dropdown"
        role="listbox"
        id="service-list">
        {services && services.map((k, i, list) => {
          const serviceOptionClasses = classNames({
            'dropdown-option': true,
            'facility-option': true,
            'is-hovered': this.isSelectedOption(k, 'serviceType')
          });
          console.log('servicerender', k, i, list);

          return (
            <li
              tabIndex={this.serviceDropdownActive ? '1' : '-1'}
              role="option"
              aria-selected={k === facilityType}
              className={serviceOptionClasses}
              key={k}
              value={k}
              ref={ elem => { this.options[i] = elem; }}
              id={k}
              onClick={() => this.handleFilterSelect(k, 'service')}>
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

  renderSelectOptionWithIcon = (facilityType, index) => {
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
              console.log('facilityrender', facilityType, index);
              console.log('facility render');

    return (
      <li role="option"
        tabIndex={this.state.serviceDropdownActive ? '1' : '-1'}
        aria-selected={this.isSelectedOption((facilityType || 'AllFacilities'), 'facilityType')}
        ref={ elem => { this.options[index] = elem; }}
        id={index > -1 ? (facilityType || 'AllFacilities') : null}
        className={facilityOptionClasses}
        onClick={() => this.handleFilterSelect(facilityType, 'facility')}
        onKeyDown={this.navigateFacilityDropdown}>
        <span className="flex-center">
          <span className={facilityIconClasses}></span>{facilityTypes[facilityType] || 'All Facilities'}
        </span>
      </li>
    );
  }

  renderSelectOption = (serviceType, isMobile) => {
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
    const { optionType, currentQuery, isMobile, hasIcons } = this.props;
    const { facilityType, serviceType } = currentQuery;
    let queryType = optionType === 'service' ? serviceType : facilityType;
    queryType = queryType || 'All';
    console.log('options', this.options);
    const titleType = optionType[0].toUpperCase() + optionType.slice(1);
    const dropdownClasses = classNames({
      'facility-dropdown-wrapper': true,
      active: this.state.dropdownActive,
      disabled: optionType === 'service' && !['benefits', 'vet_center'].includes(facilityType)
    });
    return (
      <div onBlur={this.handleBlur} className="columns usa-width-one-fourth medium-3">
        <label htmlFor={`${optionType}Type`} id={`${optionType}-label`}>{`Select ${titleType} Type`}</label>
        <div
          onKeyDown={e => this.navigateDropdown(e, optionType)}
          className={dropdownClasses}
          ref={elem => this.dropdown = elem}
          tabIndex="0"
          role="combobox"
          aria-controls="expandable"
          aria-expanded="false"
          aria-labelledby={`${optionType}-label`}
          aria-required="false"
          aria-activedescendant={queryType}
          onClick={this.toggleDropdown}>
          <Listbox
            optionType={optionType}
            currentQuery={currentQuery}
            isMobile={isMobile}
            navigateDropdown={this.navigateDropdown}
            handleFilterSelect={this.handleFilterSelect}
            options={this.options}
            isSelectedOption={this.isSelectedOption}
            dropdownActive={this.dropdownActive}
            hasIcons={hasIcons}
          />
        </div>
      </div>
    );
  }
}

export default Select;
