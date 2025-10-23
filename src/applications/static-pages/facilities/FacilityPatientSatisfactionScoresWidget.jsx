import React from 'react';
import { formatDateLong } from 'platform/utilities/date';
import { displayPercent } from 'platform/utilities/ui';
import { connect } from 'react-redux';
import FacilityApiAlert from './FacilityApiAlert';
import FacilityDataLink from './FacilityDataLink';

export function FacilityPatientSatisfactionScoresWidget(props) {
  if (props.loading || !Object.keys(props.facility).length) {
    return (
      <va-loading-indicator message="Loading facility patient satisfaction scores..." />
    );
  }

  if (props.error) {
    return <FacilityApiAlert />;
  }

  const facility = props.facility.attributes;

  if (
    facility?.feedback?.health === undefined ||
    Object.values(facility.feedback.health).length === 0 ||
    Object.values(facility.feedback.health).some(x => x <= 0)
  )
    return null;

  return (
    <div>
      <h2
        id="our-patient-satisfaction-scores"
        className="vads-u-margin-top--4 vads-u-font-size--lg mobile-lg:vads-u-font-size--xl"
      >
        Veteran satisfaction with appointment wait times at this location
      </h2>
      <p>
        VA measures Veteran satisfaction with getting timely appointments at
        each of our health facilities. We use a health care industry standard,
        the Consumer Assessment of Health and Systems survey, to collect
        feedback from 150,000 Veterans across the United States every 6 months.
      </p>
      <h3 className="vads-u-font-size--md">Appointments for urgent needs</h3>
      <p>
        Percentage of Veterans who say they usually or always get an appointment
        when they need it.
      </p>
      <div className="usa-grid-full">
        <div className="vads-u-display--flex">
          {!!facility.feedback.health.primaryCareUrgent && (
            <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-top--1 vads-u-padding-bottom--1p5 vads-u-margin-right--1">
              <h4 className="vads-u-margin--0 vads-u-font-size--h5 vads-u-font-weight--normal">
                Primary care
              </h4>
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
              <h4 className="vads-u-margin--0 vads-u-font-size--h5 vads-u-font-weight--normal">
                Specialty care
              </h4>
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

      <h3 className="vads-u-font-size--md">Appointments for routine care</h3>
      <p>
        Percentage of Veterans who say they usually or always get an appointment
        when they need it.
      </p>
      <div className="usa-grid-full">
        <div className="vads-u-display--flex">
          {!!facility.feedback.health.primaryCareRoutine && (
            <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-top--1 vads-u-padding-bottom--1p5 vads-u-margin-right--1">
              <h4 className="vads-u-margin--0 vads-u-font-size--h5 vads-u-font-weight--normal">
                Primary care
              </h4>
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
              <h4 className="vads-u-margin--0 vads-u-font-size--h5 vads-u-font-weight--normal">
                Specialty care
              </h4>
              <p
                id="facility-patient-satisfaction-scores-specialty-routine-score"
                className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
              >
                {displayPercent(facility.feedback.health.specialtyCareRoutine)}
              </p>
            </div>
          )}
        </div>
      </div>
      <p
        className="vads-u-padding-top--2"
        id="facility-patient-satisfaction-scores-effective-date"
      >
        Current as of {formatDateLong(facility.feedback.effectiveDate)}
      </p>
      <p>
        <FacilityDataLink
          facilityId={facility.uniqueId}
          text="Learn more about Veteran satisfaction with access to care"
        />
      </p>
    </div>
  );
}

const mapStateToProps = store => ({
  facility: store.facility.data,
  loading: store.facility.loading,
  error: store.facility.error,
});

export default connect(mapStateToProps)(
  FacilityPatientSatisfactionScoresWidget,
);
