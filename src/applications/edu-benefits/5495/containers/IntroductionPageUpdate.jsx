import { FormTitle } from '@department-of-veterans-affairs/va-forms-system-core';
import React from 'react';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function IntroductionPageUpdate() {
  const reviewPage = window.location.pathname.includes('review-and-submit');
  return (
    <div
      className={`schemaform-intro ${
        !reviewPage ? 'vads-u-margin-bottom--9' : 'vads-u-margin-bottom--0'
      }`}
    >
      {!reviewPage && <FormTitle title="Manage your education benefits" />}
      <p>
        <span className="vads-u-font-weight--bold">Note: </span>
        This form has been combined with VA Form 22-1995 (Request for Change of
        Benefit, Program or Place of Training). This form is now available by
        <VaLink
          className="vads-u-margin-left--0p5"
          text="clicking this link"
          href="/education/apply-for-education-benefits/application/1995/introduction"
        />
        .
      </p>
    </div>
  );
}
