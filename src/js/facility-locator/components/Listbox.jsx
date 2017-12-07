import React, { Component } from 'react';
import classNames from 'classnames';
import { truncate, kebabCase } from 'lodash';
import { benefitsServices, facilityTypes, vetCenterServices } from '../config';
import { getServices } from '../utils/helpers.js';

const mobileLength = 38; // TODO(ceh): add comment regarding these magic numbers
const notMobileLength = 27;

class Listbox extends Component {

  isSelectedOption = (option, type) => {
    return this.props.currentQuery[type] === option;
  }

  renderSelectOptions = () => {
    const { currentQuery: { facilityType, serviceType } } = this.props;
    const services = getServices(facilityType, benefitsServices, vetCenterServices);
    this.props.resetOptions();
    return (
      <ul
        className="dropdown"
        role={!this.props.isDisabled ? 'listbox' : undefined}
        id="service-list">
        {services && services.map((k, i) => {
          const defaultSelected = !serviceType && k === 'All';
          const isSelected = this.isSelectedOption(k, 'serviceType');
          const isHovered = defaultSelected || isSelected;
          const serviceOptionClasses = classNames({
            'dropdown-option': true,
            'facility-option': true,
            'is-hovered': isHovered
          });

          return (
            <li
              tabIndex={this.props.dropdownActive ? '0' : '-1'}
              role="option"
              aria-selected={isHovered}
              className={serviceOptionClasses}
              key={k}
              value={k}
              ref={(elem) => {this.props.addOptionRef(elem, i);}}
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
    const defaultSelected = !this.props.currentQuery.facilityType && !facilityType;
    const isSelected = this.isSelectedOption((facilityType), 'facilityType');
    const isHovered = isSelected || defaultSelected;
    const facilityOptionClasses = classNames({
      'dropdown-option': true,
      'facility-option': true,
      'is-hovered': isHovered
    });
    const facilityIconClasses = classNames({
      legend: true,
      spacer: !facilityType,
      [`${kebabCase(facilityType)}-icon`]: facilityType
    });

    return (
      <li
        role="option"
        tabIndex={this.props.dropdownActive ? '0' : '-1'}
        aria-selected={isHovered}
        ref={(elem) => { this.props.addOptionRef(elem, index);}}
        id={facilityType || 'AllFacilities'}
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

  renderSelectButtonWithIcon = (facilityType) => {
    const facilityOptionClasses = classNames({
      'dropdown-option': true,
      'facility-option': true
    });
    const facilityIconClasses = classNames({
      legend: true,
      spacer: !facilityType,
      [`${kebabCase(facilityType)}-icon`]: facilityType
    });

    return (
      <div
        id="facilityDropdown"
        className={facilityOptionClasses}
        onKeyDown={this.props.navigateDropdown}>
        <span className="flex-center">
          <span className={facilityIconClasses}></span>
          {facilityTypes[facilityType] || 'All Facilities'}
        </span>
      </div>
    );
  }

  renderSelectOption = (serviceType, isMobile) => {
    const serviceOptionClasses = classNames({
      'dropdown-option': true,
      'facility-option': true
    });
    return (
      <div className="flex-center">
        <div
          id="serviceDropdown"
          className={serviceOptionClasses}>
          <span className="flex-center">
            <span className="legend spacer"></span>
            {truncate((benefitsServices[serviceType] || serviceType || 'All'), { length: (isMobile ? mobileLength : notMobileLength) })}
          </span>
        </div>
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
