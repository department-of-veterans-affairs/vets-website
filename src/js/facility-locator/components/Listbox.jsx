import React, { Component } from 'react';
import classNames from 'classnames';
import { truncate, kebabCase } from 'lodash';
import { benefitsServices, facilityTypes, vetCenterServices } from '../config';
import { getServices } from '../utils/helpers.js';

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

  isSelectedOption = (option, type) => {
    return this.props.currentQuery[type] === option;
  }

  renderSelectOptions = () => {
    const { currentQuery: { facilityType } } = this.props;
    const services = getServices(facilityType, benefitsServices, vetCenterServices);
    return (
      <ul
        className="dropdown"
        role={!this.props.isDisabled ? 'listbox' : undefined}
        id="service-list">
        {services && services.map((k, i) => {
          const serviceOptionClasses = classNames({
            'dropdown-option': true,
            'facility-option': true,
            'is-hovered': this.isSelectedOption(k, 'serviceType')
          });

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
      'is-hovered': this.isSelectedOption(facilityType, 'facilityType')
    });
    const facilityIconClasses = classNames({
      legend: true,
      spacer: !facilityType,
      [`${kebabCase(facilityType)}-icon`]: facilityType
    });

    return (
      <li
        role="option"
        tabIndex={this.props.dropdownActive ? '1' : '-1'}
        aria-selected={this.isSelectedOption((facilityType || 'AllFacilities'), 'facilityType')}
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

  renderSelectButtonWithIcon = (facilityType, index) => {
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
      <div
        tabIndex={this.props.dropdownActive ? '1' : '-1'}
        ref={ elem => { this.props.options[index] = elem; }}
        id={index > -1 ? (facilityType || 'AllFacilities') : null}
        className={facilityOptionClasses}
        onClick={() => this.props.handleFilterSelect(facilityType, 'facility')}
        onKeyDown={this.props.navigateDropdown}>
        <span className="flex-center">
          <span className={facilityIconClasses}></span>
          {facilityTypes[facilityType] || 'All Facilities'}
        </span>
      </div>
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
    const { hasIcons, isMobile, isDisabled } = this.props;
    const { currentQuery: { facilityType, serviceType } } = this.props;
    return (
      <div>
        {hasIcons &&
          <div>
            <div className="flex-center">
              {this.renderSelectButtonWithIcon(facilityType)}
            </div>
            <ul
              role={!isDisabled ? 'listbox' : undefined}
              className="dropdown">
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
