import React from 'react';
import PropTypes from 'prop-types';
import { externalServiceStatus } from '@department-of-veterans-affairs/platform-monitoring/exports';
import MHVDown from '../components/MHVDown';
import MHVDowntimeApproaching from '../components/MHVDowntimeApproaching';

function MHVDowntime({ children, endTime, status, startTime }) {
  const props = {
    endTime,
    startTime,
  };
  if (status === externalServiceStatus.downtimeApproaching) {
    return <MHVDowntimeApproaching {...props} />;
  }

  if (status === externalServiceStatus.down) {
    return <MHVDown {...props} />;
  }
  return children;
}

MHVDowntime.propTypes = {
  children: PropTypes.node,
  endTime: PropTypes.instanceOf(Date),
  startTime: PropTypes.instanceOf(Date),
  status: PropTypes.string,
};

export default MHVDowntime;
