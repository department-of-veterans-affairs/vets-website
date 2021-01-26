import React from 'react';

import ApplyForBenefits from './apply-for-benefits/ApplyForBenefits';
import ClaimsAndAppeals from './claims-and-appeals/ClaimsAndAppeals';
import Healthcare from './healthcare/Healthcare';

const Dashboard = () => {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--0">
      <ClaimsAndAppeals />
      <Healthcare />
      <ApplyForBenefits />
    </div>
  );
};

export default Dashboard;
