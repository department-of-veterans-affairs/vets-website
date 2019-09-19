import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { buildHours } from '../../facility-locator/utils/facilityHours';
import FacilityAddress from './FacilityAddress';
import FacilityPhone from './FacilityPhone';
import FacilityApiAlert from './FacilityApiAlert';
import { connect } from 'react-redux';

export class FacilityDetailWidget extends React.Component {
  render() {
    if (this.props.loading || !Object.keys(this.props.facility).length) {
      return <LoadingIndicator message="Loading facility..." />;
    }

    if (this.props.error) {
      return <FacilityApiAlert />;
    }

    const facilityDetail = this.props.facility;

    // Sort and compile facility hours into a list
    const hours = facilityDetail.attributes.hours;
    const builtHours = buildHours(hours, true);

    return (
      <div key={facilityDetail.id} className="vads-c-facility-detail">
        <section className="vads-facility-detail">
          <FacilityAddress facility={facilityDetail} />
          <FacilityPhone facility={facilityDetail} />
          <div className="vads-u-margin-bottom--0">
            <div className="clinicalhours">
              <h3 className="vads-u-margin-top--2p5 vads-u-margin-bottom--1">
                Clinical Hours
              </h3>
              <ul className="va-c-facility-hours-list vads-u-margin-top--0">
                {builtHours.map((day, index) => {
                  const splitDay = day.split(': ');
                  const abbrvDay = splitDay[0];
                  const times = splitDay[1];
                  return (
                    <li key={index}>
                      <b className="abbrv-day">{abbrvDay}:</b> {times}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  facility: store.facility.data,
  loading: store.facility.loading,
  error: store.facility.error,
});

export default connect(mapStateToProps)(FacilityDetailWidget);
