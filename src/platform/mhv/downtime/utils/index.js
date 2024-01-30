import React from 'react';
import { externalServiceStatus } from '@department-of-veterans-affairs/platform-monitoring/exports';
import MHVDown from '../components/MHVDown';

// render function suitable for passing to @department-of-veterans-affairs/platform-monitoring/DowntimeNotification
function renderMHVDowntime(props, children) {
  if (props.status === externalServiceStatus.downtimeApproaching) {
    // return <DowntimeApproaching {...props} {children} />;
    return 'TBD';
  }

  if (props.status === externalServiceStatus.down) {
    return <MHVDown {...props}>{children}</MHVDown>;
  }
  return children;
}

export { renderMHVDowntime };
