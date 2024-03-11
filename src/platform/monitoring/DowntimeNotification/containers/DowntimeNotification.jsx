import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { VA_FORM_IDS } from 'platform/forms/constants';
import { formatDowntime } from 'platform/utilities/date';

import {
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

// React component used to conditionally render children components based on the status (down, down-approaching, or ok) of VA.gov services.
// @property {string} [appTitle] - The title of the application or tool.
// @property {node} [children] - The content to render when the service is not down or approaching downtime.
// @property {node} [content] - The content to render when the service is not down or approaching downtime.
// @property {array} dependencies - An array of external services that the application or tool depends on.
// @property {node} [loadingIndicator] - The content to render while the status of the service is being determined.
// @property {function} [render] - A function that returns the content to render based on the status of the service.
// @returns {node} - The content to render based on the status of the service.

const DowntimeNotification = ({
  appTitle,
  children,
  content,
  dependencies,
  loadingIndicator,
  render,
}) => {
  const dispatch = useDispatch();
  const {
    dismissedDowntimeWarnings,
    globalDowntime,
    isPending,
    isReady,
    serviceMap,
  } = useSelector(state => state.scheduledDowntime);

  const shouldSendRequest = !isReady && !isPending;
  const isDowntimeWarningDismissed = dismissedDowntimeWarnings.includes(
    appTitle,
  );

  const downtime = isReady
    ? getSoonestDowntime(serviceMap, dependencies || [])
    : null;

  useEffect(
    () => {
      dispatch(initializeDowntimeWarnings());
      if (shouldSendRequest) dispatch(getScheduledDowntime());
    },
    [dispatch, shouldSendRequest],
  );

  const handleDismissDowntimeWarning = () => {
    dispatch(dismissDowntimeWarning(appTitle));
  };

  const renderGlobalDowntimeOverride = appTypeContent => {
    const appType = Object.values(VA_FORM_IDS).includes(appTitle)
      ? appTypeContent
      : 'tool';

    const endTime = formatDowntime(globalDowntime.endTime);

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

  if (globalDowntime) {
    return renderGlobalDowntimeOverride(APP_TYPE_DEFAULT);
  }

  if (!isReady) {
    return (
      loadingIndicator || (
        <va-loading-indicator message={`Checking the ${appTitle} status...`} />
      )
    );
  }

  const childrenContent = children || content;

  if (render) {
    return render(
      {
        appTitle,
        externalService: downtime?.externalService,
        status: downtime?.status,
        startTime: downtime?.startTime,
        endTime: downtime?.endTime,
        description: downtime?.description,
      },
      childrenContent,
    );
  }

  if (
    downtime?.status === externalServiceStatus.downtimeApproaching &&
    !isDowntimeWarningDismissed
  ) {
    return (
      <DowntimeApproaching
        {...downtime}
        onDismiss={handleDismissDowntimeWarning}
      />
    );
  }

  if (downtime?.status === externalServiceStatus.down) {
    return <Down {...downtime} />;
  }

  return childrenContent;
};

DowntimeNotification.propTypes = {
  appTitle: PropTypes.string,
  children: PropTypes.node,
  content: PropTypes.node,
  dependencies: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(externalServices)),
  ).isRequired,
  loadingIndicator: PropTypes.node,
  render: PropTypes.func,
};

DowntimeNotification.defaultProps = {
  dependencies: [],
};

export default DowntimeNotification;
