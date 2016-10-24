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
    const { currentQuery } = this.props;

    if (currentQuery.facilityType === 'va_health_facility') {
      return [
        <option key="primary_care" value="primary_care">Primary Care</option>,
        <option key="mental_health" value="mental_health">Mental Health</option>,
        <option key="more_services" value="more_services" disabled>More services coming soon</option>,
      ];
    }

    return null;
  }

  renderSelectOptionWithIcon(facilityType) {
    switch (facilityType) {
      case 'va_health_facility':
        return (<span><span className="legend fa fa-plus red"></span>Health</span>);
      case 'va_benefits_facility':
        return (<span><span className="legend fa fa-check green"></span>Benefits</span>);
      case 'va_cemetery':
        return (<span><span className="legend fa fa-cemetery blue"></span>Cemetery</span>);
      default:
        return (<span>All Facilities</span>);
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
                <li onClick={this.handleFacilityFilterSelect.bind(this, 'all')}>{this.renderSelectOptionWithIcon()}</li>
                <li onClick={this.handleFacilityFilterSelect.bind(this, 'va_health_facility')}>{this.renderSelectOptionWithIcon('va_health_facility')}</li>
                <li onClick={this.handleFacilityFilterSelect.bind(this, 'va_benefits_facility')}>{this.renderSelectOptionWithIcon('va_benefits_facility')}</li>
                <li onClick={this.handleFacilityFilterSelect.bind(this, 'va_cemetery')}>{this.renderSelectOptionWithIcon('va_cemetery')}</li>
              </ul>
            </div>
          </div>
          <div className="columns medium-3">
            <label htmlFor="serviceType">Select Service Type</label>
            <select name="serviceType" onChange={this.handleFilterChange} value={currentQuery.serviceType} disabled={currentQuery.facilityType !== 'va_benefits_facility'}>
              <option value="all">All</option>
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
