import React from 'react';
import { apiRequest } from '../../../platform/utilities/api';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { formatDateLong } from '../../../platform/utilities/date';
import { displayPercent } from '../../../platform/utilities/ui';

export default class FacilityPatientSatisfactionScoresWidget extends React.Component {
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
      return (
        <LoadingIndicator message="Loading facility patient satisfaction scores..." />
      );
    }
    return (
      <div>
        <h2>Our patient satisfaction scores</h2>
        <p id="facility-patient-satisfaction-scores-effective-date">
          Last updated:{' '}
          {formatDateLong(
            this.state.facility.attributes.feedback.health.effectiveDate,
          )}
        </p>
        <p>
          Veteran-reported satisfaction scores come from the Consumer Assessment
          of Health and Systems survey, which measures satisfaction of nearly
          150,000 Veterans across the U.S. every 6 months.
        </p>
        <h3>Urgent care appointments at this location</h3>
        <p>
          % of Veterans who say they usually or always get an appointment when
          they need care right away
        </p>
        <div className="usa-grid-full">
          <div className="usa-width-one-half">
            <div className="usa-width-one-half vads-u-background-color--gray-lightest vads-u-padding--1p5">
              <p className="vads-u-margin--0">Primary care</p>
              <p
                id="facility-patient-satisfaction-scores-primary-urgent-score"
                className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
              >
                {this.state.facility.attributes.feedback.health
                  .primaryCareUrgent
                  ? displayPercent(
                      this.state.facility.attributes.feedback.health
                        .primaryCareUrgent,
                    )
                  : 'N/A'}
              </p>
            </div>
            <div className="usa-width-one-half vads-u-background-color--gray-lightest vads-u-padding--1p5">
              <p className="vads-u-margin--0">Specialty care</p>
              <p
                id="facility-patient-satisfaction-scores-specialty-urgent-score"
                className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
              >
                {this.state.facility.attributes.feedback.health
                  .specialtyCareUrgent
                  ? displayPercent(
                      this.state.facility.attributes.feedback.health
                        .specialtyCareUrgent,
                    )
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <h3>Routine care appointments at this location</h3>
        <p>
          % of Veterans who say they usually or always get an appointment when
          they need it
        </p>
        <div className="usa-grid-full">
          <div className="usa-width-one-half">
            <div className="usa-width-one-half vads-u-background-color--gray-lightest vads-u-padding--1p5">
              <p className="vads-u-margin--0">Primary care</p>
              <p
                id="facility-patient-satisfaction-scores-primary-routine-score"
                className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
              >
                {this.state.facility.attributes.feedback.health
                  .primaryCareRoutine
                  ? displayPercent(
                      this.state.facility.attributes.feedback.health
                        .primaryCareRoutine,
                    )
                  : 'N/A'}
              </p>
            </div>
            <div className="usa-width-one-half vads-u-background-color--gray-lightest vads-u-padding--1p5">
              <p className="vads-u-margin--0">Specialty care</p>
              <p
                id="facility-patient-satisfaction-scores-specialty-routine-score"
                className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
              >
                {this.state.facility.attributes.feedback.health
                  .specialtyCareRoutine
                  ? displayPercent(
                      this.state.facility.attributes.feedback.health
                        .specialtyCareRoutine,
                    )
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
