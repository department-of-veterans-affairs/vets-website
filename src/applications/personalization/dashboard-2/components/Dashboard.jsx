import React from 'react';

import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

import ApplyForBenefits from './apply-for-benefits/ApplyForBenefits';
import ClaimsAndAppeals from './claims-and-appeals/ClaimsAndAppeals';
import HealthCare from './health-care/HealthCare';

const Dashboard = () => {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--0">
      <Breadcrumbs>
        <a href="/" key="home">
          Home
        </a>
        <a to="/" key="dashboard">
          My VA
        </a>
      </Breadcrumbs>

      <h1 id="dashboard-title" tabIndex="-1">
        My VA
      </h1>

      <ClaimsAndAppeals />
      <HealthCare />
      <ApplyForBenefits />
    </div>
  );
};

export default Dashboard;
