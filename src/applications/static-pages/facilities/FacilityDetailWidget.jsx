import React from 'react';
import { apiRequest } from '../../../platform/utilities/api';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { buildHours } from '../../facility-locator/utils/facilityHours';
import FacilityAddress from './FacilityAddress';
import FacilityPhone from './FacilityPhone';

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

    // Sort and compile facility hours into a list
    const hours = facilityDetail.attributes.hours;
    const builtHours = buildHours(hours);

    return (
      <div key={facilityDetail.id} className="vads-c-facility-detail">
        <section className="vads-facility-detail">
          <FacilityAddress facility={facilityDetail} />
          <FacilityPhone facility={facilityDetail} />
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
