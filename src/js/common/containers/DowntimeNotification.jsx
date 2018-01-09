import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { getScheduledDowntime } from '../actions';
import AlertBox from '../components/AlertBox';

export const services = {
  appeals: 'appeals',
  arcgis: 'arcgis',
  emis: 'emis',
  es: 'es',
  evss: 'evss',
  idme: 'idme',
  mvi: 'mvi',
  mhv: 'mhv',
  tims: 'tims',
  vic: 'vic'
};

export const serviceDowntimeStatus = {
  down: 1,
  downtimeApproaching: 2,
  available: 3
};

class DowntimeNotification extends React.Component {

  static propTypes = {
    dependencies: PropTypes.arrayOf(PropTypes.oneOf(Object.values(services))).isRequired,
    onScheduledDowntimeLoaded: PropTypes.func,
    scheduledDowntime: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.string,
        description: PropTypes.string,
        startTime: PropTypes.instanceOf(Date),
        endTime: PropTypes.instanceOf(Date)
      })
    )
  };

  static getServiceStatus(serviceName, current = moment(), warning = moment().add(1, 'hour')) {
    const service = this.scheduledDowntime.find(downtime => downtime.service === serviceName);

    if (!service) return serviceDowntimeStatus.available;
    if (current.isSameOrAfter(service.startTime) && current.isSameOrBefore(service.endTime)) return serviceDowntimeStatus.down;
    if (warning.isSameOrAfter(service.startTime) && warning.isSameOrBefore(service.endTime)) return serviceDowntimeStatus.downtimeApproaching;

    return serviceDowntimeStatus.available;
  }

  static getApplicationStatus(...dependencies) {
    if (!this.scheduledDowntime) return null;

    const now = moment();
    const nextHour = moment().add(1, 'hour');

    return dependencies.reduce((worstStatus, serviceName) => {
      if (worstStatus === serviceDowntimeStatus.down) return worstStatus;

      const status = this.getServiceStatus(serviceName, now, nextHour);
      if (status === serviceDowntimeStatus.down || status === serviceDowntimeStatus.downtimeApproaching) return status;

      return worstStatus;
    }, serviceDowntimeStatus.available);
  }

  componentWillMount() {
    if (!DowntimeNotification.scheduledDowntime) this.props.getScheduledDowntime();
    else if (this.props.onScheduledDowntimeLoaded) this.props.onScheduledDowntimeLoaded();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.scheduledDowntime && nextProps.scheduledDowntime) {
      // Move the downtime data into static-level to make it accessible to the helper function(s).
      DowntimeNotification.scheduledDowntime = nextProps.scheduledDowntime;
      if (this.props.onScheduledDowntimeLoaded) this.props.onScheduledDowntimeLoaded();
    }
  }

  render() {
    if (!this.props.scheduledDowntime) return null;

    const applicationStatus = DowntimeNotification.getApplicationStatus(...this.props.dependencies);
    let message = '';

    switch (applicationStatus) {
      case serviceDowntimeStatus.down:
        message = 'Currently in downtime.';
        break;

      case serviceDowntimeStatus.downtimeApproaching:
        message = 'Downtime is approaching, uh oh.';
        break;

      case serviceDowntimeStatus.available:
      default:
        message = 'No downtime approaching - wahoo';
    }

    return <AlertBox content={message} isVisible status="info"/>;
  }

}

const mapStateToProps = (state) => {
  return {
    scheduledDowntime: state.scheduledDowntime
  };
};

const mapDispatchToProps = {
  getScheduledDowntime
};

export { DowntimeNotification };

export default connect(mapStateToProps, mapDispatchToProps)(DowntimeNotification);
