import React from 'react';

function DashboardWidgetWrapper({ children }) {
  return (
    <div
      data-testid="dashboard-widget-wrapper"
      className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3 small-desktop-screen:vads-l-col--6"
    >
      {children}
    </div>
  );
}

export default DashboardWidgetWrapper;
