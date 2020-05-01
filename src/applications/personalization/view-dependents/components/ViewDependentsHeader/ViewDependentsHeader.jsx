import React from 'react';
import { connect } from 'react-redux';

import { eBenefitsUrlGenerator } from 'platform/utilities/eBenefitsUrl';

const ViewDependentsHeader = ({ eBenefitsUrl }) => (
  <div className="vads-l-row">
    <div className="vads-l-col--12">
      <h1>Your VA Dependents</h1>
      <p className="vads-u-font-size--md vads-u-font-family--serif">
        Below is a list of dependents we have on file for you. You can file a
        claim for additional disability compensation whenever you add a new
        dependent.
      </p>
      <a
        href={eBenefitsUrl(
          'ebenefits/about/feature?feature=dependent-compensation',
        )}
        className="usa-button-primary va-button-primary"
      >
        Add or remove a dependent
      </a>
    </div>
  </div>
);

const mapStateToProps = state => ({
  eBenefitsUrl: eBenefitsUrlGenerator(state),
});

export default connect(mapStateToProps)(ViewDependentsHeader);

export { ViewDependentsHeader };
