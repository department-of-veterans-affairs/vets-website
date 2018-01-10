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
    content: PropTypes.object,
    customRender: PropTypes.func,
    dependencies: PropTypes.arrayOf(PropTypes.oneOf(Object.values(services))).isRequired,
    loadingIndicator: PropTypes.object,
    onReady: PropTypes.func,
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
    else if (this.props.onReady) this.props.onReady();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.scheduledDowntime && nextProps.scheduledDowntime) {
      DowntimeNotification.scheduledDowntime = nextProps.scheduledDowntime;  // Move the downtime data into static-level to make it accessible to the helper function(s).
      if (this.props.onReady) this.props.onReady();
    }
  }

  statusDownTemplate = (message) => {
    if (this.props.userIsAuthenticated) {
      return <h2>{message}</h2>;
    }
    return <AlertBox isVisible status="warning" content={message}/>;

  }

  statusDownApproachingTemplate = (message) => {
    if (this.props.userIsAuthenticated) {
      return (<Modal
        title="Downtime approaching"
        content={message}
        onClose={() => this.setState({ modalDismissed: true })}
        visible={!this.state.modalDismissed}/>);
    }
    return <AlertBox isVisible status="info" content={message}/>;

  }

  renderStatusDown() {
    const message = <span>The {this.props.appTitle} is down while we fix a few things.</span>;
    return this.statusDownTemplate(message);
  }

  renderStatusDownApproaching() {
    const message = <span>The {this.props.appTitle} will be down soon while we fix a few things.</span>;
    return this.statusDownApproachingTemplate(message);
  }

  render() {
    if (!this.props.scheduledDowntime) return this.props.loadingIndicator || <LoadingIndicator message={`Checking ${this.props.appTitle} status...`}/>;

    const statusMap = DowntimeNotification.getAllServiceStatuses(...this.props.dependencies);
    const statusDown = statusMap[serviceStatus.down].length > 0;
    const statusDownApproaching = statusMap[serviceStatus.downtimeApproaching].length > 0;
    const statusOk = !statusDown && !statusDownApproaching;

    if (statusOk) return this.props.children || this.props.content;

    if (this.props.customRender) {
      const derivedStatus = statusDown ? serviceStatus.down : serviceStatus.downtimeApproaching;
      const template = statusDown ? this.statusDownTemplate : this.statusDownApproachingTemplate;
      const children = this.props.children || this.props.content;
      return this.props.customRender(derivedStatus, statusMap, template, children);
    }

    const downtimeNotification = statusDown ? this.renderStatusDown() : this.renderStatusDownApproaching();
    const content = statusDown ? null : (this.props.children || this.props.content);

    return (
      <div className="row">
        {downtimeNotification}
        {content}
      </div>
    );
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
