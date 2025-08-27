import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { dashboardBC, DASHBOARD_BC_LABEL } from '../utilities/poaRequests';
import Unauthorized from '../components/Dashboard/Unauthorized';
import Authorized from '../components/Dashboard/Authorized';

const DashboardPage = props => {
  const { title } = props || {};
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const unauthorizedParam = (params.get('unauthorized') || '').toLowerCase();
  const isUnauthorized = ['1', 'true', 'yes'].includes(unauthorizedParam);

  useEffect(
    () => {
      if (title) document.title = title;
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
        {isUnauthorized ? <Unauthorized /> : <Authorized />}
      </div>
    </section>
  );
};

export default DashboardPage;
