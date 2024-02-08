import React from 'react';
import PropTypes from 'prop-types';
import { externalServiceStatus } from '@department-of-veterans-affairs/platform-monitoring/exports';
import MHVDown from '../components/MHVDown';
import MHVDowntimeApproaching from '../components/MHVDowntimeApproaching';

function MHVDowntime({
  appTitle = 'some of our health tools',
  children = null,
  endTime,
  status,
  startTime,
}) {
  const props = {
    appTitle,
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
  appTitle: PropTypes.string,
  children: PropTypes.node,
  endTime: PropTypes.object, // Date|Moment object
  startTime: PropTypes.object, // Date|Moment object
  status: PropTypes.string,
};

export default MHVDowntime;
