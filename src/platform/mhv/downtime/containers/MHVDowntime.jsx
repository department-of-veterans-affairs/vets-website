import React from 'react';
import PropTypes from 'prop-types';
import { externalServiceStatus } from '@department-of-veterans-affairs/platform-monitoring/exports';
import MHVDown from '../components/MHVDown';
import MHVDowntimeApproaching from '../components/MHVDowntimeApproaching';
import {
  coerceToDate,
  formatDatetime,
  formatElapsedHours,
} from '../utils/date';

function MHVDowntime({
  appTitle = 'some of our health tools',
  children = null,
  endTime,
  status,
  startTime,
}) {
  const start = coerceToDate(startTime);
  const end = coerceToDate(endTime);

  const startString = start ? formatDatetime(start) : '';
  const endString = end ? formatDatetime(end) : '';
  let timeInterval = 'some time';

  if (start && end) {
    timeInterval = formatElapsedHours(start, end);
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
  endTime: PropTypes.object, // Date|Moment object
  startTime: PropTypes.object, // Date|Moment object
  status: PropTypes.string,
};

export default MHVDowntime;
