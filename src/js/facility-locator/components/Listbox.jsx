import React, { Component } from 'react';
import classNames from 'classnames';
import { truncate, kebabCase } from 'lodash';
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

class Listbox extends Component {
  constructor() {
    super();

    this.state = {
      facilityDropdownActive: false,
      serviceDropdownActive: false,
      focusedFacilityIndex: 0,
      focusedServiceIndex: 0
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

  navigateDropdown = (e) => {
    const type = this.props.optionType;
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
          [`${type}DropdownActive`]: false
        })
      }
    })
  }

  toggleDropdown = (e) => {
    const type = this.props.optionType;
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
      console.log('searching options', this.options);
            console.log('for queryType', queryType)
      const {selection, id} = getSelection(this.options, queryType);
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
    if (this.options[index]) {
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
            'is-hovered': this.props.isSelectedOption(k, 'serviceType')
          });
          console.log('servicerender', k, i, list);

          return (
            <li
              tabIndex={this.props.dropdownActive ? '1' : '-1'}
              role="option"
              aria-selected={k === facilityType}
              className={serviceOptionClasses}
              key={k}
              value={k}
              ref={ elem => { this.props.options[i] = elem; }}
              id={k}
              onClick={() => this.props.handleFilterSelect(k, 'service')}>
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
      'is-hovered': this.props.isSelectedOption(facilityType, 'facilityType')
    });
    const facilityIconClasses = classNames({
      legend: true,
      spacer: !facilityType,
      [`${kebabCase(facilityType)}-icon`]: facilityType
    });
              console.log('facilityrender', facilityType, index);
              console.log('facility render');

    return (
      <li
        role="option"
        tabIndex={this.props.dropdownActive ? '1' : '-1'}
        aria-selected={this.props.isSelectedOption((facilityType || 'AllFacilities'), 'facilityType')}
        ref={ elem => { this.props.options[index] = elem; }}
        id={index > -1 ? (facilityType || 'AllFacilities') : null}
        className={facilityOptionClasses}
        onClick={() => this.props.handleFilterSelect(facilityType, 'facility')}
        onKeyDown={this.props.navigateDropdown}>
        <span className="flex-center">
          <span className={facilityIconClasses}></span>
          {facilityTypes[facilityType] || 'All Facilities'}
        </span>
      </li>
    );
  }

  renderSelectOption = (serviceType, isMobile) => {
    return (
      <div className="flex-center">
        <button
          id="serviceDropdown"
          tabIndex="-1"
          type="button"
          className="facility-option">
          <span className="flex-center">
            <span className="legend spacer"></span>
            {truncate((benefitsServices[serviceType] || serviceType || 'All'), { length: (isMobile ? 38 : 27) })}
          </span>
        </button>
      </div>
    );
  }

  render() {
    const { hasIcons, isMobile } = this.props;
    const { currentQuery: { facilityType, serviceType }} = this.props;
    return (
      <div>
      {hasIcons &&
        <div>
          <div className="flex-center">
            {this.renderSelectOptionWithIcon(facilityType)}
          </div>
          <ul role="listbox" className="dropdown">
            {this.renderSelectOptionWithIcon(null, 0)}
            {this.renderSelectOptionWithIcon('health', 1)}
            {this.renderSelectOptionWithIcon('benefits', 2)}
            {this.renderSelectOptionWithIcon('cemetery', 3)}
            {this.renderSelectOptionWithIcon('vet_center', 4)}
          </ul>
        </div>}
        {!hasIcons &&
          <div>
            {this.renderSelectOption(serviceType, isMobile)}
            {this.renderSelectOptions()}
          </div>}
        </div>
    );
  }
}

export default Listbox;
