import React, { Component, PropTypes } from 'react';
import { compact } from 'lodash';
import { Link } from 'react-router';

class SearchResult extends Component {
  render() {
    const { facility } = this.props;
    const { address, phone, name } = facility.attributes;
    const addressString = [
      compact([address.building, address.street, address.suite]).join(' '),
      `${address.city}, ${address.state} ${address.zip}-${address.zip4}`
    ];

    /* eslint-disable camelcase */
    const facilityTypes = {
      va_health_facility: 'Health',
      va_cemetery: 'Cemetery',
      va_benefits_facility: 'Benefits',
    };
    /* eslint-enable camelcase */

    return (
      <div className="facility-result">
        <Link to={`facilities/facility/${facility.id}`}>
          <h5>{name}</h5>
        </Link>
        <span>Facility type: <strong>{facilityTypes[facility.type]}</strong></span>
        <p>
          {addressString[0]}<br/>
          {addressString[1]}
        </p>
        <div className="row">
          <div className="columns small-12 large-6" style={{ paddingRight: 0 }}>
            <span>
              <a href={`tel:${phone.main}`}>
                <i className="fa fa-phone" style={{ marginRight: '0.5rem' }}/> {phone.main}
              </a>
            </span>
          </div>
          <div className="columns small-12 large-6" style={{ paddingRight: 0 }}>
            <span>
              <a href={`https://maps.google.com?saddr=Current+Location&daddr=${addressString.join(' ')}`} target="_blank">
                <i className="fa fa-map" style={{ marginRight: '0.5rem' }}/> Directions
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

SearchResult.propTypes = {
  facility: PropTypes.object,
};

export default SearchResult;
