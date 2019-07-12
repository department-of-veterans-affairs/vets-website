import React from 'react';

export default function SidebarRightLayout({
  breadcrumbs,
  heading,
  body,
  sidebar,
}) {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12">{breadcrumbs}</div>
      </div>
      {!!heading && (
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5">{heading}</div>
        </div>
      )}
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
          {body}
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 help-sidebar">
          {sidebar}
        </div>
      </div>
    </div>
  );
}
