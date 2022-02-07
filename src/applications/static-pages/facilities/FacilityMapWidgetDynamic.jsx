import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { mapboxToken } from '../../facility-locator/utils/mapboxToken';
import { buildAddressArray } from '../../facility-locator/utils/facilityAddress';
import { staticMapURL } from '../../facility-locator/utils/mapHelpers';

export class FacilityMapWidgetDynamic extends React.Component {
  constructor(props) {
    super(props);
    const { facilityID, facilities } = this.props;
    const numberOfFacilities = Object.keys(facilities).length;
    const facilitiesFound = numberOfFacilities > 0;
    const facilityDetail = facilitiesFound ? facilities[facilityID] : '';
    const lat = facilityDetail ? this.getLat(facilityDetail) : 0;
    const long = facilityDetail ? this.getLong(facilityDetail) : 0;
    let address = buildAddressArray(facilityDetail);
    address = this.cleanAddress(address, lat, long);
    this.state = {
      facilityID,
      lat,
      long,
      address,
    };
  }

  cleanAddress(address, lat, long) {
    if (address && address.length !== 0) {
      return address.join(', ');
    }
    // If we don't have an address fallback on coords
    return `${lat},${long}`;
  }

  updateLatLongAndAddress = facilityDetail => {
    const myThis = this;
    const lat = this.getLat(facilityDetail);
    const long = this.getLong(facilityDetail);
    if (lat !== 0 && long !== 0) {
      let address = buildAddressArray(facilityDetail);
      address = this.cleanAddress(address, lat, long);
      myThis.setState({
        lat,
        long,
        address,
      });
    }
  };

  componentDidMount() {
    if (!this.props.loading && !this.props.error) {
      this.updateImageLink(this.props.facilities);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { facilities } = this.props;
    const { facilityID } = this.state;
    const facilityDetail = facilities[facilityID];
    const lat = this.getLat(facilityDetail);
    const long = this.getLong(facilityDetail);
    if (prevState.lat !== lat && prevState.long !== long) {
      this.updateLatLongAndAddress(this.props.facilities);
    }
  }

  updateImageLink = facilityDetail => {
    const lat = this.getLat(facilityDetail);
    const long = this.getLong(facilityDetail);
    let address = buildAddressArray(facilityDetail);
    address = this.cleanAddress(address, lat, long);
    if (address && address.length !== 0) {
      address = address.join(', ');
    } else {
      // If we don't have an address fallback on coords
      address = `${lat},${long}`;
    }

    const mapLink = `https://maps.google.com?saddr=Current+Location&daddr=${address}`;
    const imageLink = document.getElementById('google-map-link-image');
    if (imageLink && lat !== 0 && long !== 0) {
      imageLink.setAttribute('href', mapLink);
    }
  };

  getLat(facilityDetail) {
    return facilityDetail && facilityDetail.attributes
      ? facilityDetail.attributes.lat
      : 0;
  }

  getLong(facilityDetail) {
    return facilityDetail && facilityDetail.attributes
      ? facilityDetail.attributes.long
      : 0;
  }

  render() {
    if (this.props.loading) {
      return <LoadingIndicator message="Loading facility..." />;
    }

    if (this.props.error) {
      return null;
    }
    const { lat, long, address } = this.state;
    if (lat === 0 && long === 0) {
      return <div />;
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
              <i className="fas fa-expand-arrows-alt" />
            </span>
            <img className="facility-img" src={mapUrl} alt="Static map" />
          </div>
        </a>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  facilities: store.facility.multidata,
  loading: store.facility.loading,
  error: store.facility.error,
});

FacilityMapWidgetDynamic.propTypes = {
  facilities: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  facilityID: PropTypes.string,
};

export default connect(mapStateToProps)(FacilityMapWidgetDynamic);
