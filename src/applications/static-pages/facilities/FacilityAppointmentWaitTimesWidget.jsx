import React from 'react';
import { formatDateLong } from 'platform/utilities/date';
import { connect } from 'react-redux';
import _ from 'lodash';
import FacilityApiAlert from './FacilityApiAlert';
import FacilityDataLink from './FacilityDataLink';

export class FacilityAppointmentWaitTimesWidget extends React.Component {
  appointmentWaitTime(waitTime, service, established = false) {
    return (
      <div className="facility-satisfaction-tile vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-top--1 vads-u-padding-bottom--1p5 vads-u-margin-right--1">
        <p className="vads-u-margin--0">
          {established ? 'Existing patient' : 'New patient'}
        </p>
        <p
          id={`facility-${_.camelCase(service)}-${
            established ? 'existing' : 'new'
          }-patient-wait-time`}
          className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-font-family--serif"
        >
          {Number(waitTime).toFixed(0) === '0'
            ? 'No Wait'
            : `${Number(waitTime).toFixed(0)} days`}
        </p>
      </div>
    );
  }

  render() {
    if (this.props.loading || !Object.keys(this.props.facility).length) {
      return (
        <va-loading-indicator
          message={`Loading facility's ${
            this.props.service
          } appointment wait times...`}
        />
      );
    }

    if (this.props.error) {
      return <FacilityApiAlert />;
    }

    const isWaitTimeValid = waitTime =>
      typeof waitTime === 'number' && waitTime >= 0;
    const facility = this.props.facility.attributes;
    const service = this.props.service.split('(')[0].toLowerCase();
    const serviceExists = facility?.access?.health.find(
      s => s.service && s.service.toLowerCase() === service,
    );
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
            care. Check with your local VA medical center to confirm
            availability of these services.
          </p>
          <div className="usa-grid-full">
            <div className="vads-u-display--flex">
              {isWaitTimeValid(serviceExists.new) &&
                this.appointmentWaitTime(serviceExists.new, service)}
              {isWaitTimeValid(serviceExists.established) &&
                this.appointmentWaitTime(
                  serviceExists.established,
                  service,
                  true,
                )}
            </div>
            <div className="vads-l-row">
              <div
                id={`facility-${_.camelCase(
                  service,
                )}-appointment-wait-times-effective-date`}
              >
                <p className="vads-u-padding-top--2">
                  Current as of {formatDateLong(facility.access.effectiveDate)}
                </p>
                <p className="vads-u-margin--0">
                  <FacilityDataLink
                    facilityId={facility.uniqueId}
                    text="Learn more about VA appointment wait times"
                  />
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
