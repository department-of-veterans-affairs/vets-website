import React from 'react';
import PropTypes from 'prop-types';
import { externalServiceStatus } from '@department-of-veterans-affairs/platform-monitoring/exports';
import MHVDown from '../components/MHVDown';
import MHVDowntimeApproaching from '../components/MHVDowntimeApproaching';
import { defaultLabel, mhvServiceLabels } from '../config';

function MHVDowntime({ children, externalService, status, ...passedProps }) {
  // TODO: Figure out appLabel here. Need to map services to apps
  const appLabel = Object.hasOwn(mhvServiceLabels, externalService)
    ? mhvServiceLabels[externalService]
    : defaultLabel;
  const props = {
    ...passedProps,
    appLabel,
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
  externalService: PropTypes.string,
  status: PropTypes.string,
};

export default MHVDowntime;
