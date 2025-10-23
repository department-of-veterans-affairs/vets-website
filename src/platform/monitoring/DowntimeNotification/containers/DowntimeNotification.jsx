import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { VA_FORM_IDS } from 'platform/forms/constants';
import { formatDowntime } from 'platform/utilities/date';

import {
  getGlobalDowntime,
  getScheduledDowntime as getScheduledDowntimeFunc,
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
const DowntimeNotification = props => {
  const {
    appTitle,
    getScheduledDowntime,
    isReady,
    children,
    content,
    loadingIndicator,
    render,
    customText,
    globalDowntime,
    shouldSendRequest,
    status,
    startTime,
    endTime,
    description,
    externalService,
  } = props;

  useEffect(
    () => {
      // getGlobalDowntime();
      if (shouldSendRequest) getScheduledDowntime();
    },
    [shouldSendRequest, getScheduledDowntime],
  );

  const renderGlobalDowntimeOverride = appTypeContent => {
    const appType = Object.values(VA_FORM_IDS).includes(appTitle)
      ? appTypeContent
      : 'tool';
    const end = formatDowntime(globalDowntime?.endTime ?? new Date());
    return (
      <va-alert class="vads-u-margin-bottom--4" visible status="warning">
        <h3 slot="headline">This {appType} is down for maintenance</h3>
        <p>
          We’re making some updates to this {appType}. We’re sorry it’s not
          working right now and we hope to be finished by {end}. Please check
          back soon.
        </p>
      </va-alert>
    );
  };

  const appType = customText?.appType || APP_TYPE_DEFAULT;

  if (globalDowntime) {
    return renderGlobalDowntimeOverride(appType);
  }

  if (!isReady) {
    return (
      loadingIndicator || (
        <va-loading-indicator message={`Checking the ${appTitle} status...`} />
      )
    );
  }

  const childrenToRender = children || content;

  if (render) {
    return render(
      {
        appTitle,
        externalService,
        status,
        startTime,
        endTime,
        description,
      },
      childrenToRender,
    );
  }

  if (status === externalServiceStatus.downtimeApproaching) {
    return <DowntimeApproaching {...props} />;
  }

  if (status === externalServiceStatus.down) {
    return <Down {...props} appType={appType} headerLevel={2} />;
  }

  return childrenToRender;
};

DowntimeNotification.propTypes = {
  appTitle: PropTypes.string.isRequired,
  dependencies: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(externalServices)),
  ).isRequired,
  dismissDowntimeWarning: PropTypes.func.isRequired,
  getGlobalDowntime: PropTypes.func.isRequired,
  getScheduledDowntime: PropTypes.func.isRequired,
  initializeDowntimeWarnings: PropTypes.func.isRequired,
  children: PropTypes.node,
  content: PropTypes.node,
  customText: PropTypes.object,
  description: PropTypes.string,
  endTime: PropTypes.instanceOf(Date),
  externalService: PropTypes.string,
  globalDowntime: PropTypes.object,
  isReady: PropTypes.bool,
  loadingIndicator: PropTypes.node,
  render: PropTypes.func,
  shouldSendRequest: PropTypes.bool,
  startTime: PropTypes.instanceOf(Date),
  status: PropTypes.string,
};

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
  getScheduledDowntime: getScheduledDowntimeFunc,
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
};

export { DowntimeNotification };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DowntimeNotification);
