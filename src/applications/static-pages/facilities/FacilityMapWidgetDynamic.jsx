import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchMultiFacility } from './actions';
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

  componentDidMount() {
    const { facilityID, dipatchFetchMultiFacility } = this.props;
    dipatchFetchMultiFacility(facilityID);
  }

  cleanAddress(address, lat, long) {
    if (address && address.length !== 0) {
      return address.join(', ');
    }
    // If we don't have an address fallback on coords
    return `${lat},${long}`;
  }

  updateLatLongAndAddress = (facilityDetail, lat, long) => {
    const myThis = this;
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

  componentDidUpdate(prevProps, prevState) {
    const { facilities } = this.props;
    const { facilityID } = this.state;
    const facilityDetail = facilities ? facilities[facilityID] : '';
    const lat = this.getLat(facilityDetail);
    const long = this.getLong(facilityDetail);

    if (prevState.lat !== lat && prevState.long !== long) {
      this.updateLatLongAndAddress(facilityDetail, lat, long);
    }
  }

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
    const { lat, long, address } = this.state;
    const { multiError, multiLoading, facilityID } = this.props;
    const loading = multiLoading ? multiLoading[facilityID] : false;
    const error = multiError ? multiError[facilityID] : false;

    if (loading) {
      return <va-loading-indicator message="Loading facility..." />;
    }

    if (error) {
      return null;
    }

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
  facilities: store.facility.multidata,
  multiLoading: store.facility.multiLoading,
  multiError: store.facility.multiError,
});

FacilityMapWidgetDynamic.propTypes = {
  facilities: PropTypes.object,
  multiLoading: PropTypes.object,
  multiError: PropTypes.object,
  facilityID: PropTypes.string,
};

const mapDispatchToProps = {
  dipatchFetchMultiFacility: fetchMultiFacility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilityMapWidgetDynamic);
