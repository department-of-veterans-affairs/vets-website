import React from 'react';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

export const buildChapter31Content = page => {
  let content = '';
  // If this is on the /eligability page, render just the button
  // If this is NOT on the /eligability page, render the subway map and the button
  if (page === 'eligibility') {
    content = (
      <>
        <EbenefitsLink
          path="ebenefits/about/feature?feature=vocational-rehabilitation-and-employment"
          className="usa-button-primary va-button-primary"
        >
          Go to eBenefits to apply
        </EbenefitsLink>
      </>
    );
  } else {
    content = (
      <>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              Sign in to your eBenefits account.
            </li>
            <li className="process-step list-two">
              Select <strong>Apply</strong>.
            </li>
            <li className="process-step list-three">
              Click <strong>Veteran Readiness and Employment Program</strong>.
            </li>
            <li className="process-step list-four">
              Apply <strong>for Education and Career Counseling</strong>.
            </li>
            <li className="process-step list-five">
              If you're eligible, we'll invite you to an orientation session at
              your nearest VA regional office.
            </li>
          </ol>
        </div>
        <EbenefitsLink
          path="ebenefits/about/feature?feature=vocational-rehabilitation-and-employment"
          className="usa-button-primary va-button-primary"
        >
          Go to eBenefits to apply
        </EbenefitsLink>
      </>
    );
  }
  return content;
};
