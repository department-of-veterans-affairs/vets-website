import React from 'react';
import { apiRequest } from '../../../platform/utilities/api';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { buildAddressArray } from '../../facility-locator/utils/facilityAddress';
import { buildHours } from '../../facility-locator/utils/facilityHours';

export default class FacilityDetailWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const facilityId = this.props.facilityId;
    this.request = apiRequest(
      `/facilities/va/${facilityId}`,
      null,
      this.handleFacilitySuccess,
      this.handleFacilityError,
    );
  }

  handleFacilitySuccess = facility => {
    this.setState({
      loading: false,
      facility: facility.data,
    });
  };

  handleFacilityError = () => {
    this.setState({ error: true });
  };

  render() {
    if (this.state.loading) {
      return <LoadingIndicator message="Loading facility..." />;
    }

    const facilityDetail = this.state.facility;
    const location = {
      attributes: facilityDetail.attributes,
    };
    let address = buildAddressArray(location);

    if (address.length !== 0) {
      address = address.join(', ');
    } else {
      // If we don't have an address fallback on coords
      const { lat, long } = location.attributes;
      address = `${lat},${long}`;
    }

    // Sort and compile facility hours into a list
    const hours = facilityDetail.attributes.hours;
    const builtHours = buildHours(hours);

    return (
      <div key={facilityDetail.id} className="vads-c-facility-detail">
        <section className="vads-facility-detail">
          <address className="vads-u-margin-bottom--1p5">
            <div>{facilityDetail.attributes.address.physical.address1}</div>
            <div>
              {facilityDetail.attributes.address.physical.city}
              {', '}
              {facilityDetail.attributes.address.physical.state}{' '}
              {facilityDetail.attributes.address.physical.zip}
            </div>
          </address>
          <div className="vads-u-margin-bottom--1p5">
            <a
              href={`https://maps.google.com?saddr=Current+Location&daddr=${address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Directions
            </a>
          </div>
          <div className="vads-u-margin-bottom--1p5">
            <div className="main-phone">
              <strong>Main phone: </strong>
              <a
                href={`tel:${facilityDetail.attributes.phone.main.replace(
                  /[ ]?x/,
                  '',
                )}`}
              >
                {facilityDetail.attributes.phone.main.replace(/[ ]?x/, '')}
              </a>
            </div>
            <div className="mental-health-clinic-phone">
              <strong>Mental health clinic: </strong>
              <a
                href={`tel:${facilityDetail.attributes.phone.mentalHealthClinic.replace(
                  /[ ]?x/,
                  '',
                )}`}
              >
                {facilityDetail.attributes.phone.mentalHealthClinic.replace(
                  /[ ]?x/,
                  '',
                )}
              </a>
            </div>
          </div>
          <div className="vads-u-margin-bottom--1p5">
            <div className="clinicalhours">
              <h3>Clinical Hours</h3>
              <ul className="va-c-facility-hours-list">
                {builtHours.map((day, index) => (
                  <li key={index}>{day}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
