import React from 'react';

export default function FullWidthLayout({ children }) {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 desktop-lg:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
      <div className="vads-l-row">
        <div className="vads-l-col--12">{children}</div>
      </div>
    </div>
  );
}
