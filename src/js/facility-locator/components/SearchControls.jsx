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
    // TODO: better define shape of query object for facility/service types
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
    this.props.updateSearchQuery({
      facilityType,
    });
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
          <option key="ApplyingForBenefits" value="ApplyingForBenefits">Applying For Benefits</option>,
          <option key="CareerCounseling" value="CareerCounseling">Career Counseling</option>,
          <option key="SchoolAssistance" value="SchoolAssistance">School Assistance</option>,
          <option key="VocationalRehabilitationCareerAssistance" value="VocationalRehabilitationCareerAssistance">Vocational Rehabilitation Career Assistance</option>,
          <option key="TransitionAssistance" value="TransitionAssistance">Transition Assistance</option>,
          <option key="Pre-dischargeAssistance" value="Pre-dischargeAssistance">Pre-discharge Assistance</option>,
          <option key="EmploymentAssistance" value="EmploymentAssistance">Employment Assistance</option>,
          <option key="FinancialCounseling" value="FinancialCounseling">Financial Counseling</option>,
          <option key="HousingAssistance" value="HousingAssistance">Housing Assistance</option>,
          <option key="DisabilityClaimAssistance" value="DisabilityClaimAssistance">Disability Claim Assistance</option>,
          <option key="EducationClaimAssistance" value="EducationClaimAssistance">Education Claim Assistance</option>,
          <option key="InsuranceClaimAssistance" value="InsuranceClaimAssistance">Insurance Claim Assistance</option>,
          <option key="VocationalRehabilitationClaimAssistance" value="VocationalRehabilitationClaimAssistance">Vocational Rehabilitation Claim Assistance</option>,
          <option key="SurvivorClaimAssistance" value="SurvivorClaimAssistance">Survivor Claim Assistance</option>,
          <option key="UpdatingContactInformation" value="UpdatingContactInformation">Updating Contact Information</option>,
          <option key="UpdatingDirectDepositInformation" value="UpdatingDirectDepositInformation">Updating Direct Deposit Information</option>,
          <option key="BurialClaimAssistance" value="BurialClaimAssistance">Burial Claim Assistance</option>,
          <option key="eBenefitsLogonAssistance" value="eBenefitsLogonAssistance">eBenefits Logon Assistance</option>,
          <option key="IntegratedDisabilityEvaluationSystem" value="IntegratedDisabilityEvaluationSystem">Integrated Disability Evaluation System</option>,
          <option key="HomelessAssistance" value="HomelessAssistance">Homeless Assistance</option>,
        ];
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
        return (<span className="flex-center">All Facilities</span>);
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
            <label htmlFor="Street, City, State or Zip">Enter Street, City, State or Zip</label>
            <input ref="searchField" name="streetCityStateZip" type="text" onChange={this.handleQueryChange} value={currentQuery.searchString}/>
          </div>
          <div className="columns medium-3">
            <label htmlFor="facilityType">Select Facility Type</label>
            <div tabIndex="1" className={`facility-dropdown-wrapper ${facilityDropdownActive ? 'active' : ''}`} onClick={this.toggleFacilityDropdown} onBlur={() => {this.setState({ facilityDropdownActive: false });}}>
              {this.renderSelectOptionWithIcon(currentQuery.facilityType)}
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
            <select name="serviceType" onChange={this.handleFilterChange} value={currentQuery.serviceType || ''} disabled={currentQuery.facilityType !== 'benefits'}>
              <option>All</option>
              {this.renderServiceFilterOptions()}
            </select>
          </div>
          <input type="submit" className="columns medium-2" value="Search" onClick={this.handleSearch}/>
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
