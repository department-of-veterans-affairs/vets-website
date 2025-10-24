/**
 * @module containers/IntroductionPage
 * @description Introduction page component for VA Form 21-4192
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

import {
  SUBTITLE,
  TITLE,
} from '@bio-aquia/21-4192-employment-information/constants';

/**
 * Introduction page component for VA Form 21-4192
 * @param {Object} props - Component properties
 * @param {Object} props.route - Route configuration from react-router
 * @param {Object} props.route.formConfig - Form configuration object
 * @param {Object} props.router - Router object for navigation
 * @returns {React.ReactElement} Introduction page component
 */
export const IntroductionPage = ({ route, router }) => {
  const { formConfig } = route;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  const startForm = () => {
    const firstPage =
      formConfig.chapters.veteranInformationChapter.pages.veteranInformation
        .path;
    router.push(`${formConfig.urlPrefix}${firstPage}`);
  };

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Follow these steps to apply for disability compensation benefits
      </h2>

      <va-process-list>
        <va-process-list-item header="Check your eligibility">
          <p>
            This form is used by the Department of Veterans Affairs (VA) to
            request employment information from an employer to help verify a
            Veteran’s employment status in connection with a disability benefits
            claim. Generally, the Veteran must have filed a claim for disability
            compensation, and this form aids in obtaining necessary evidence
            related to employment and earnings.
          </p>
          <p>
            <strong>Helpful link:</strong>{' '}
            <a href="https://www.va.gov/disability/how-to-file-claim/">
              Eligibility requirements for VA disability compensation
            </a>
          </p>
        </va-process-list-item>

        <va-process-list-item header="Gather your information">
          <p>You’ll need this information about the Veteran:</p>
          <ul>
            <li>
              Full name, Social Security number, and VA file number (if
              applicable)
            </li>
            <li>Employer’s name and address</li>
            <li>
              Employment start and end dates, type of work, and hours worked
            </li>
          </ul>
          <p>You may also need to provide copies of these documents:</p>
          <ul>
            <li>Records of earnings or wages for the past 12 months</li>
            <li>
              Documentation of any employment-related disability or concessions
            </li>
          </ul>
          <p>
            <strong>Optional:</strong> If you need assistance obtaining
            employment records, contact your employer directly or reach out to
            your local VA regional office for guidance.{' '}
            <a href="https://www.va.gov/resources/how-to-get-your-military-service-records/">
              VA assistance with records and claims
            </a>
          </p>
          <h4>What if I need help with my application?</h4>
          <p>
            You can get help with completing this form from a Veteran Service
            Officer (VSO), accredited representatives, or by contacting your
            local VA regional office.
          </p>
          <p>
            <strong>Helpful link:</strong>{' '}
            <a href="https://www.benefits.va.gov/vso/">
              Find assistance with VA benefits
            </a>
          </p>
        </va-process-list-item>

        <va-process-list-item header="Apply">
          <p>
            Complete VA Form 21-4192 with the required employment information.
            The employer or authorized personnel should fill out and return the
            form directly to the VA as instructed. The form typically takes
            about 15 minutes to complete once the relevant information is
            gathered.
          </p>
          <p>
            Submit the completed form as directed by the VA claims process,
            usually to the VA regional office handling the claim.
          </p>
        </va-process-list-item>

        <va-process-list-item header="After you apply">
          <p>
            After the form is received, the VA will review the information to
            assess the Veteran’s employment history and any impact on their
            disability claim. You may be contacted for clarification or
            additional information during the review, which can take several
            weeks depending on case complexity.
          </p>
        </va-process-list-item>
      </va-process-list>
      <a
        href="#start"
        className="vads-c-action-link--green vads-u-margin-top--2"
        onClick={startForm}
      >
        Start the employment information form
      </a>
      <p />
      <va-omb-info
        res-burden="15"
        omb-number="2900-0065"
        exp-date="08/31/2027"
      />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      chapters: PropTypes.object.isRequired,
      urlPrefix: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default IntroductionPage;
