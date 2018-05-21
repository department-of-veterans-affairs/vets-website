import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import { getScheduledDowntime } from '../actions';
import { getSoonestDowntime } from '../util/helpers';
import services from '../config/services';
import serviceStatus from '../config/serviceStatus';
import Down from '../components/Down';
import DowntimeApproaching from '../components/DowntimeApproaching';

/**
 * React component used to conditionally render children components based on the status (down, down-approaching, or ok) of Vets.gov services.
 * @property {string} [appTitle] - The name of the consuming application, which will be displayed in downtime messaging.
 * @property {node} [children] - React components to be rendered based on downtime.
 * @property {node} [content] - Alias for React.children.
 * @property {Array<string>} dependencies - An array of services that the consuming application requires in order to operate.
 * @property {function} getScheduledDowntime - [Provided by container] An action creator that retrieves the array of downtime from the API downtime endpoint.
 * @property {boolean} isReady - [Provided by container] A flag for indicating whether the downtime array has been retrieved from the API and if the component can render.
 * @property {Node} [loadingIndicator] - A React component that will be rendered while the request to the API for downtime information is pending.
 * @property {function} [render] - A function that may be supplied for custom rendering, useful for customizing how downtime/downtime approaching is handled. Receives the derived status, downtimeWindow, downtimeMap, children as arguments.
 * @module platorm/monitoring/DowntimeNotification
 */
class DowntimeNotification extends React.Component {

  static propTypes = {
    appTitle: PropTypes.string,
    children: PropTypes.node,
    content: PropTypes.node,
    dependencies: PropTypes.arrayOf(PropTypes.oneOf(Object.values(services))).isRequired,
    getScheduledDowntime: PropTypes.func.isRequired,
    isReady: PropTypes.bool,
    loadingIndicator: PropTypes.node,
    render: PropTypes.func
  };

  componentWillMount() {
    if (this.props.shouldSendRequest) this.props.getScheduledDowntime();
  }

  render() {
    if (!this.props.isReady) {
      return this.props.loadingIndicator || <LoadingIndicator message={`Checking the ${this.props.appTitle} status...`}/>;
    }

    const downtime = getSoonestDowntime(this.props.serviceMap, this.props.dependencies);
    const children = this.props.children || this.props.content;

    let content = children;

    if (downtime) {
      if (this.props.render) {
        content = this.props.render(downtime, children);
      } else if (downtime.status === serviceStatus.down) {
        content = (
          <Down
            appTitle={this.props.appTitle}
            endTime={downtime.endTime}/>
        );
      } else if (downtime.status === serviceStatus.downtimeApproaching) {
        content = (
          <DowntimeApproaching
            appTitle={this.props.appTitle}
            startTime={downtime.startTime}
            endTime={downtime.endTime}>{children}</DowntimeApproaching>
        );
      }
    }

    return content;
  }
}

const mapStateToProps = (state) => {
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
