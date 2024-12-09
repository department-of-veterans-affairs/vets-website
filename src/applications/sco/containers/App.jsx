import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import MainContent from '../components/MainContent';
import HubRail from '../components/HubRail';

const App = () => {
  return (
    <div>
      <div className="row">
        {/* Delete lines 11 - 25 to rremove alert */}
        <div className="vads-u-margin-top--2p5">
          <va-alert
            closeBtnAriaLabel="Close notification"
            slim
            full-width="false"
            status="warning"
            visible
          >
            <p className="vads-u-margin-y--0">
              VA is aware of the Chapter 33, 6-credit hour exclusion (6x)
              technical issue and is actively working on a solution. We will
              keep you informed as we have updates.
            </p>
          </va-alert>
        </div>
        {/* Delete lines 11 - 25 to remove alert  */}

        <VaBreadcrumbs
          breadcrumbList={[
            {
              href: '/',
              label: 'Home',
            },
            {
              href: '/school-administrators/',
              label: 'Resources for schools ',
            },
          ]}
          label="Breadcrumb"
        />
      </div>
      <div className="row">
        <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
          <div className="vads-l-row medium-screen:vads-u-margin-x--neg2p5">
            <MainContent />
            <HubRail />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
