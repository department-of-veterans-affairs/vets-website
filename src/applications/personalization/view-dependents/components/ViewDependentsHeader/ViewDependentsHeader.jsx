import recordEvent from 'platform/monitoring/record-event';
import React, { Component } from 'react';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

class ViewDependentsHeader extends Component {
  handleClick = () => {
    recordEvent({
      event: 'cta-default-button-click',
    });
  };

  render() {
    return (
      <div className="vads-l-row">
        <div className="vads-l-col--12">
          <h1>Your VA Dependents</h1>
          <p className="vads-u-font-size--md vads-u-font-family--serif">
            Below is a list of dependents we have on file for you. You can file
            a claim for additional disability compensation whenever you add a
            new dependent.
          </p>
          <EbenefitsLink
            path="ebenefits/about/feature?feature=dependent-compensation"
            className="usa-button-primary va-button-primary"
            onClick={this.handleClick}
          >
            Add or remove a dependent
          </EbenefitsLink>
        </div>
      </div>
    );
  }
}

export default ViewDependentsHeader;
