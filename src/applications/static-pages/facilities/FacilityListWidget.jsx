import React from 'react';
import { apiRequest } from '../../../platform/utilities/api';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import FacilityApiAlert from './FacilityApiAlert';
import { sortFacilitiesByName } from './facilityUtilities';
import FacilityTitle from './FacilityTitle';
import FacilityAddress from './FacilityAddress';
import FacilityPhone from './FacilityPhone';

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
    this.setState({
      loading: false,
      error: true,
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingIndicator message="Loading facilities..." />;
    }

    if (this.state.error) {
      return <FacilityApiAlert />;
    }

    const facilitiesList = sortFacilitiesByName(this.state.facilities).map(
      facility => (
        <div
          key={facility.id}
          className="usa-grid vads-u-background-color--gray-lightest vads-u-margin-bottom--2p5 vads-u-padding-y--1p5"
        >
          <section key={facility.id} className="usa-width-one-half">
            <FacilityTitle
              facility={facility}
              nickname={this.props.facilities[facility.id].nickname}
              regionPath={this.props.path}
            />
            <FacilityAddress facility={facility} />
            <FacilityPhone facility={facility} />
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
      ),
    );
    return <div className="locations">{facilitiesList}</div>;
  }
}
