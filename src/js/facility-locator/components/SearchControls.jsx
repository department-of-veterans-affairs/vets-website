import React, { Component } from 'react';

class SearchControls extends Component {
  render() {
    const style = {
      padding: '1.5rem 1rem',
    };

    return (
      <div style={style}>
        <h4>Find a VA Facility</h4>
        <div>Search for facilities near you or for a specific service or benefit.</div>
        <form className="usa-form">
          <label htmlFor="Street, City, State or Zip">Enter Street, City, State or Zip</label>
          <input name="streetCityStateZip" type="text"/>
          <label htmlFor="serviceType">Service Type</label>
          <select name="services" defaultValue="all">
            <option value="all">All</option>
            <option value="health">Health</option>
            <option value="benefits">Benefits</option>
            <option value="cemeteries">Cemeteries</option>
          </select>
          <input type="submit" value="Search"/>
        </form>
      </div>
    );
  }
}

export default SearchControls;
