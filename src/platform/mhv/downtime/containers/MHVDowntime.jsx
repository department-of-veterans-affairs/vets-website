import React from 'react';
import PropTypes from 'prop-types';
import { externalServiceStatus } from '@department-of-veterans-affairs/platform-monitoring/exports';
import MHVDown from '../components/MHVDown';
import MHVDowntimeApproaching from '../components/MHVDowntimeApproaching';
import { defaultLabel, mhvServiceLabels } from '../config';

function MHVDowntime({
  children,
  endTime,
  externalService,
  status,
  startTime,
}) {
  // TODO: Figure out appTitle here. Need to map services to apps
  const appTitle = Object.hasOwn(mhvServiceLabels, externalService)
    ? mhvServiceLabels[externalService]
    : defaultLabel;
  const props = {
    appTitle,
    endTime,
    startTime,
  };
  if (status === externalServiceStatus.downtimeApproaching) {
    return (
      <MHVDowntimeApproaching {...props}>{children}</MHVDowntimeApproaching>
    );
  }

  if (status === externalServiceStatus.down) {
    return <MHVDown {...props}>{children}</MHVDown>;
  }
  return children;
}

MHVDowntime.propTypes = {
  children: PropTypes.node,
  endTime: PropTypes.instanceOf(Date),
  externalService: PropTypes.string,
  startTime: PropTypes.instanceOf(Date),
  status: PropTypes.string,
};

export default MHVDowntime;
