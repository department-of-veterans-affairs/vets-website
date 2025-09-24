import React from 'react';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

const Error = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();

  const useRedesignContent = useToggleValue(
    TOGGLE_NAMES.myVaAuthExpRedesignEnabled,
  );

  const content = useRedesignContent ? (
    <h3
      slot="headline"
      className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans vads-u-line-height--6 vads-u-margin-bottom--0"
      data-testId="benefit-application-error-redesign"
    >
      We can’t show your forms and applications right now. Refresh this page or
      try again later.
    </h3>
  ) : (
    <>
      <h3
        slot="headline"
        className="vads-u-margin-top--0"
        data-testId="benefit-application-error-original"
      >
        We can’t access your benefit applications and forms right now
      </h3>
      <p className="vads-u-margin-bottom--0">
        We’re sorry. We’re working to fix this problem. Check back later.
      </p>
    </>
  );

  return (
    <div
      className="vads-u-width--full vads-u-margin-bottom--3"
      data-testid="benefit-application-error"
    >
      <va-alert status="warning">{content}</va-alert>
    </div>
  );
};

export default Error;
