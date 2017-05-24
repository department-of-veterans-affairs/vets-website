import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { truncate } from 'lodash';
import { updateSearchQuery } from '../actions';
import React, { Component } from 'react';
import { benefitsServices } from '../config';

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
    const { facilityType } = this.props.currentQuery;

    if (facilityType === 'benefits' && serviceType === 'All') {
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
    });
  }

  toggleServiceDropdown() {
    const { currentQuery: { facilityType } } = this.props;
    if (facilityType === 'benefits') {
      this.setState({
        serviceDropdownActive: !this.state.serviceDropdownActive,
      });
    }
  }

  handleFacilityFilterSelect(facilityType) {
    return () => {
      if (facilityType === 'benefits') {
        this.props.updateSearchQuery({
          facilityType,
        });
      } else {
        this.props.updateSearchQuery({
          facilityType,
          serviceType: null,
        });
      }
    };
  }

  renderServiceFilterOptions() {
    const { currentQuery: { facilityType } } = this.props;

    switch (facilityType) {
      case 'benefits':
        return (
          <ul className="dropdown">
            {
              Object.keys(benefitsServices).map(k => {
                return (<li key={k} value={k} onClick={this.handleServiceFilterSelect.bind(this, k)}>
                  {benefitsServices[k]}
                </li>);
              })
            }
          </ul>
        );
      default:
        return null;
    }
  }

  renderSelectOptionWithIcon(facilityType) {
    switch (facilityType) {
      case 'health':
        return (
          <button type="button" className="facility-option">
            <span className="flex-center"><span className="legend health-icon"></span>Health</span>
          </button>
        );
      case 'benefits':
        return (
          <button type="button" className="facility-option">
            <span className="flex-center"><span className="legend benefits-icon"></span>Benefits</span>
          </button>
        );
      case 'cemetery':
        return (
          <button type="button" className="facility-option">
            <span className="flex-center"><span className="legend cemetery-icon"></span>Cemetery</span>
          </button>
        );
      default:
        return (
          <button type="button" className="facility-option">
            <span className="flex-center all-facilities"><span className="legend spacer"></span>All Facilities</span>
          </button>
        );
    }
  }

  renderServiceSelectOption(serviceType) {
    const { isMobile } = this.props;

    return (
      <span className="flex-center">{truncate((benefitsServices[serviceType] || 'All'), { length: (isMobile ? 38 : 27) })}</span>
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
              </ul>
            </div>
          </div>
          <div className="columns usa-width-one-fourth medium-3">
            <label htmlFor="serviceType">Select Service Type</label>
            <div tabIndex="2" className={`facility-dropdown-wrapper ${serviceDropdownActive ? 'active' : ''} ${currentQuery.facilityType === 'benefits' ? '' : 'disabled'}`} onClick={this.toggleServiceDropdown}>
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
