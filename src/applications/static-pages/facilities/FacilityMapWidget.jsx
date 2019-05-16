import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import FacilityApiAlert from './FacilityApiAlert';
import { mapboxToken } from '../../facility-locator/components/MapboxToken';
import { buildAddressArray } from '../../facility-locator/utils/facilityAddress';
import environment from '../../../platform/utilities/environment';
import { connect } from 'react-redux';

export class FacilityMapWidget extends React.Component {
  render() {
    if (this.props.loading) {
      return <LoadingIndicator message="Loading facility..." />;
    }

    if (this.props.error) {
      return <FacilityApiAlert />;
    }

    const facilityDetail = this.props.facility;

    const lat = facilityDetail.attributes.lat;
    const long = facilityDetail.attributes.long;
    let address = buildAddressArray(facilityDetail);

    if (address.length !== 0) {
      address = address.join(', ');
    } else {
      // If we don't have an address fallback on coords
      address = `${lat},${long}`;
    }

    const pinURL = encodeURIComponent(
      `${environment.BASE_URL}/img/icons/health-pin.png`,
    );

    const mapUrl = `https://api.mapbox.com/v4/mapbox.streets/url-${pinURL}(${long},${lat})/${long},${lat},16/500x300.png?access_token=${mapboxToken}`;
    const mapLink = `https://maps.google.com?saddr=Current+Location&daddr=${address}`;
    const imageLink = document.getElementById('google-map-link-image');

    if (imageLink) {
      imageLink.setAttribute('href', mapLink);
    }

    return (
      <div className="mb2">
        <a
          id="generated-mapbox-image-link"
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={mapUrl} alt="Static map" />
        </a>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  facility: store.facility.data,
  loading: store.facility.loading,
  error: store.facility.error,
});

export default connect(mapStateToProps)(FacilityMapWidget);
