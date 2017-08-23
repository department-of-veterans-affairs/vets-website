/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { truncate, kebabCase } from 'lodash';
import { updateSearchQuery } from '../actions';
import React, { Component } from 'react';
import classNames from 'classnames';
import { benefitsServices, facilityTypes, vetCenterServices } from '../config';


class SearchControls extends Component {

  constructor() {
    super();

    this.state = {
      facilityDropdownActive: false,
      serviceDropdownActive: false,
    };

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

  handleFilterChange = (e) => {
    const { facilityType } = this.props.currentQuery;

    if (facilityType === 'benefits' && e.target.value === 'All') {
      this.props.updateSearchQuery({
        [e.target.name]: null,
      });
    } else {
      this.props.updateSearchQuery({
        [e.target.name]: e.target.value,
      });
    }
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

  toggleFacilityDropdown() {
    this.setState({
      facilityDropdownActive: !this.state.facilityDropdownActive,
      serviceDropdownActive: false,
    });
  }

  toggleServiceDropdown() {
    const { currentQuery: { facilityType } } = this.props;
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
      return () => {
        this.props.updateSearchQuery({
          facilityType: newFacilityType,
        });
      };
    }
    return () => {
      this.props.updateSearchQuery({
        facilityType: newFacilityType,
        serviceType: null,
      });
    };
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
          services.map(k => {
            return (<li key={k} value={k} onClick={this.handleServiceFilterSelect.bind(this, k)}>
              <button type="button" className="facility-option">
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
        <button type="button" className="facility-option">
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
        <button type="button" className="facility-option">
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
            <div tabIndex="1" className={`facility-dropdown-wrapper ${facilityDropdownActive ? 'active' : ''}`} onClick={this.toggleFacilityDropdown}>
              <div className="flex-center">
                {this.renderSelectOptionWithIcon(currentQuery.facilityType)}
              </div>
              <ul className="dropdown">
                <li onClick={this.handleFacilityFilterSelect()}>{this.renderSelectOptionWithIcon()}</li>
                <li onClick={this.handleFacilityFilterSelect('health')}>{this.renderSelectOptionWithIcon('health')}</li>
                <li onClick={this.handleFacilityFilterSelect('benefits')}>{this.renderSelectOptionWithIcon('benefits')}</li>
                <li onClick={this.handleFacilityFilterSelect('cemetery')}>{this.renderSelectOptionWithIcon('cemetery')}</li>
                <li onClick={this.handleFacilityFilterSelect('vet_center')}>{this.renderSelectOptionWithIcon('vet_center')}</li>
              </ul>
            </div>
          </div>
          <div className="columns usa-width-one-fourth medium-3">
            <label htmlFor="serviceType">Select Service Type</label>
            <div tabIndex="2" className={serviceDropdownClasses} onClick={this.toggleServiceDropdown}>
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
