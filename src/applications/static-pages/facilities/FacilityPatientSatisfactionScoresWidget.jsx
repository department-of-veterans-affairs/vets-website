import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { formatDateLong } from '../../../platform/utilities/date';
import { displayPercent } from '../../../platform/utilities/ui';
import FacilityApiAlert from './FacilityApiAlert';
import connect from 'react-redux/es/connect/connect';

export class FacilityPatientSatisfactionScoresWidget extends React.Component {
  render() {
    if (this.props.loading || !Object.keys(this.props.facility).length) {
      return (
        <LoadingIndicator message="Loading facility patient satisfaction scores..." />
      );
    }

    if (this.props.error) {
      return <FacilityApiAlert />;
    }

    const facility = this.props.facility.attributes;
    const routineScoreMarkup = [];
    const urgentScoreMarkup = [];

    if (facility.feedback.health.primaryCareRoutine) {
      urgentScoreMarkup.push(
        <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding--1p5 vads-u-margin-right--1">
          <p className="vads-u-margin--0">Primary care</p>
          <p
            id="facility-patient-satisfaction-scores-primary-urgent-score"
            className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
          >
            {displayPercent(facility.feedback.health.primaryCareUrgent)}
          </p>
        </div>,
      );
    }

    if (facility.attributes.feedback.health.specialtyCareUrgent) {
      urgentScoreMarkup.push(
        <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding--1p5">
          <p className="vads-u-margin--0">Specialty care</p>
          <p
            id="facility-patient-satisfaction-scores-specialty-urgent-score"
            className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
          >
            {displayPercent(
              facility.attributes.feedback.health.specialtyCareUrgent,
            )}
          </p>
        </div>,
      );
    }

    if (facility.feedback.health.primaryCareRoutine) {
      routineScoreMarkup.push(
        <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding--1p5 vads-u-margin-right--1">
          <p className="vads-u-margin--0">Primary care</p>
          <p
            id="facility-patient-satisfaction-scores-primary-routine-score"
            className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
          >
            {displayPercent(facility.feedback.health.primaryCareRoutine)}
          </p>
        </div>,
      );
    }

    if (facility.feedback.health.specialtyCareRoutine) {
      routineScoreMarkup.push(
        <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding--1p5">
          <p className="vads-u-margin--0">Specialty care</p>
          <p
            id="facility-patient-satisfaction-scores-specialty-routine-score"
            className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
          >
            {displayPercent(facility.feedback.health.specialtyCareRoutine)}
          </p>
        </div>,
      );
    }

    return (
      <div>
        <h2>Our patient satisfaction scores</h2>
        <p id="facility-patient-satisfaction-scores-effective-date">
          Last updated: {formatDateLong(facility.feedback.health.effectiveDate)}
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
          <div className="usa-width-one-half vads-u-display--flex">
            {urgentScoreMarkup}
          </div>
        </div>

        <h3>Routine care appointments at this location</h3>
        <p>
          % of Veterans who say they usually or always get an appointment when
          they need it
        </p>
        <div className="usa-grid-full">
          <div className="usa-width-one-half vads-u-display--flex">
            {routineScoreMarkup}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  facility: store.facility.data,
  loading: store.facility.loading,
  error: store.facility.error,
});

export default connect(mapStateToProps)(
  FacilityPatientSatisfactionScoresWidget,
);
