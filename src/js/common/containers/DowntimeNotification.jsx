import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
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

function DowntimeNotificationWrapper({ status, children }) {
  return <div id="downtime-notification" data-status={status} style={{ marginBottom: '1em' }} className="row-padded">{children}</div>;
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
      modalDismissed: false,
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
      const downtimeWindow = this.getDowntimeWindow(downtimeMap[status]);
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
    const inclusive = '[]';
    if (now.isBetween(downtime.startTime, downtime.endTime, inclusive)) return serviceStatus.down;
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

    // Return the startTime/endTime as moment objects for the soonest downtime.
    return {
      startTime: soonestDowntime && moment(soonestDowntime.startTime),
      endTime: soonestDowntime && moment(soonestDowntime.endTime)
    };
  }

  // Converts the array of dependencies/service names into key/value pairs, with service statuses as keys and a list of
  // downtime information (each downtime corresponding to a dependency/service name) as the values.
  calculateDowntime(dependencies, scheduledDowntime) {
    const downtimeMap = {
      [serviceStatus.down]: [],
      [serviceStatus.downtimeApproaching]: [],
      [serviceStatus.ok]: [],
    };

    return dependencies

      // Get the corresponding downtime value by the name of the service/dependency
      .map((serviceName) => scheduledDowntime.find(downtime => downtime.service === serviceName))

      // Remove null values (services that have no known downtime)
      .filter(downtime => !!downtime)

      // Put each value into the corresponding status of the downtimeMap
      .reduce((map, downtime) => {
        const status = this.getStatusForDowntime(downtime);
        return {
          ...map,
          [status]: map[status].concat(downtime)
        };
      }, downtimeMap);
  }

  determineStatus(downtimeMap) {
    if (this.props.determineStatus) return this.props.determineStatus(downtimeMap);

    const statusDown = downtimeMap[serviceStatus.down].length > 0;
    const statusDownApproaching = downtimeMap[serviceStatus.downtimeApproaching].length > 0;
    const statusOk = !statusDown && !statusDownApproaching;

    if (statusOk) return serviceStatus.ok;
    if (statusDown) return serviceStatus.down;

    return serviceStatus.downtimeApproaching;
  }

  renderStatusDown({ endTime }) {
    const title = `The ${this.props.appTitle} is down for maintenance.`;
    let message = <p>We’re making some updates to {this.props.appTitle}. We’re sorry it’s not working right now. Please check back soon.</p>;
    if (endTime) {
      message = (
        <p>We’re making some updates to {this.props.appTitle}. We’re sorry it’s not working right now, and we hope to be finished by {endTime.format('MMMM Mo, LT')}. Please check back soon.</p>
      );
    }

    const downtimeNotification = <div><h2>{title}</h2>{message}</div>;

    return (
      <DowntimeNotificationWrapper status={serviceStatus.down}>
        {downtimeNotification}
      </DowntimeNotificationWrapper>
    );
  }

  renderStatusDownApproaching({ startTime, endTime }) {
    const title = `The ${this.props.appTitle} will be down for maintenance soon`;
    const message = <p>We'll be doing some work on {this.props.appTitle} on {startTime.format('MMMM Mo')} between {startTime.format('LT')} and {endTime.format('LT')} . If you have trouble using this tool during that time, please check back soon.</p>;
    let downtimeNotification = null;
    if (!this.state.modalDismissed) {
      const close = () => this.setState({ modalDismissed: true });
      downtimeNotification = (
        <Modal id="downtime-approaching-modal"
          title={title}
          onClose={close}
          visible={!this.state.modalDismissed}>
          {message}
          <button type="button" className="usa-button-secondary" onClick={close}>Dismiss</button>
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
      return this.props.loadingIndicator || <LoadingIndicator message={`Checking ${this.props.appTitle} status...`}/>;
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
    // The presenation varies based on the user's authentication status, so we wait for the profile.loading flag as well.
    isReady: state.scheduledDowntime.isReady,
    scheduledDowntime: state.scheduledDowntime.values
  };
};

const mapDispatchToProps = {
  getScheduledDowntime
};

export { DowntimeNotification };

export default connect(mapStateToProps, mapDispatchToProps)(DowntimeNotification);
