import React from 'react';
import { apiRequest } from '../../../platform/utilities/api';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { buildAddressArray } from '../../facility-locator/utils/facilityAddress';

export default class FacilityListWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const facilityIds = Object.keys(this.props.facilities);
    this.request = apiRequest(
      `/facilities/va?ids=${facilityIds}`,
      null,
      this.handleFacilitiesSuccess,
      this.handleFacilitiesError,
    );
  }

  handleFacilitiesSuccess = facilities => {
    this.setState({
      loading: false,
      facilities: facilities.data,
    });
  };

  handleFacilitiesError = () => {
    this.setState({ error: true });
  };

  facilitiesList = facilities =>
    facilities.sort((a, b) => {
      const aName = a.attributes.name;
      const bName = b.attributes.name;
      if (aName < bName) {
        return -1;
      }

      if (aName > bName) {
        return 1;
      }

      return 0;
    });

  render() {
    if (this.state.loading) {
      return <LoadingIndicator message="Loading facilities..." />;
    }

    const facilitiesList = this.facilitiesList(this.state.facilities).map(
      facility => {
        const location = {
          attributes: facility.attributes,
        };
        let address = buildAddressArray(location);

        if (address.length !== 0) {
          address = address.join(', ');
        } else {
          // If we don't have an address fallback on coords
          const { lat, long } = location.attributes;
          address = `${lat},${long}`;
        }
        return (
          <div
            key={facility.id}
            className="usa-grid vads-u-background-color--gray-lightest vads-u-margin-bottom--2p5 vads-u-padding-y--1p5"
          >
            <section className="usa-width-one-half">
              <h3 className="vads-u-margin-bottom--2p5">
                <a
                  href={this.props.facilities[facility.id].entityUrl.path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {facility.attributes.name}
                </a>
              </h3>
              <address className="vads-u-margin-bottom--1p5">
                <div>{facility.attributes.address.physical.address1}</div>
                <div>
                  {facility.attributes.address.physical.city}
                  {', '}
                  {facility.attributes.address.physical.state}{' '}
                  {facility.attributes.address.physical.zip}
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
                    href={`tel:${facility.attributes.phone.main.replace(
                      /[ ]?x/,
                      '',
                    )}`}
                  >
                    {facility.attributes.phone.main.replace(/[ ]?x/, '')}
                  </a>
                </div>
                <div className="mental-health-clinic-phone">
                  <strong>Mental health clinic: </strong>
                  <a
                    href={`tel:${facility.attributes.phone.mentalHealthClinic.replace(
                      /[ ]?x/,
                      '',
                    )}`}
                  >
                    {facility.attributes.phone.mentalHealthClinic.replace(
                      /[ ]?x/,
                      '',
                    )}
                  </a>
                </div>
              </div>
              <div className="location-details-link">
                <a
                  href={this.props.facilities[facility.id].entityUrl.path}
                  className="usa-button usa-button-secondary"
                >
                  Location details <i className="fa fa-chevron-right" />
                </a>
              </div>
            </section>
            <section className="usa-width-one-half">
              <img
                src={
                  this.props.facilities[facility.id].derivative
                    ? this.props.facilities[facility.id].derivative.url
                    : ''
                }
                alt={
                  this.props.facilities[facility.id].alt
                    ? this.props.facilities[facility.id].alt
                    : ''
                }
              />
            </section>
          </div>
        );
      },
    );
    return <div className="locations">{facilitiesList}</div>;
  }
}
