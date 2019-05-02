import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { formatDateLong } from '../../../platform/utilities/date';
import FacilityApiAlert from './FacilityApiAlert';
import { connect } from 'react-redux';
import _ from 'lodash';

export class FacilityAppointmentWaitTimesWidget extends React.Component {
  /* @param waitTimes (object) - an object with a list of keys of facility services names in camelCase as keys with a value of an object
  *  @param service (string) - a health service taxonomy such as "Primary Care"
  *  @param established (boolean - default = false) - which object value is desired. two choices: 'new' or 'established'. true gives 'established' value. false gives 'new' value.
  *  returns a string formatted with the number of days for appointment wait times ex. '8 days'
  */
  appointmentWaitTime(waitTimes, service, established = false) {
    // convert service to camel case
    const serviceKey = _.camelCase(service);
    // find service in waitTimes object as a key
    const time = waitTimes[serviceKey];
    // return waitTimes for service
    return time ? `${time[established ? 'established' : 'new']} days` : '';
  }

  render() {
    if (this.props.loading || !Object.keys(this.props.facility).length) {
      return (
        <LoadingIndicator message="Loading facility health care service wait time..." />
      );
    }

    if (this.props.error) {
      return <FacilityApiAlert />;
    }

    const facility = this.props.facility.attributes;
    const serviceExists =
      facility.access.health[_.camelCase(this.props.service)];
    // check if this health service has a wait time associated with it
    if (serviceExists) {
      return (
        <div>
          <h3>Appointment wait times at this location</h3>
          <p id="facility-patient-satisfaction-scores-effective-date">
            Last updated: {formatDateLong(facility.access.health.effectiveDate)}
          </p>
          <div className="usa-grid-full">
            <div className="usa-width-one-half">
              <div className="usa-width-one-half vads-u-background-color--gray-lightest vads-u-padding--1p5">
                <p className="vads-u-margin--0">New patient</p>
                <p
                  id="facility-patient-satisfaction-scores-primary-routine-score"
                  className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
                >
                  {this.appointmentWaitTime(
                    facility.access.health,
                    this.props.service,
                  )}
                </p>
              </div>
              <div className="usa-width-one-half vads-u-background-color--gray-lightest vads-u-padding--1p5">
                <p className="vads-u-margin--0">Existing patient</p>
                <p
                  id="facility-patient-satisfaction-scores-specialty-routine-score"
                  className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
                >
                  {this.appointmentWaitTime(
                    facility.access.health,
                    this.props.service,
                    true,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div />;
  }
}

const mapStateToProps = store => ({
  facility: store.facility.data,
  loading: store.facility.loading,
  error: store.facility.error,
});

export default connect(mapStateToProps)(FacilityAppointmentWaitTimesWidget);
