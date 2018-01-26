import React from 'react';
import PropTypes from 'prop-types';
import moment from '../utils/moment-setup';
import objectValues from 'lodash/fp/values';
import { connect } from 'react-redux';
import { getScheduledDowntime } from '../actions';
import Modal from '../components/Modal';
import LoadingIndicator from '../components/LoadingIndicator';

export const services = {
  appeals: 'appeals',
  arcgis: 'arcgis',
  dslogon: 'dslogon',
  emis: 'emis',
  es: 'es',
  evss: 'evss',
  idme: 'idme',
  mvi: 'mvi',
  mhv: 'mhv',
  tims: 'tims',
  vic: 'vic'
};

export const serviceStatus = {
  down: 'down',
  downtimeApproaching: 'downtimeApproaching',
  ok: 'ok'
};

// Simple data structure that abstracts away add/removing dismissed flags in the session.
// The Downtime Approaching warning should only be shown once, so we store that flag in the session.
// We store it using the appTitle (which should be unique to the app) in an array so that other apps
// that may be experiencing downtime will still have the warning.
const dismissedDowntimeNotifications = (() => {
  const key = 'downtime-notifications-dismissed';
  const rawData = window.sessionStorage.getItem(key);
  const _dismissedDowntimeNotifications = rawData ? JSON.parse(rawData) : [];

  return {
    contains(appTitle) {
      return _dismissedDowntimeNotifications.find(_appTitle => _appTitle === appTitle);
    },
    push(appTitle) {
      _dismissedDowntimeNotifications.push(appTitle);
      window.sessionStorage.setItem(key, JSON.stringify(_dismissedDowntimeNotifications));
    }
  };
})();

function DowntimeNotificationWrapper({ status, children }) {
  return <div className="downtime-notification row-padded" data-status={status}>{children}</div>;
}

class DowntimeNotification extends React.Component {

