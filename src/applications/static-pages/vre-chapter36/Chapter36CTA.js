import React from 'react';

import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import recordEvent from 'platform/monitoring/record-event';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import { rootUrl as chapter36Url } from 'applications/vre/28-8832/manifest.json';

const EDUCATION_CAREER_COUNSELING_PATH = 'education-and-career-counseling';

const Chapter36CTA = props => {
  const isEducationAndCareerPage = window.location.href.includes(
    EDUCATION_CAREER_COUNSELING_PATH,
  );
  let content;
  const header = isEducationAndCareerPage ? (
    <h3 id="follow-these-steps-to-apply-on">
      Follow these steps to apply online for Chapter 36 services:
    </h3>
  ) : (
    <>
      <h2>How do I apply?</h2>
      <h3 id="follow-these-steps-to-apply-fo">
        Follow these steps to apply online now
      </h3>
    </>
  );
  if (props.includedInFlipper === undefined) {
    content = <LoadingIndicator message="Loading..." />;
  } else if (props.includedInFlipper === false) {
    recordEvent({
      event: 'phased-roll-out-disabled',
      'product-description': 'Chapter 36',
    });
    content = (
      <>
        {header}
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              Sign in to your eBenefits account.
            </li>
            <li className="process-step list-two">
              {isEducationAndCareerPage ? (
                <>
                  Select <strong>Apply</strong>
                </>
              ) : (
                <>
                  {' '}
                  Click <strong>Additional Benefits</strong> on your dashboard
                </>
              )}
              .
            </li>
            <li className="process-step list-three">
              Click <strong>Veteran Readiness and Employment Program</strong>.
            </li>
            <li className="process-step list-four">
              Apply <strong>for Education and Career Counseling</strong>.
            </li>
            {isEducationAndCareerPage ? (
              <li className="process-step list-five">
                If you're eligible, we'll invite you to an orientation session
                at your nearest VA regional office.
              </li>
            ) : null}
          </ol>
        </div>
        {!isEducationAndCareerPage ? (
          <p>
            If you’re eligible, we’ll invite you to meet with a Vocational
            Rehabilitation Counselor (VRC). Your VRC will work with you to map
            out a career path.
          </p>
        ) : null}
        <EbenefitsLink
          path="ebenefits/payments"
          className="usa-button-primary va-button-primary"
        >
          Go to eBenefits to apply
        </EbenefitsLink>
        {!isEducationAndCareerPage ? (
          <p>
            <strong>Note:</strong> If the service member or Veteran in your
            family isn’t yet using VR&amp;E benefits and services, they may also
            apply online through eBenefits.
          </p>
        ) : null}
      </>
    );
  } else {
    recordEvent({
      event: 'phased-roll-out-enabled',
      'product-description': 'Chapter 36',
    });
    content = (
      <>
        {!isEducationAndCareerPage ? <h2>How do I apply?</h2> : null}
        <a
          className="usa-button-primary va-button-primary"
          target="_self"
          href={chapter36Url}
        >
          Apply for career counseling
        </a>
      </>
    );
  }
  return <div>{content}</div>;
};

const mapStateToProps = store => ({
  includedInFlipper: toggleValues(store)[FEATURE_FLAG_NAMES.showChapter36],
});

export default connect(mapStateToProps)(Chapter36CTA);
