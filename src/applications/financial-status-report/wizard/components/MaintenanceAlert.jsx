import React from 'react';

export const MaintenanceAlert = () => {
  return (
    <va-alert
      class="row vads-u-margin-top--3 vads-u-margin-left--1"
      status="info"
    >
      <h3 slot="headline">
        The online financial help request form (VA Form 5655) is down for
        maintenance
      </h3>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        We’re making some updates to the online financial help request form (VA
        Form 5655). We’re sorry it’s not working right now.
      </p>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        To request help with VA education, disability compensation, or pension
        benefit debt, please fill out the PDF version of our
        <a
          className="vads-u-margin-left--0p5"
          href="https://www.va.gov/debtman/Financial_Status_Report.asp"
        >
          Financial Status Report (VA Form 5655)
        </a>
        .
      </p>
    </va-alert>
  );
};

export default MaintenanceAlert;
