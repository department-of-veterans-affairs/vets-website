import React from 'react';
import PropTypes from 'prop-types';
import objectValues from 'lodash/fp/values';
import { connect } from 'react-redux';

import { getScheduledDowntime } from './actions';

import moment from '../../../platform/startup/moment-setup';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import { getSoonestDowntime } from './util/helpers';
import dismissedDowntimeNotifications from './util/dismissedDowntimeNotifications';
import services from './config/services';
import serviceStatus from './config/serviceStatus';

export { services, serviceStatus };

function DowntimeNotificationWrapper({ status, children }) {
  return <div className="downtime-notification row-padded" data-status={status}>{children}</div>;
}

/**
 * Downtime object definition
 * @typedef Downtime
 * @type {object}
 * @property {string} service
 * @property {string} description
 * @property {Date} startTime
 * @property {Date} [endTime]
 */

/**
 * React component used to conditionally render children components based on the status (down, down-approaching, or ok) of Vets.gov services.
 * @property {string} [appTitle] - The name of the consuming application, which will be displayed in downtime messaging.
 * @property {node} [children] - React components to be rendered based on downtime.
 * @property {node} [content] - Alias for React.children.
 * @property {Array<string>} dependencies - An array of services that the consuming application requires in order to operate.
 * @property {function} [determineStatus] - A function that may optionally be supplied so that the consuming application can manually derive the status of an application. Receives a map containing statuses/services as its first argument.
 * @property {function} getScheduledDowntime - [Provided by container] An action creator that retrieves the array of downtime from the API downtime endpoint.
 * @property {boolean} isReady - [Provided by container] A flag for indicating whether the downtime array has been retrieved from the API and if the component can render.
 * @property {Node} [loadingIndicator] - A React component that will be rendered while the request to the API for downtime information is pending.
 * @property {function} [render] - A function that may be supplied for custom rendering, useful for customizing how downtime/downtime approaching is handled. Receives the derived status, downtimeWindow, downtimeMap, children as arguments.
 * @property {Array<Downtime>} scheduledDowntime - [Provided by container] The array of service downtime as provided by the API endpoint.
 * @module platorm/monitoring/DowntimeNotification
 */
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

  constructor(props) {
    super(props);
    dismissedDowntimeNotifications.setup();
    this.state = {
      modalDismissed: dismissedDowntimeNotifications.contains(props.appTitle),
      cache: {}
    };
  }

  componentWillMount() {
    if (this.props.shouldSendRequest) this.props.getScheduledDowntime();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (!nextProps.isReady) return false;
  //   if (nextProps.isReady && !this.props.isReady) return true;

  //   if (!this.props.render) return nextState.cache.status !== serviceStatus.down;
  // }

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

    const soonestDowntime = getSoonestDowntime(this.props.serviceMap, this.props.dependencies);

    return this.props.children;

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

const mapStateToProps = (state, ownProps) => {
  const shouldSendRequest = !state.scheduledDowntime.isReady && !state.scheduledDowntime.isPending;
  return {
    shouldSendRequest,
    ...state.scheduledDowntime
  };
};

const mapDispatchToProps = {
  getScheduledDowntime
};

export { DowntimeNotification };
export default connect(mapStateToProps, mapDispatchToProps)(DowntimeNotification);
