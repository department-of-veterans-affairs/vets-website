import React from 'react';
import PropTypes from 'prop-types';
import { externalServiceStatus } from '@department-of-veterans-affairs/platform-monitoring/exports';

import MHVDown from '../components/MHVDown';
import MHVDowntimeApproaching from '../components/MHVDowntimeApproaching';

function MHVDowntime({
  appTitle,
  children,
  endTime,
  dismissDowntimeWarning,
  isDowntimeWarningDismissed,
  status,
  startTime,
}) {
  const props = {
    appTitle,
    endTime,
    startTime,
  };
  if (status === externalServiceStatus.downtimeApproaching) {
    const dimissableProps = {
      dismissDowntimeWarning,
      isDowntimeWarningDismissed,
      ...props,
    };
    return <MHVDowntimeApproaching {...dimissableProps} />;
  }

  if (status === externalServiceStatus.down) {
    return <MHVDown {...props} />;
  }
  return children;
}

MHVDowntime.propTypes = {
  appTitle: PropTypes.string.isRequired,
  children: PropTypes.node,
  dismissDowntimeWarning: PropTypes.func,
  endTime: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.any, // Momentjs object
  ]),
  isDowntimeWarningDismissed: PropTypes.bool,
  startTime: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.any, // Momentjs object
  ]),
  status: PropTypes.string,
};

export default MHVDowntime;
