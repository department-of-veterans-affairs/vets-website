import React from 'react';
import MHVDowntime from './containers/MHVDowntime';

// render function suitable for passing to @department-of-veterans-affairs/platform-monitoring/DowntimeNotification
function renderMHVDowntime(props, children) {
  return <MHVDowntime {...props}>{children}</MHVDowntime>;
}

export { renderMHVDowntime };
