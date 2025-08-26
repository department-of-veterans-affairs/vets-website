import React, { useEffect } from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { dashboardBC, DASHBOARD_BC_LABEL } from '../utilities/poaRequests';
import Unauthorized from '../components/Dashboard/Unauthorized';
import Authorized from '../components/Dashboard/Authorized';

const DashboardPage = title => {
  useEffect(
    () => {
      document.title = title.title;
    },
    [title],
  );
  return (
    <section className="dashboard">
      <div className="arp-container">
        <VaBreadcrumbs
          breadcrumbList={dashboardBC}
          label={DASHBOARD_BC_LABEL}
          homeVeteransAffairs={false}
        />
        <Unauthorized />
        <Authorized />
      </div>
    </section>
  );
};

export default DashboardPage;
