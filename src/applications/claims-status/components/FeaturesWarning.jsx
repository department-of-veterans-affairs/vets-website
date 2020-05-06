import React from 'react';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

export default function FeaturesWarning() {
  return (
    <div>
      <h2 className="help-heading">Additional services</h2>
      <p>
        To update your personal information, get help filing claims or appeals,
        or view your uploaded documents, go to{' '}
        <EbenefitsLink path="ebenefits-portal/ebenefits.portal">
          eBenefits
        </EbenefitsLink>
        .
      </p>
    </div>
  );
}
