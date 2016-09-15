import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { search } from '../actions';
import React, { Component } from 'react';

class SearchControls extends Component {

  // TODO (bshyong): generalize to be able to handle Select box changes
  handleQueryChange = (e) => {
    this.props.onChange({
      searchString: e.target.value,
    });
  }

  handleFacilityTypeChange = () => {
    // TODO: define shape of query object for facility/service types
  }

  handleSearch = (e) => {
    const { onSearch } = this.props;
    e.preventDefault();

    onSearch();
  }

  render() {
    const style = {
      padding: '1.5rem 1rem',
    };

    const { currentQuery } = this.props;

    return (
      <div style={style}>
        <h4>Find a VA Facility</h4>
        <div>Search for facilities near you or for a specific service or benefit.</div>
        <form className="usa-form">
          <label htmlFor="Street, City, State or Zip">Enter Street, City, State or Zip</label>
          <input name="streetCityStateZip" type="text" onChange={this.handleQueryChange} value={currentQuery.searchString}/>
          <label htmlFor="serviceType">Service Type</label>
          <select name="services" defaultValue="all" onChange={this.handleFacilityTypeChange}>
            <option value="all">All</option>
            <option value="health">Health</option>
            <option value="benefits">Benefits</option>
            <option value="cemeteries">Cemeteries</option>
          </select>
          <input type="submit" value="Search" onClick={this.handleSearch}/>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    search,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchControls);
