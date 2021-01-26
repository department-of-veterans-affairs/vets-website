import React from 'react';

import ApplyForBenefits from './apply-for-benefits/ApplyForBenefits';
import ClaimsAndAppeals from './claims-and-appeals/ClaimsAndAppeals';
import HealthCare from './health-care/HealthCare';

const Dashboard = () => {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--0">
      <ClaimsAndAppeals />
      <HealthCare />
      <ApplyForBenefits />
    </div>
  );
};

export default Dashboard;
