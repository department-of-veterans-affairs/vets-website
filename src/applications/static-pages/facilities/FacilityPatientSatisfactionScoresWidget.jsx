import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { formatDateLong } from '../../../platform/utilities/date';
import { displayPercent } from '../../../platform/utilities/ui';
import FacilityApiAlert from './FacilityApiAlert';
import { connect } from 'react-redux';

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

    return (
      <div>
        <h2
          id="our-patient-satisfaction-scores"
          className="vads-u-margin-top--4 vads-u-font-size--lg small-screen:vads-u-font-size--xl"
        >
          Appointment access at this location
        </h2>
        <p>
          Veteran-reported satisfaction scores come from the Consumer Assessment
          of Health and Systems survey, which measures satisfaction of nearly
          150,000 Veterans across the U.S. every 6 months.
        </p>
        <h3 className="vads-u-font-size--md">
          Urgent care appointments at this location
        </h3>
        <p>
          Veterans who say they usually or always get an appointment when they
          need care right away.
        </p>
        <div className="usa-grid-full">
          <div className="vads-u-display--flex">
            {!!facility.feedback.health.primaryCareUrgent && (
              <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-top--1 vads-u-padding-bottom--1p5 vads-u-margin-right--1">
                <p className="vads-u-margin--0">Primary care</p>
                <p
                  id="facility-patient-satisfaction-scores-primary-urgent-score"
                  className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
                >
                  {displayPercent(facility.feedback.health.primaryCareUrgent)}
                </p>
              </div>
            )}
            {!!facility.feedback.health.specialtyCareUrgent && (
              <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-top--1 vads-u-padding-bottom--1p5">
                <p className="vads-u-margin--0">Specialty care</p>
                <p
                  id="facility-patient-satisfaction-scores-specialty-urgent-score"
                  className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
                >
                  {displayPercent(facility.feedback.health.specialtyCareUrgent)}
                </p>
              </div>
            )}
          </div>
        </div>

        <h3 className="vads-u-font-size--md">
          Routine care appointments at this location
        </h3>
        <p>
          Veterans who say they usually or always get an appointment when they
          need it.
        </p>
        <div className="usa-grid-full">
          <div className="vads-u-display--flex">
            {!!facility.feedback.health.primaryCareRoutine && (
              <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-top--1 vads-u-padding-bottom--1p5 vads-u-margin-right--1">
                <p className="vads-u-margin--0">Primary care</p>
                <p
                  id="facility-patient-satisfaction-scores-primary-routine-score"
                  className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
                >
                  {displayPercent(facility.feedback.health.primaryCareRoutine)}
                </p>
              </div>
            )}

            {!!facility.feedback.health.specialtyCareRoutine && (
              <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-top--1 vads-u-padding-bottom--1p5">
                <p className="vads-u-margin--0">Specialty care</p>
                <p
                  id="facility-patient-satisfaction-scores-specialty-routine-score"
                  className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
                >
                  {displayPercent(
                    facility.feedback.health.specialtyCareRoutine,
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
        <p id="facility-patient-satisfaction-scores-effective-date">
          Last updated: {formatDateLong(facility.feedback.health.effectiveDate)}
        </p>
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
