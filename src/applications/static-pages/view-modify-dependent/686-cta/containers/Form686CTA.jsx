import React from 'react';
import { connect } from 'react-redux';

import CallToActionWidget from 'applications/static-pages/cta-widget';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

const Form686CTA = props => {
  let content;
  if (props.showContent === undefined) {
    content = <va-loading-indicator message="Loading..." />;
  } else if (props.showContent === false) {
    content = (
      <EbenefitsLink
        path="ebenefits/about/feature?feature=dependent-compensation"
        className="usa-button"
      >
        Go to eBenefits to add or modify a dependent
      </EbenefitsLink>
    );
  } else {
    content = <CallToActionWidget appId="add-remove-dependents" />;
  }
  return <div>{content}</div>;
};

const mapStateToProps = store => ({
  user: store.user,
  showContent: true,
});

export default connect(mapStateToProps)(Form686CTA);
