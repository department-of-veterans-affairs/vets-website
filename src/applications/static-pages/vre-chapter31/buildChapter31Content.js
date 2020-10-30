import React from 'react';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

export const buildChapter31Content = (page, track) => {
  let content = '';
  let optionalHeader = '';
  let optionalSubwayMapItem = null;
  // If this is on the /eligibility page, render just the button
  // If this is NOT on the /eligibility page, render the subway map and the button and possibly the optional header and subway map item
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
    // If we are NOT the how-to-apply page, there is a header to be added in
    if (page !== 'how-to-apply') {
      optionalHeader = (
        <h3>
          If you have your VA disability rating, follow these steps to apply:
        </h3>
      );
    }
    // If we are on the independent-living track, we need to add a 6th subway map item
    if (track === 'independent-living') {
      optionalSubwayMapItem = (
        <li className="process-step list-six">
          If you’re eligible, a VRC will work with you to determine the severity
          of your service-connected disability, if you’re ready to work, and if
          you’ll benefit from independent living services. Your VRC will help
          you create a personalized, written independent living plan that meets
          your needs.
        </li>
      );
    }
    content = (
      <>
        {optionalHeader}
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
            {optionalSubwayMapItem}
          </ol>
        </div>
        <p className="vads-u-font-size--xl vads-u-font-family--serif vads-u-margin-bottom--0 vads-u-font-weight--bold">
          Ready to apply?
        </p>
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
