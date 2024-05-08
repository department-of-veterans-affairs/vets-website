import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { VA_FORM_IDS } from 'platform/forms/constants';
import { formatDowntime } from 'platform/utilities/date';

import { getScheduledDowntime } from '../actions';

import Down from '../components/Down';
import DowntimeApproaching from '../components/DowntimeApproaching';

import externalServices from '../config/externalServices';
import externalServiceStatus from '../config/externalServiceStatus';
import { getSoonestDowntime } from '../util/helpers';
import { APP_TYPE_DEFAULT } from '../../../forms-system/src/js/constants';

const DowntimeNotification = ({
  appTitle,
  children,
  content,
  dependencies = [],
  loadingIndicator,
  render,
}) => {
  const dispatch = useDispatch();
  const {
    // dismissedDowntimeWarnings,
    globalDowntime,
    isPending,
    isReady,
    serviceMap,
  } = useSelector(state => state.scheduledDowntime);

  const shouldSendRequest = !isReady && !isPending;
  // const isDowntimeWarningDismissed = dismissedDowntimeWarnings.includes(
  //   appTitle,
  // );

  const downtime = isReady
    ? getSoonestDowntime(serviceMap, dependencies)
    : null;

  useEffect(
    () => {
      if (shouldSendRequest) dispatch(getScheduledDowntime());
    },
    [dispatch, shouldSendRequest],
  );

  const renderGlobalDowntimeOverride = appTypeContent => {
    const appType = Object.values(VA_FORM_IDS).includes(appTitle)
      ? appTypeContent
      : 'tool';

    const endTime = formatDowntime(globalDowntime.endTIme);

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

  const { customText } = downtime;
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

  if (render) {
    return render(
      {
        appTitle,
        externalService: downtime.externalService,
        status: downtime.status,
        startTime: downtime.startTime,
        endTime: downtime.endTime,
        description: downtime.description,
      },
      children || content,
    );
  }

  if (downtime.status === externalServiceStatus.downtimeApproaching) {
    return <DowntimeApproaching {...downtime} />;
  }

  if (downtime.status === externalServiceStatus.down) {
    return <Down {...downtime} />;
  }

  return children || content;
};

DowntimeNotification.propTypes = {
  dependencies: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(externalServices)),
  ).isRequired,
  appTitle: PropTypes.string,
  children: PropTypes.node,
  content: PropTypes.node,
  loadingIndicator: PropTypes.node,
  render: PropTypes.func,
};

export default DowntimeNotification;
