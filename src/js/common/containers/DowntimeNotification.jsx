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

  static getServiceStatus(serviceName, current = moment(), warning = moment().add(1, 'hour')) {
    const service = this.scheduledDowntime.find(downtime => downtime.service === serviceName);
    const inclusive = '[]';

    if (!service) return serviceStatus.ok;
    if (current.isBetween(service.startTime, service.endTime, inclusive)) return serviceStatus.down;
    if (warning.isBetween(service.startTime, service.endTime, inclusive)) return serviceStatus.downtimeApproaching;

    return serviceStatus.ok;
  }

  static getAllServiceStatuses(...dependencies) {
    if (!this.scheduledDowntime) return null;

    const now = moment();
    const nextHour = moment().add(1, 'hour');
    const statusMap = {};

    Object.keys(serviceStatus).forEach((status) => { statusMap[status] = []; });

    dependencies.forEach((serviceName) => {
      const status = this.getServiceStatus(serviceName, now, nextHour);
      statusMap[status].push(serviceName);
    });

    return statusMap;
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

  determineStatus(statusMap) {
    const statusDown = statusMap[serviceStatus.down].length > 0;
    const statusDownApproaching = statusMap[serviceStatus.downtimeApproaching].length > 0;
    const statusOk = !statusDown && !statusDownApproaching;

    if (statusOk) return serviceStatus.ok;
    if (statusDown) return serviceStatus.down;

    return serviceStatus.downtimeApproaching;
  }

  renderStatusDown() {
    const title = <h2>The {this.props.appTitle} is down while we fix a few things.</h2>;
    if (this.props.userIsAuthenticated) {
      return (
        <div className="row-padded">
          {title}
          <p>We’ll be back up as soon as we can.</p>
          <p>In the meantime, you can call 1-877-222-VETS (<a href="tel:+18772228387">1-877-222-8387</a>), Monday through Friday, 8:00 a.m. to 8:00 p.m. (<abbr title="eastern time">ET</abbr>).</p>
        </div>
      );
    }
    return (
      <div className="row-padded">
        <AlertBox isVisible status="warning" headline={title}/>;
      </div>
    );
  }

  renderStatusDownApproaching() {
    const message = <span>The {this.props.appTitle} will be down soon while we fix a few things.</span>;
    const content = this.props.children || this.props.content;
    let downtimeNotification = null;
    if (this.props.userIsAuthenticated) {
      downtimeNotification = (<Modal
        title="Downtime approaching"
        content={message}
        onClose={() => this.setState({ modalDismissed: true })}
        visible={!this.state.modalDismissed}/>);
    } else {
      downtimeNotification = <AlertBox isVisible status="info" content={message}/>;
    }
    return (
      <div className="row-padded">
        {downtimeNotification}
        {content}
      </div>
    );
  }

  render() {
    if (!this.props.scheduledDowntime) return this.props.loadingIndicator || <LoadingIndicator message={`Checking ${this.props.appTitle} status...`}/>;

    const statusMap = DowntimeNotification.getAllServiceStatuses(...this.props.dependencies);
    const derivedStatus = this.props.determineStatus ? this.props.determineStatus(statusMap) : this.determineStatus(statusMap);
    const children = this.props.children || this.props.content;

    switch (derivedStatus) {
      case serviceStatus.down:
        return this.props.renderStatusDown ? this.props.renderStatusDown(children) : this.renderStatusDown();

      case serviceStatus.downtimeApproaching:
        return this.props.renderStatusDownApproaching ? this.props.renderStatusDownApproaching(children) : this.renderStatusDownApproaching();

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
