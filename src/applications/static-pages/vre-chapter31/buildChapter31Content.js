import React from 'react';
import PropTypes from 'prop-types';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

const Chapter31Content = props => {
  let content = '';
  let optionalHeader = '';
  let optionalSubwayMapItem = null;
  // If this is on the /eligibility page, render just the button
  // If this is NOT on the /eligibility page, render the subway map and the button and possibly the optional header and subway map item
  if (props.page === 'eligibility') {
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
    if (props.page !== 'how-to-apply') {
      optionalHeader = (
        <h3>
          If you have your VA disability rating, follow these steps to apply:
        </h3>
      );
    }
    // If we are on the independent-living track, we need to add a 6th subway map item
    if (props.track === 'independent-living') {
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
              Click <strong>Apply</strong>.
            </li>
            <li className="process-step list-three">
              In the Education and Training section, click{' '}
              <strong>Veteran Readiness and Employment Benefits</strong>.
            </li>
            <li className="process-step list-four">
              In the Veteran Readiness and Employment Program section, click{' '}
              <strong>Apply for Chapter 31</strong>.
            </li>
            {optionalSubwayMapItem}
          </ol>
          <p>
            If you're eligible, we'll invite you to an orientation session at
            your nearest VA regional office.
          </p>
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

Chapter31Content.propTypes = {
  page: PropTypes.string,
  track: PropTypes.string,
};

export default Chapter31Content;
