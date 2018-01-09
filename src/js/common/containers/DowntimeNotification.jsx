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

  static isServiceDown(...serviceNames) {
    if (!this.scheduledDowntime) return null;
    const now = moment();
    return serviceNames.some((serviceName) => {
      const service = this.scheduledDowntime.find(downtime => downtime.service === serviceName);
      if (!service) return false;
      return now.isSameOrAfter(service.startTime) && now.isSameOrBefore(service.endTime);
    });
  }

  componentWillMount() {
    if (this.props.scheduledDowntime && this.props.onScheduledDowntimeLoaded) {
      this.props.onScheduledDowntimeLoaded();
    } else {
      this.props.getScheduledDowntime();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.scheduledDowntime && this.props.scheduledDowntime) {
      // Move the downtime data into static-level to make it accessible to the helper function(s).
      DowntimeNotification.scheduledDowntime = this.props.scheduledDowntime;
      if (this.props.onScheduledDowntimeLoaded) this.props.onScheduledDowntimeLoaded();
    }
  }

  render() {
    if (!this.props.scheduledDowntime) return null;

    // const isDown = DowntimeNotification.isServiceDown(...this.props.dependencies);

    return <AlertBox content="Downtime Notification" isVisible status="info"/>;
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
