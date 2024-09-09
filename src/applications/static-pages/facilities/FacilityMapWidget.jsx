import React from 'react';
import { connect } from 'react-redux';
import { mapboxToken } from '../../facility-locator/utils/mapboxToken';
import { buildAddressArray } from '../../facility-locator/utils/facilityAddress';
import { staticMapURL } from '../../facility-locator/utils/mapHelpers';

export class FacilityMapWidget extends React.Component {
  componentDidMount() {
    if (!this.props.loading && !this.props.error) {
      this.updateImageLink(this.props.facility);
    }
  }

  componentDidUpdate(prevProps) {
    // We only want to run this logic when we were loading before, but now we're done loading and there's no error
    if (prevProps.loading && !this.props.loading && !this.props.error) {
      this.updateImageLink(this.props.facility);
    }
  }

  updateImageLink(facilityDetail) {
    const { lat } = facilityDetail.attributes;
    const { long } = facilityDetail.attributes;

    let address = buildAddressArray(facilityDetail);
    if (address.length !== 0) {
      address = address.join(', ');
    } else {
      // If we don't have an address fallback on coords
      address = `${lat},${long}`;
    }

    const mapLink = `https://maps.google.com?saddr=Current+Location&daddr=${address}`;
    const imageLink = document.getElementById('google-map-link-image');
    if (imageLink) {
      imageLink.setAttribute('href', mapLink);
    }
  }

  render() {
    if (this.props.loading) {
      return <va-loading-indicator message="Loading facility..." />;
    }

    if (this.props.error) {
      return null;
    }

    const facilityDetail = this.props.facility;

    const { lat } = facilityDetail.attributes;
    const { long } = facilityDetail.attributes;
    let address = buildAddressArray(facilityDetail);

    if (address.length !== 0) {
      address = address.join(', ');
    } else {
      // If we don't have an address fallback on coords
      address = `${lat},${long}`;
    }

    const mapUrl = staticMapURL(lat, long, mapboxToken);
    const mapLink = `https://maps.google.com?saddr=Current+Location&daddr=${address}`;

    return (
      <div className="mb2">
        <a
          id="generated-mapbox-image-link"
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="va-c-position--relative vads-u-display--inline-block">
            <span className="vads-u-margin-right--1p5 vads-u-margin-top--1p5 vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center expand-image-button va-c-position--absolute va-c-position-top-right-corner vads-u-justify-content--center">
              <va-icon icon="zoom_out_map" size="3" />
            </span>
            <img className="facility-img" src={mapUrl} alt="Static map" />
          </div>
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
