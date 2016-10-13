import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateSearchQuery } from '../actions';
import React, { Component } from 'react';

class SearchControls extends Component {

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

  render() {
    const { currentQuery, isMobile } = this.props;

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
            <label htmlFor="facilityType">Facility Type</label>
            <select name="facilityType" onChange={this.handleFilterChange} value={currentQuery.facilityType}>
              <option value="all">All</option>
              <option value="va_health_facility">Health</option>
              <option value="va_benefits_facility">Benefits</option>
              <option value="va_cemetery">Cemeteries</option>
            </select>
          </div>
          <div className="columns medium-3">
            <label htmlFor="serviceType">Service Type</label>
            <select name="serviceType" onChange={this.handleFilterChange} value={currentQuery.serviceType}>
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
