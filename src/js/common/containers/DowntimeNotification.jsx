import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import objectValues from 'lodash/fp/values';
import { connect } from 'react-redux';
import { getScheduledDowntime } from '../actions';
import AlertBox from '../components/AlertBox';
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

function DowntimeNotificationWrapper({ children }) {
  return <div id="downtime-notification" style={{ marginBottom: '1em' }} className="row-padded">{children}</div>;
}

class DowntimeNotification extends React.Component {

  static propTypes = {
    appTitle: PropTypes.string,
    children: PropTypes.node,
    content: PropTypes.node,
    dependencies: PropTypes.arrayOf(PropTypes.oneOf(objectValues(services))).isRequired,
    determineStatus: PropTypes.func,
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
    ),
    userIsAuthenticated: PropTypes.bool
  };

  static defaultProps = {
    appTitle: 'application'
  };

  constructor(props) {
    super(props);
    this.state = { modalDismissed: false };
  }

  componentWillMount() {
    if (!this.props.isReady) this.props.getScheduledDowntime();
  }

  // This is only to be calculated on page load.
  shouldComponentUpdate() {
    return !this.props.isReady;
  }

  getStatusForDowntime(downtime, current = moment(), warning = moment().add(1, 'hour')) {
    const inclusive = '[]';

    if (!downtime) return serviceStatus.ok;
    if (current.isBetween(downtime.startTime, downtime.endTime, inclusive)) return serviceStatus.down;
    if (warning.isBetween(downtime.startTime, downtime.endTime, inclusive)) return serviceStatus.downtimeApproaching;

    return serviceStatus.ok;
  }

  getDowntimeForDependencies() {
    const now = moment();
    const nextHour = moment().add(1, 'hour');
    const downtimeMap = {};

    Object.keys(serviceStatus).forEach((status) => { downtimeMap[status] = []; });

    return this.props.dependencies
      .map((serviceName) => this.props.scheduledDowntime.find(downtime => downtime.service === serviceName))
      .reduce((map, downtime) => {
        const status = this.getStatusForDowntime(downtime, now, nextHour);
        return {
          ...map,
          [status]: map[status].concat(downtime)
        };
      }, downtimeMap);
  }

  getDowntimeWindow(downtimes) {
    return downtimes.reduce((result, downtime) => {
      const startTime = moment(downtime.startTime);
      const endTime = moment(downtime.endTime);
      return {
        startTime: result.startTime && result.startTime.isBefore(startTime) ? result.startTime : startTime,
        endTime: result.endTime && result.endTime.isAfter(endTime) ? result.endTime : endTime,
      };
    }, {});
  }

  determineStatus(downtimeMap) {
    const statusDown = downtimeMap[serviceStatus.down].length > 0;
    const statusDownApproaching = downtimeMap[serviceStatus.downtimeApproaching].length > 0;
    const statusOk = !statusDown && !statusDownApproaching;

    if (statusOk) return serviceStatus.ok;
    if (statusDown) return serviceStatus.down;

    return serviceStatus.downtimeApproaching;
  }

  renderStatusDown({ startTime, endTime }) {
    const title = <h4>The {this.props.appTitle} is down while we fix a few things.</h4>;
    const message = (
      <div><p>We’re undergoing scheduled maintenance from {startTime.format('LT')} to {endTime.format('LT')}.<br/>
      In the meantime, you can call 1-877-222-VETS (<a href="tel:+18772228387">1-877-222-8387</a>), Monday through Friday, 8:00 a.m. to 8:00 p.m. (<abbr title="eastern time">ET</abbr>).</p></div>
    );

    if (this.props.userIsAuthenticated) {
      return <DowntimeNotificationWrapper>{title}{message}</DowntimeNotificationWrapper>;
    }
    return (
      <DowntimeNotificationWrapper>
        <AlertBox isVisible status="warning" headline={title} content={message}/>
      </DowntimeNotificationWrapper>
    );
  }

  renderStatusDownApproaching({ startTime, endTime }) {
    const message = <p>We’re undergoing scheduled maintenance from {startTime.format('LT')} to {endTime.format('LT')}.</p>;
    let downtimeNotification = null;
    if (this.props.userIsAuthenticated) {
      if (!this.state.modalDismissed) {
        const close = () => this.setState({ modalDismissed: true });
        downtimeNotification = (
          <Modal id="downtime-approaching"
            title="Downtime approaching"
            onClose={close}
            visible={!this.state.modalDismissed}>
            {message}
            <button type="button" className="usa-button-secondary" onClick={close}>Dismiss</button>
          </Modal>);
      }
    } else {
      downtimeNotification = <AlertBox isVisible status="info" content={message}/>;
    }
    return (
      <DowntimeNotificationWrapper>
        {downtimeNotification}
        {this.props.children || this.props.content}
      </DowntimeNotificationWrapper>
    );
  }

  render() {
    if (!this.props.isReady) return this.props.loadingIndicator || <LoadingIndicator message={`Checking ${this.props.appTitle} status...`}/>;

    const downtimeMap = this.getDowntimeForDependencies();
    const derivedStatus = this.props.determineStatus ? this.props.determineStatus(downtimeMap) : this.determineStatus(downtimeMap);
    const downtimeWindow = this.getDowntimeWindow(downtimeMap[derivedStatus]);
    const children = this.props.children || this.props.content;

    if (this.props.render) return this.props.render(derivedStatus, downtimeWindow, downtimeMap, children);

    switch (derivedStatus) {
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
    scheduledDowntime: state.scheduledDowntime.values,
    userIsAuthenticated: state.user.login.currentlyLoggedIn
  };
};

const mapDispatchToProps = {
  getScheduledDowntime
};

export { DowntimeNotification };

export default connect(mapStateToProps, mapDispatchToProps)(DowntimeNotification);
