import React from 'react';

const BenefitCard = () => (
  <va-card>
    <div className="vads-u-margin-bottom--2">
      <span className="usa-label">Education</span>
    </div>
    <h3 slot="headline">GI Bill</h3>
    <p className="vads-u-margin-y--0">
      GI Bill benefits help you pay for college, graduate school, and training
      programs. Learn more about GI Bill benefits and how to apply for them.
    </p>
    <div>
      <div className="vads-u-display--inline-block vads-u-margin-right--2">
        <va-link-action href="#" text="Learn more" type="secondary" />
      </div>
      <div className="vads-u-display--inline-block">
        <va-link-action href="#" text="Apply now" type="secondary" />
      </div>
    </div>
  </va-card>
);

export default BenefitCard;
