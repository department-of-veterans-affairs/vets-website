import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateSearchQuery } from '../actions';
import React, { Component } from 'react';

class SearchControls extends Component {

  constructor() {
    super();

    this.state = {
      facilityDropdownActive: false,
    };

    this.toggleFacilityDropdown = this.toggleFacilityDropdown.bind(this);
  }

  // TODO (bshyong): generalize to be able to handle Select box changes
  handleQueryChange = (e) => {
    this.props.onChange({
      searchString: e.target.value,
    });
  }

  handleFilterChange = (e) => {
    this.props.updateSearchQuery({
      [e.target.name]: e.target.value,
    });
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

  handleFacilityFilterSelect(facilityType) {
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
  }

  renderServiceFilterOptions() {
    const { currentQuery: { facilityType } } = this.props;

    switch (facilityType) {
      case 'health':
        return [
          <option key="primary_care" value="primary_care">Primary Care</option>,
          <option key="mental_health" value="mental_health">Mental Health</option>,
        ];
      case 'benefits':
        return [
          'ApplyingForBenefits',
          'BurialClaimAssistance',
          'DisabilityClaimAssistance',
          'eBenefitsRegistrationAssistance',
          'EducationAndCareerCounseling',
          'EducationClaimAssistance',
          'FamilyMemberClaimAssistance',
          'HomelessAssistance',
          'VAHomeLoanAssistance',
          'InsuranceClaimAssistanceAndFinancialCounseling',
          'IntegratedDisabilityEvaluationSystemAssistance',
          'PreDischargeClaimAssistance',
          'TransitionAssistance',
          'UpdatingDirectDepositInformation',
          'VocationalRehabilitationAndEmploymentAssistance',
        ].map(e => {
          return (<option key={e} value={e}>
            {e.split(/(?=[A-Z])/).join(' ')}
          </option>);
        });
      default:
        return null;
    }
  }

  renderSelectOptionWithIcon(facilityType) {
    switch (facilityType) {
      case 'health':
        return (<span className="flex-center"><span className="legend health-icon"></span>Health</span>);
      case 'benefits':
        return (<span className="flex-center"><span className="legend benefits-icon"></span>Benefits</span>);
      case 'cemetery':
        return (<span className="flex-center"><span className="legend cemetery-icon"></span>Cemetery</span>);
      default:
        return (<span className="flex-center"><span className="legend spacer"></span>All Facilities</span>);
    }
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

    return (
      <div className="search-controls-container clearfix">
        <form>
          <div className="columns medium-4">
            <label htmlFor="streetCityStateZip">Enter Street, City, State or Zip</label>
            <input ref="searchField" name="streetCityStateZip" type="text" onChange={this.handleQueryChange} value={currentQuery.searchString} aria-label="Street, City, State or Zip" title="Street, City, State or Zip"/>
          </div>
          <div className="columns medium-3">
            <label htmlFor="facilityType">Select Facility Type</label>
            <div tabIndex="1" className={`facility-dropdown-wrapper ${facilityDropdownActive ? 'active' : ''}`} onClick={this.toggleFacilityDropdown}>
              <div className="flex-center">
                {this.renderSelectOptionWithIcon(currentQuery.facilityType)}
              </div>
              <ul className="dropdown">
                <li onClick={this.handleFacilityFilterSelect.bind(this, null)}>{this.renderSelectOptionWithIcon()}</li>
                <li onClick={this.handleFacilityFilterSelect.bind(this, 'health')}>{this.renderSelectOptionWithIcon('health')}</li>
                <li onClick={this.handleFacilityFilterSelect.bind(this, 'benefits')}>{this.renderSelectOptionWithIcon('benefits')}</li>
                <li onClick={this.handleFacilityFilterSelect.bind(this, 'cemetery')}>{this.renderSelectOptionWithIcon('cemetery')}</li>
              </ul>
            </div>
          </div>
          <div className="columns medium-3">
            <label htmlFor="serviceType">Select Service Type</label>
            <select name="serviceType" onChange={this.handleFilterChange} value={currentQuery.serviceType || ''} disabled={currentQuery.facilityType !== 'benefits'} title="serviceType">
              <option>All</option>
              {this.renderServiceFilterOptions()}
            </select>
          </div>
          <div className="columns medium-2">
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
