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
      <a
        href="/disability-benefits/apply/dependents"
        className="usa-button-primary va-button-primary"
      >
        Add or remove a dependent
      </a>
    </div>
  </div>
);

export default ViewDependentsHeader;
