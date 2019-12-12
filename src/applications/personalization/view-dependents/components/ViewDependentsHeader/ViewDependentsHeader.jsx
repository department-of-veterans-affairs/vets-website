import React from 'react';

const ViewDependentsHeader = props => (
  <div className="vads-l-row vads-u-padding-bottom--3">
    <div className="vads-l-col--12">
      <h1>Your Dependents</h1>
      <p>
        If you're getting disability compensation and have a 30% or higher
        disability rating, you can add a dependent to your disability claim.
        Adding a dependent to your claim could make you eligible for a higher
        disability payment.
      </p>
      {props.add ? (
        <button type="button" className="usa-button">
          Apply to add a dependent
        </button>
      ) : null}
    </div>
  </div>
);

export default ViewDependentsHeader;
