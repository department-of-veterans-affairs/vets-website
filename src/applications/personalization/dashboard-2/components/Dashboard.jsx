import React from 'react';
import { Link } from 'react-router';

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
        <Link to="/" key="dashboard">
          My VA
        </Link>
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
