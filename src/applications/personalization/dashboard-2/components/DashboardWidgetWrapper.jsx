import React from 'react';

function DashboardWidgetWrapper({ children }) {
  return (
    <div className="vads-l-col--12 medium-screen:vads-l-col--8 small-desktop-screen:vads-l-col--6 medium-screen:vads-u-padding-right--3">
      {children}
    </div>
  );
}

export default DashboardWidgetWrapper;
