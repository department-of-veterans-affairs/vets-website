import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { getScheduledDowntime } from '../actions';
import AlertBox from '../components/AlertBox';
import Modal from '../components/Modal';
import LoadingIndicator from '../components/LoadingIndicator';

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

export const serviceStatus = {
  down: 'down',
  downtimeApproaching: 'downtimeApproaching',
  ok: 'ok'
};

class DowntimeNotification extends React.Component {

  static propTypes = {
    appTitle: PropTypes.string,
    children: PropTypes.object,
    content: PropTypes.node,
    dependencies: PropTypes.arrayOf(PropTypes.oneOf(Object.values(services))).isRequired,
    determineStatus: PropTypes.func,
    loadingIndicator: PropTypes.object,
    renderStatusDown: PropTypes.func,
    renderStatusDownApproaching: PropTypes.func,
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

  static getStatusForDowntime(downtime, current = moment(), warning = moment().add(1, 'hour')) {
    const inclusive = '[]';

    if (!downtime) return serviceStatus.ok;
    if (current.isBetween(downtime.startTime, downtime.endTime, inclusive)) return serviceStatus.down;
    if (warning.isBetween(downtime.startTime, downtime.endTime, inclusive)) return serviceStatus.downtimeApproaching;

    return serviceStatus.ok;
  }

  static getDowntimeForServices(...serviceNames) {
    const now = moment();
    const nextHour = moment().add(1, 'hour');
    const downtimeMap = {};

    Object.keys(serviceStatus).forEach((status) => { downtimeMap[status] = []; });

    return serviceNames
      .map((serviceName) => this.scheduledDowntime.find(downtime => downtime.service === serviceName))
      .reduce((map, downtime) => {
        const status = DowntimeNotification.getStatusForDowntime(downtime, now, nextHour);
        return {
          ...map,
          [status]: map[status].concat(downtime)
        };
      }, downtimeMap);
  }

  static getDowntimeWindow(downtimes) {
    return downtimes.reduce((result, downtime) => {
      const startTime = moment(downtime.startTime);
      const endTime = moment(downtime.endTime);
      return {
        startTime: result.startTime && result.startTime.isBefore(startTime) ? result.startTime : startTime,
        endTime: result.endTime && result.endTime.isAfter(endTime) ? result.endTime : endTime,
      };
    }, { start: null, end: null });
  }

  constructor(props) {
    super(props);
    this.state = { modalDismissed: false };
  }

  componentWillMount() {
    if (!this.props.scheduledDowntime) this.props.getScheduledDowntime();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.scheduledDowntime && nextProps.scheduledDowntime) {
      DowntimeNotification.scheduledDowntime = nextProps.scheduledDowntime;  // Move the downtime data into static-level to make it accessible to the helper function(s).
    }
  }

  determineStatus(downtimeMap) {
    const statusDown = downtimeMap[serviceStatus.down].length > 0;
    const statusDownApproaching = downtimeMap[serviceStatus.downtimeApproaching].length > 0;
    const statusOk = !statusDown && !statusDownApproaching;

    if (statusOk) return serviceStatus.ok;
    if (statusDown) return serviceStatus.down;

    return serviceStatus.downtimeApproaching;
  }

  renderStatusDown(downtimeMap) {
    const { startTime, endTime } = DowntimeNotification.getDowntimeWindow(downtimeMap.down);
    const title = <h2>The {this.props.appTitle} is down while we fix a few things.</h2>;
    const message = <p>We’re undergoing scheduled maintenance from {startTime.format('LT')} to {endTime.format('LT')}.</p>;

    if (this.props.userIsAuthenticated) {
      return (
        <div className="row-padded">
          {title}
          {message}
          <p>In the meantime, you can call 1-877-222-VETS (<a href="tel:+18772228387">1-877-222-8387</a>), Monday through Friday, 8:00 a.m. to 8:00 p.m. (<abbr title="eastern time">ET</abbr>).</p>
        </div>
      );
    }
    return (
      <div className="row-padded">
        <AlertBox isVisible status="warning" headline={title} content={message}/>;
      </div>
    );
  }

  renderStatusDownApproaching(downtimeMap) {
    const { startTime, endTime } = DowntimeNotification.getDowntimeWindow(downtimeMap.downtimeApproaching);
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
      <div className="row-padded">
        {downtimeNotification}
        {this.props.children || this.props.content}
      </div>
    );
  }

  render() {
    if (!this.props.scheduledDowntime) return this.props.loadingIndicator || <LoadingIndicator message={`Checking ${this.props.appTitle} status...`}/>;

    const downtimeMap = DowntimeNotification.getDowntimeForServices(...this.props.dependencies);
    const derivedStatus = this.props.determineStatus ? this.props.determineStatus(downtimeMap) : this.determineStatus(downtimeMap);
    const children = this.props.children || this.props.content;

    switch (derivedStatus) {
      case serviceStatus.down:
        return this.props.renderStatusDown ? this.props.renderStatusDown(downtimeMap, children) : this.renderStatusDown(downtimeMap);

      case serviceStatus.downtimeApproaching:
        return this.props.renderStatusDownApproaching ? this.props.renderStatusDownApproaching(downtimeMap, children) : this.renderStatusDownApproaching(downtimeMap);

      case serviceStatus.ok:
      default:
        return children;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    scheduledDowntime: state.scheduledDowntime,
    userIsAuthenticated: state.user.login.currentlyLoggedIn
  };
};

const mapDispatchToProps = {
  getScheduledDowntime
};

export { DowntimeNotification };

export default connect(mapStateToProps, mapDispatchToProps)(DowntimeNotification);