  static propTypes = {
    appTitle: PropTypes.string,
    children: PropTypes.node,
    content: PropTypes.node,
    dependencies: PropTypes.arrayOf(PropTypes.oneOf(objectValues(services))).isRequired,
    determineStatus: PropTypes.func,
    getScheduledDowntime: PropTypes.func.isRequired,
    isReady: PropTypes.bool,
    loadingIndicator: PropTypes.node,
    render: PropTypes.func,
    scheduledDowntime: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.string,
        description: PropTypes.string,
        startTime: PropTypes.instanceOf(Date),
        endTime: PropTypes.instanceOf(Date)
      })
    )
  };

  static defaultProps = {
    appTitle: 'application'
  };

  constructor(props) {
    super(props);
    this.state = {
      modalDismissed: dismissedDowntimeNotifications.contains(props.appTitle),
      cache: {}
    };
  }

  componentWillMount() {
    this.props.getScheduledDowntime();
  }

  // This is here just for caching the result of calculateDowntime, so that it isn't run every time a prop changes.
  // Currently, this component should only do its calculations once, because it would be weird if in the middle of filling
  // out a form a modal or alert appears alerting them of downtime, or if it just shuts down the app because we entered
  // scheduled downtime.
  componentWillReceiveProps(newProps) {
    const firstLoad = newProps.isReady && !this.props.isReady;
    if (firstLoad) {
      const downtimeMap = this.calculateDowntime(newProps.dependencies, newProps.scheduledDowntime);
      const status = this.determineStatus(downtimeMap);
      const downtimeWindow = status !== serviceStatus.ok ? this.getDowntimeWindow(downtimeMap.get(status)) : {};
      const cache = { downtimeMap, status, downtimeWindow };
      this.setState({ cache });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.isReady) return false;
    if (nextProps.isReady && !this.props.isReady) return true;

    return nextState.cache.status !== serviceStatus.down;
  }

  getStatusForDowntime(downtime, now = moment()) {
    // If the current time is after the start...
    if (now.isSameOrAfter(downtime.startTime)) {
      // endTime is not required - so if it's omitted or if the current time is before endTime,
      // we know the status is down.
      if (!downtime.endTime || now.isBefore(downtime.endTime)) {
        return serviceStatus.down;
      }
    }
    if (now.add(1, 'hour').isAfter(downtime.startTime)) return serviceStatus.downtimeApproaching;
    return serviceStatus.ok;
  }

  // This is used to calculate the timeframe of the current or impending downtime.
  // To keep things simple, it finds the downtime with the soonest start time and uses those
  // start/end times.
  getDowntimeWindow(downtimes) {
    // Cycle through the array of downtimes and find the downtime with the soonest start time.
    const soonestDowntime = downtimes.reduce((currentSoonest, downtime) => {
      if (!currentSoonest) return downtime;

      const isEarlier = moment(downtime.startTime).isBefore(currentSoonest.startTime);
      return isEarlier ? downtime : currentSoonest;
    }, null);

    // Return the soonest startTime and the corresponding endTime as moment objects.
    return {
      startTime: moment(soonestDowntime.startTime),
      endTime: soonestDowntime.endTime && moment(soonestDowntime.endTime)
    };
  }

  // Converts the array of dependencies/service names into key/value pairs, with service statuses as keys and a list of
  // downtime information (each downtime corresponding to a dependency/service name) as the values.
  // Ultimately a Map that looks like this (but as a Map):
  // {
  //   "ok": []
  //   "downApproaching": [{ serviceName: "arcgis", description: "We never show this anyway", startTime: new Date("Sometime within the hour"), endTime: new Date() }],
  //   "down": []
  // }
  calculateDowntime(dependencies, scheduledDowntime) {
    const downtimeMap = new Map();

    // Initialize each status to an empty array so that we don't have to check for null values
    // when we pass the map along to other functions.
    for (const status of objectValues(serviceStatus)) {
      downtimeMap.set(status, []);
    }

    // Loop through the dependencies, which is just a string of service names.
    // Find the corresponding downtime using that service name value.
    // Then, determine the status of that downtime by using a helper function.
    // Finally, add that downtime into the array of the corresponding status in the map.
    for (const serviceName of dependencies) {
      const downtime = scheduledDowntime.find(d => d.service === serviceName);
      if (downtime) {
        const status = this.getStatusForDowntime(downtime);
        const downtimesForStatus = downtimeMap.get(status).concat(downtime);
        downtimeMap.set(status, downtimesForStatus);
      }
    }

    return downtimeMap;
  }

  determineStatus(downtimeMap) {
    if (this.props.determineStatus) return this.props.determineStatus(downtimeMap);

    const statusDown = downtimeMap.get(serviceStatus.down).length > 0;
    const statusDownApproaching = downtimeMap.get(serviceStatus.downtimeApproaching).length > 0;
    const statusOk = !statusDown && !statusDownApproaching;

    if (statusOk) return serviceStatus.ok;
    if (statusDown) return serviceStatus.down;

    return serviceStatus.downtimeApproaching;
  }

  dismissModal = () => {
    dismissedDowntimeNotifications.push(this.props.appTitle);
    this.setState({ modalDismissed: true });
  }

  renderStatusDown({ endTime }) {
    let message = <p>We’re making some updates to the {this.props.appTitle}. We’re sorry it’s not working right now. Please check back soon.</p>;
    if (endTime) {
      message = (
        <p>We’re making some updates to the {this.props.appTitle}. We’re sorry it’s not working right now, and we hope to be finished by {endTime.format('MMMM Do, LT')} Please check back soon.</p>
      );
    }
    return (
      <DowntimeNotificationWrapper status={serviceStatus.down}>
        <div className="usa-content">
          <h3>The {this.props.appTitle} is down for maintenance</h3>
          {message}
        </div>
      </DowntimeNotificationWrapper>
    );
  }

  renderStatusDownApproaching({ startTime, endTime }) {
    let downtimeNotification = null;
    if (!this.state.modalDismissed) {
      downtimeNotification = (
        <Modal id="downtime-approaching-modal"
          onClose={this.dismissModal}
          visible={!this.state.modalDismissed}>
          <h3>The {this.props.appTitle} will be down for maintenance soon</h3>
          <p>We’ll be doing some work on the {this.props.appTitle} on {startTime.format('MMMM Do')} between {startTime.format('LT')} and {endTime.format('LT')} If you have trouble using this tool during that time, please check back soon.</p>
          <button type="button" className="usa-button-secondary" onClick={this.dismissModal}>Dismiss</button>
        </Modal>);
    }
    return (
      <DowntimeNotificationWrapper status={serviceStatus.downtimeApproaching}>
        {downtimeNotification}
        {this.props.children || this.props.content}
      </DowntimeNotificationWrapper>
    );
  }

  render() {
    if (!this.props.isReady) {
      return this.props.loadingIndicator || <LoadingIndicator message={`Checking the ${this.props.appTitle} status...`}/>;
    }

    const { downtimeMap, status, downtimeWindow } = this.state.cache;
    const children = this.props.children || this.props.content;

    if (this.props.render) return this.props.render(status, downtimeWindow, downtimeMap, children);

    switch (status) {
      case serviceStatus.down:
        return this.renderStatusDown(downtimeWindow);

      case serviceStatus.downtimeApproaching:
        return this.renderStatusDownApproaching(downtimeWindow);

      case serviceStatus.ok:
      default:
        return children;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    isReady: state.scheduledDowntime.isReady,
    scheduledDowntime: state.scheduledDowntime.values
  };
};

const mapDispatchToProps = {
  getScheduledDowntime
};

export { DowntimeNotification };

export default connect(mapStateToProps, mapDispatchToProps)(DowntimeNotification);
