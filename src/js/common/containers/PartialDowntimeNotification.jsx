import React from 'react';
import { DowntimeNotification, DowntimeNotificationWrapper, serviceStatus } from './DowntimeNotification';
import { connect } from 'react-redux';
import { getScheduledDowntime, setCurrentStatus, unsetCurrentStatus } from '../actions';

export function renderPartialDowntime(appTitle, downtimeWindow, downtimeMap, children) {
  return (
    <DowntimeNotificationWrapper status={serviceStatus.down} className="">
      {children}
    </DowntimeNotificationWrapper>
  );
}

export function PartialDowntimeNotification(props) {
  return (
    <DowntimeNotification
      renderDown={renderPartialDowntime}
      {...props}/>
  );
}

const mapStateToProps = (state) => {
  return {
    isReady: state.scheduledDowntime.isReady,
    scheduledDowntime: state.scheduledDowntime.values
  };
};

const mapDispatchToProps = {
  getScheduledDowntime,
  setCurrentStatus,
  unsetCurrentStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(PartialDowntimeNotification);
