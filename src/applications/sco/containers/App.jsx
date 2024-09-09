import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import MainContent from '../components/MainContent';
import HubRail from '../components/HubRail';

const App = () => {
  return (
    <div>
      <div className="row">
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
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
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
