import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { VA_FORM_IDS } from 'platform/forms/constants';
import { formatDowntime } from 'platform/utilities/date';

import {
  getGlobalDowntime,
  getScheduledDowntime,
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
} from '../actions';

import Down from '../components/Down';
import DowntimeApproaching from '../components/DowntimeApproaching';

import externalServices from '../config/externalServices';
import externalServiceStatus from '../config/externalServiceStatus';
import { getSoonestDowntime } from '../util/helpers';
import { APP_TYPE_DEFAULT } from '../../../forms-system/src/js/constants';

/**
 * React component used to conditionally render children components based on the status (down, down-approaching, or ok) of VA.gov services.
 * @property {string} [appTitle] - The name of the consuming application, which will be displayed in downtime messaging.
 * @property {node} [children] - React components to be rendered based on downtime.
 * @property {node} [content] - Alias for React.children.
 * @property {Array<string>} dependencies - An array of services that the consuming application requires in order to operate.
 * @property {function} getScheduledDowntime - [Provided by container] An action creator that retrieves the array of downtime from the API downtime endpoint.
 * @property {boolean} isReady - [Provided by container] A flag for indicating whether the downtime array has been retrieved from the API and if the component can render.
 * @property {Node} [loadingIndicator] - A React component that will be rendered while the request to the API for downtime information is pending.
 * @property {function} [render] - A function that may be supplied for custom rendering, useful for customizing how downtime/downtime approaching is handled. Receives the derived status, downtimeWindow, downtimeMap, children as arguments.
 * @module platform/monitoring/DowntimeNotification
 */
class DowntimeNotification extends React.Component {
  static propTypes = {
    appTitle: PropTypes.string,
    children: PropTypes.node,
    content: PropTypes.node,
    dependencies: PropTypes.arrayOf(
      PropTypes.oneOf(Object.values(externalServices)),
    ).isRequired,
    getGlobalDowntime: PropTypes.func.isRequired,
    getScheduledDowntime: PropTypes.func.isRequired,
    isReady: PropTypes.bool,
    loadingIndicator: PropTypes.node,
    render: PropTypes.func,
  };

  static defaultProps = {
    dependencies: [],
  };

  componentDidMount() {
    // this.props.getGlobalDowntime();
    if (this.props.shouldSendRequest) this.props.getScheduledDowntime();
  }

  renderGlobalDowntimeOverride = appTypeContent => {
    const appType = Object.values(VA_FORM_IDS).includes(this.props.appTitle)
      ? appTypeContent
      : 'tool';

    const endTime = formatDowntime(this.props.globalDowntime.endTIme);

    return (
      <va-alert class="vads-u-margin-bottom--4" visible status="warning">
        <h3 slot="headline">This {appType} is down for maintenance</h3>
        <p>
          We’re making some updates to this {appType}. We’re sorry it’s not
          working right now and we hope to be finished by {endTime}. Please
          check back soon.
        </p>
      </va-alert>
    );
  };

  render() {
    const { customText } = this.props;

    const appType = customText?.appType || APP_TYPE_DEFAULT;

    if (this.props.globalDowntime) {
      return this.renderGlobalDowntimeOverride(appType);
    }

    if (!this.props.isReady) {
      return (
        this.props.loadingIndicator || (
          <va-loading-indicator
            message={`Checking the ${this.props.appTitle} status...`}
          />
        )
      );
    }

    const children = this.props.children || this.props.content;

    if (this.props.render) {
      return this.props.render(
        {
          externalService: this.props.externalService,
          status: this.props.status,
          startTime: this.props.startTime,
          endTime: this.props.endTime,
          description: this.props.description,
        },
        children,
      );
    }

    if (this.props.status === externalServiceStatus.downtimeApproaching) {
      return <DowntimeApproaching {...this.props} />;
    }

    if (this.props.status === externalServiceStatus.down) {
      return <Down {...this.props} />;
    }

    return children;
  }
}

// exported for unit tests
export const mapStateToProps = (state, ownProps) => {
  const {
    dismissedDowntimeWarnings,
    globalDowntime,
    isPending,
    isReady,
    serviceMap,
  } = state.scheduledDowntime;

  const shouldSendRequest = !isReady && !isPending;
  const isDowntimeWarningDismissed = dismissedDowntimeWarnings.includes(
    ownProps.appTitle,
  );

  const downtime = isReady
    ? getSoonestDowntime(serviceMap, ownProps.dependencies || [])
    : null;

  return {
    globalDowntime,
    isDowntimeWarningDismissed,
    isPending,
    isReady,
    shouldSendRequest,
    ...downtime,
  };
};

const mapDispatchToProps = {
  getGlobalDowntime,
  getScheduledDowntime,
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
};

export { DowntimeNotification };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DowntimeNotification);
