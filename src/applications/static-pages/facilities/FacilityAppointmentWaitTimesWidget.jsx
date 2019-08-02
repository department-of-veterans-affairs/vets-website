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
    return time
      ? `${time[established ? 'established' : 'new'].toFixed(0)} days`
      : '';
  }

  render() {
    if (this.props.loading || !Object.keys(this.props.facility).length) {
      return (
        <LoadingIndicator
          message={`Loading facility's ${
            this.props.service
          } appointment wait times...`}
        />
      );
    }

    if (this.props.error) {
      return <FacilityApiAlert />;
    }

    const facility = this.props.facility.attributes;
    const service = this.props.service.split('(')[0];
    const serviceExists = facility.access.health[_.camelCase(service)];
    // check if this health service has a wait time associated with it
    if (serviceExists) {
      return (
        <div>
          <h3>Patient wait times</h3>
          <p>
            The average number of days to receive care for this service if you
            make an appointment today.
          </p>
          <div className="usa-grid-full">
            <div className="vads-u-display--flex">
              <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-top--1 vads-u-padding-bottom--1p5 vads-u-margin-right--1">
                <p className="vads-u-margin--0">New patient</p>
                <p
                  id={`facility-${_.camelCase(service)}-new-patient-wait-time`}
                  className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
                >
                  {this.appointmentWaitTime(facility.access.health, service)}
                </p>
              </div>
              <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-top--1 vads-u-padding-bottom--1p5">
                <p className="vads-u-margin--0">Existing patient</p>
                <p
                  id={`facility-${_.camelCase(
                    service,
                  )}-existing-patient-wait-time`}
                  className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
                >
                  {this.appointmentWaitTime(
                    facility.access.health,
                    service,
                    true,
                  )}
                </p>
              </div>
            </div>
            <div className="vads-l-row">
              <p
                id={`facility-${_.camelCase(
                  service,
                )}-appointment-wait-times-effective-date`}
              >
                Last updated:{' '}
                {formatDateLong(facility.access.health.effectiveDate)}
              </p>
              <p className="vads-u-margin--0">
                These wait times may not always reflect the actual wait for
                services. Call us if you would like to make an appointment or
                have questions about accessing this service.
              </p>
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
