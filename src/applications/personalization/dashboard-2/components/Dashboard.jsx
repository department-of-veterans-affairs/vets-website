import React, { useEffect } from 'react';

import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

import { focusElement } from '~/platform/utilities/ui';

import ApplyForBenefits from './apply-for-benefits/ApplyForBenefits';
import ClaimsAndAppeals from './claims-and-appeals/ClaimsAndAppeals';
import HealthCare from './health-care/HealthCare';

const Dashboard = () => {
  useEffect(() => {
    focusElement('#dashboard-title');
  });

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0">
      <Breadcrumbs>
        <a href="/" key="home">
          Home
        </a>
        <span className="vads-u-color--black" key="dashboard">
          <strong>My VA</strong>
        </span>
      </Breadcrumbs>

      <h1 id="dashboard-title" data-testid="dashboard-title" tabIndex="-1">
        My VA
      </h1>

      <ClaimsAndAppeals />
      <HealthCare />
      <ApplyForBenefits />
    </div>
  );
};

export default Dashboard;
