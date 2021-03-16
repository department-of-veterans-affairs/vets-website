import React from 'react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import NeedHelp from '../../../components/NeedHelp';

export default function PageLayout({
  children,
  showBreadcrumbs,
  showNeedHelp,
}) {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
      {showBreadcrumbs && <Breadcrumbs />}
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--2">
          {children}
          {showNeedHelp && <NeedHelp />}
        </div>
      </div>
    </div>
  );
}
