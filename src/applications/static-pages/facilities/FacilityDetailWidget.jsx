import React from 'react';
import { connect } from 'react-redux';
import { buildHours } from './facilityUtilities';
import FacilityAddress from './FacilityAddress';
import FacilityPhone from './FacilityPhone';
import FacilityApiAlert from './FacilityApiAlert';

export function FacilityDetailWidget({ loading, error, facility }) {
  if (loading || !Object.keys(facility).length) {
    return <va-loading-indicator message="Loading facility..." />;
  }

  if (error) {
    return <FacilityApiAlert />;
  }

  const CLINICAL_HOURS_COLUMN_MODIFIER = 5;

  // Sort and compile facility hours into a list
  const { hours } = facility.attributes;
  const builtHours = buildHours(hours, true);
  const clinicalHours = builtHours.map((day, index) => {
    const [abbrvDay, times] = day.split(': ');

    return (
      <li key={index}>
        <b className="abbrv-day">{abbrvDay}:</b> {times}
      </li>
    );
  });

  return (
    <div key={facility.id} className="vads-c-facility-detail">
      <section className="vads-facility-detail">
        <h3 className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
          Address
        </h3>
        <div className="vads-u-margin-bottom--3">
          <FacilityAddress facility={facility} />
        </div>
        <h3 className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1">
          Phone numbers
        </h3>
        <FacilityPhone facility={facility} />
        <div className="vads-u-margin-bottom--0">
          <div className="clinicalhours">
            <h3 className="vads-u-margin-top--2p5 vads-u-margin-bottom--1">
              Clinical hours
            </h3>
            <div className="vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row vads-u-margin-bottom--0">
              <ul className="vads-u-flex--1 va-c-facility-hours-list vads-u-margin-top--0 vads-u-margin-bottom--1 mobile-lg:vads-u-margin-bottom--0 vads-u-margin-right--3">
                {clinicalHours.slice(0, CLINICAL_HOURS_COLUMN_MODIFIER)}
              </ul>
              <ul className="vads-u-flex--1 va-c-facility-hours-list vads-u-margin-top--0 'vads-u-margin-bottom--0">
                {clinicalHours.slice(CLINICAL_HOURS_COLUMN_MODIFIER)}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const mapStateToProps = store => ({
  facility: store.facility.data,
  loading: store.facility.loading,
  error: store.facility.error,
});

export default connect(mapStateToProps)(FacilityDetailWidget);
