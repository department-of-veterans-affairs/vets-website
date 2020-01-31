import React from 'react';

const ViewDependentsHeader = () => (
  <div className="vads-l-row">
    <div className="vads-l-col--12">
      <h1>Your Dependents</h1>
      <p className="vads-u-font-size--md vads-u-font-family--serif">
        Below is the information we have for your dependents. You can file a
        claim for more disability compensation whenever you add a dependent. If
        something changes with a dependent's status, you should notify VA.
      </p>
      <a href="#" className="usa-button-primary va-button-primary">
        Go to eBenefits to add a dependent or change a dependent's status
      </a>
    </div>
  </div>
);

export default ViewDependentsHeader;
