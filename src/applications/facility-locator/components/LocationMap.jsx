import { mapboxToken } from './MapboxClient';
import environment from 'platform/utilities/environment';
import React, { Component } from 'react';

class LocationMap extends Component {
  render() {
    if (!this.props.info) {
      return <div />;
    }

    const {
      attributes: { lat, long, facilityType },
    } = this.props.info;

    /* eslint-disable camelcase */
    const pinNames = {
      va_health_facility: 'health',
      cc_provider: 'cc-provider',
      va_cemetery: 'cemetery',
      va_benefits_facility: 'benefits',
      vet_center: 'vet-centers',
    };
    /* eslint-enable camelcase */

    const pinURL = encodeURIComponent(
      `${environment.BASE_URL}/img/icons/${pinNames[facilityType]}-pin.png`,
    );

    const mapUrl = `https://api.mapbox.com/v4/mapbox.streets/url-${pinURL}(${long},${lat})/${long},${lat},16/500x300.png?access_token=${mapboxToken}`;

    return (
      <div className="mb2">
        <h4 className="highlight">View on Map</h4>
        <img src={mapUrl} alt="Static map" />
      </div>
    );
  }
}

export default LocationMap;
