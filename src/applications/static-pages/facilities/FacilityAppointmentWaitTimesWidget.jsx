import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { formatDateLong } from 'platform/utilities/date';
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
    const waitTime = time[established ? 'established' : 'new'];
    return waitTime ? `${waitTime.toFixed(0)} days` : '';
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
    if (serviceExists && (serviceExists.new || serviceExists.established)) {
      return (
        <div>
          <h3>Average number of days to get an appointment</h3>
          <p>
            We’ll work with you to schedule an appointment with the shortest
            wait time. In some cases, we may schedule your appointment at
            another VA medical center or clinic, or refer you to a non-VA
            medical provider in your community. For urgent health issues, we
            offer same-day appointments, telehealth visits, or walk-in express
            care.
          </p>
          <div className="usa-grid-full">
            <div className="vads-u-display--flex">
              {serviceExists.new && (
                <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-top--1 vads-u-padding-bottom--1p5 vads-u-margin-right--1">
                  <p className="vads-u-margin--0">New patient</p>
                  <p
                    id={`facility-${_.camelCase(
                      service,
                    )}-new-patient-wait-time`}
                    className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
                  >
                    {this.appointmentWaitTime(facility.access.health, service)}
                  </p>
                </div>
              )}
              {serviceExists.established && (
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
              )}
            </div>
            <div className="vads-l-row">
              <p
                id={`facility-${_.camelCase(
                  service,
                )}-appointment-wait-times-effective-date`}
              >
                <p className="vads-u-padding-top--2">
                  Current as of{' '}
                  {formatDateLong(facility.access.health.effectiveDate)}
                </p>
                <p className="vads-u-margin--0">
                  <a href="https://www.accesstocare.va.gov/">
                    Learn more about VA appointment wait times
                  </a>
                </p>
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
