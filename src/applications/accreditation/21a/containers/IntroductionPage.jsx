import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = ({ route }) => {
  const { formConfig, pageList } = route;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />
      <p>
        As an attorney or claims agent, you can start the application process to
        become a VA-accredited representative through our online tool.
      </p>
      <p>
        <strong>Note:</strong> If you are a Veteran Service Organization
        representative wanting to apply for accreditation, contact your
        organization’s certifying official.
      </p>
      <h2>What to know before you fill out this form</h2>
      <p>
        Please provide the applicable personal and employment data, then read
        each question and provide complete answers to all questions that apply
        to you.
      </p>
      <p>
        Truthfulness and candor are essential elements of good moral character
        and reputation relevant to practice before the Department of Veterans
        Affairs. Failure to disclose the requested information may result in
        denial of accreditation under{' '}
        <a href="https://www.law.cornell.edu/cfr/text/38/14.629">
          38 C.F.R. § 14.629
        </a>{' '}
        or in disciplinary proceedings under{' '}
        <a href="https://www.law.cornell.edu/cfr/text/38/14.633">
          38 C.F.R. § 14.633
        </a>{' '}
        if you are already accredited.
      </p>
      <va-alert status="warning" visible>
        This form asks about personal history that might be sensitive in
        nature&mdash;professional terminations, academic suspensions,
        imprisonment, legal cases, and more. Please consider your readiness to
        discuss these incidents before proceeding.
      </va-alert>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Fill out the following information:
      </h2>
      <va-process-list>
        <li>
          <h3>Personal information</h3>
          <p>
            You will need to fill out your personal information, up to date
            contact information, and any military service information.
          </p>
        </li>
        <li>
          <h3>Military service history</h3>
          <p>
            If you served in a military branch of service, you will need to
            provide information about your tours.
          </p>
        </li>
        <li>
          <h3>Employment history</h3>
          <p>
            You will need to enter your employment information for the past five
            years. If you are not employed you can select another status
            (unemployed, self-employed, student).
          </p>
        </li>
        <li>
          <h3>Education history</h3>
          <p>
            You will need to provide your education institution’s name and
            address starting from high school graduation, undergraduate, to
            post-graduate. You will also need to provide the dates you attended
            and the degree received (or major).
          </p>
        </li>
        <li>
          <h3>Practicing information</h3>
          <p>
            You will need to provide each jurisdiction your are currently a
            member of good standing. Along with the name, you will also need to
            provide the date of admission and your membership or registration
            number.
          </p>
        </li>
        <li>
          <h3>Background information</h3>
          <p>
            Truthfulness and candor are essential elements of good moral
            character and reputation relevant to practice before VA. In order to
            evaluate your character and reputation, you will need to provide
            details on any convictions, imprisonments, sentences, terminations
            due to unethical or unlawful behavior, and related topics.
          </p>
        </li>
        <li>
          <h3>Character references</h3>
          <p>
            You will need to provide 3-4 character references who have personal
            knowledge of your character and qualification to serve as a claims
            agent or attorney. These references cannot be immediate family
            members.
          </p>
        </li>
        <li>
          <h3>Optional supplementary statements</h3>
          <p>
            Provide any additional explanations for your answers in previous
            sections and additional information about why you are applying.
            These questions are optional.
          </p>
        </li>
        <li>
          <h3>Review application</h3>
          <p>Review your answers before submitting.</p>
        </li>
      </va-process-list>
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start your Application"
        hideUnauthedStartLink={
          environment.isStaging() || environment.isProduction()
        }
      />
      <va-omb-info
        res-burden={45}
        omb-number="2900-0605"
        exp-date="3/31/2022"
      />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
      title: PropTypes.string,
      subTitle: PropTypes.string,
    }),
    pageList: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default IntroductionPage;
