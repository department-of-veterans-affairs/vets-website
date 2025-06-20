import React from 'react';
import PropTypes from 'prop-types';
import { externalServiceStatus } from '@department-of-veterans-affairs/platform-monitoring/exports';
import MHVDown from '../components/MHVDown';
import MHVDowntimeApproaching from '../components/MHVDowntimeApproaching';
import { formatDatetime, formatElapsedHours } from '../utils/date';

function MHVDowntime({
  appTitle = 'our health tools',
  children = null,
  endTime,
  status,
  startTime,
}) {
  const startString = startTime ? formatDatetime(startTime) : '';
  const endString = endTime ? formatDatetime(endTime) : '';
  let timeInterval = 'some time';

  if (startTime instanceof Date && endTime instanceof Date) {
    timeInterval = formatElapsedHours(startTime, endTime);
  }

  const props = {
    appTitle,
    endString,
    startString,
    timeInterval,
  };
  if (status === externalServiceStatus.downtimeApproaching) {
    return (
      <>
        <MHVDowntimeApproaching {...props} />
        {children}
      </>
    );
  }

  if (status === externalServiceStatus.down) {
    return <MHVDown {...props} />;
  }
  return children;
}

MHVDowntime.propTypes = {
  appTitle: PropTypes.string,
  children: PropTypes.node,
  endTime: PropTypes.object, // Date object
  startTime: PropTypes.object, // Date object
  status: PropTypes.string,
};

export default MHVDowntime;
