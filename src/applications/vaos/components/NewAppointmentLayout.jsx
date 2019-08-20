import React from 'react';

export default function NewAppointmentLayout({ children }) {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0">
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          {children}
        </div>
      </div>
    </div>
  );
}
