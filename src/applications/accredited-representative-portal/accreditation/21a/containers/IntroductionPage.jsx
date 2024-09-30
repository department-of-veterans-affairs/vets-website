import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { focusElement } from 'platform/utilities/ui';
import { selectIsUserLoggedIn } from '../../../selectors/user';
import { SIGN_IN_URL } from '../../../constants';

const SIGN_IN_LINK_PROPS = {
  onClick: undefined,
  href: SIGN_IN_URL,
};

function StartLink({ children, ...props }) {
  const isLoggedIn = useSelector(selectIsUserLoggedIn);

  return (
    <a
      className="usa-button usa-button-primary"
      {...props}
      {...isLoggedIn || SIGN_IN_LINK_PROPS}
    >
      {children}
    </a>
  );
}

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
        <va-link
          href="https://www.law.cornell.edu/cfr/text/38/14.629"
          text="38 C.F.R. § 14.629"
        />{' '}
        or in disciplinary proceedings under{' '}
        <va-link
          href="https://www.law.cornell.edu/cfr/text/38/14.633"
          text="38 C.F.R. § 14.633"
        />{' '}
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
        <va-process-list-item header="Personal information">
          <p>
            You will need to fill out your personal information, up to date
            contact information, and any military service information.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Military service history">
          <p>
            If you served in a military branch of service, you will need to
            provide information about your tours.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Employment information">
          <p>
            You will need to enter your employment information for the past five
            years. If you are not employed you can select another status
            (unemployed, self-employed, student).
          </p>
        </va-process-list-item>
        <va-process-list-item header="Education history">
          <p>
            You will need to provide your education institution’s name and
            address starting from high school graduation, undergraduate, to
            post-graduate. You will also need to provide the dates you attended
            and the degree received (or major).
          </p>
        </va-process-list-item>
        <va-process-list-item header="Professional affiliations">
          <p>
            You will need to provide each jurisdiction you are currently a
            member of good standing. Along with the name, you will also need to
            provide the date of admission and your membership or registration
            number.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Background information">
          <p>
            Truthfulness and candor are essential elements of good moral
            character and reputation relevant to practice before VA. In order to
            evaluate your character and reputation, you will need to provide
            details on any convictions, imprisonments, sentences, terminations
            due to unethical or unlawful behavior, and related topics.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Character references">
          <p>
            You will need to provide 3-4 character references who have personal
            knowledge of your character and qualification to serve as a claims
            agent or attorney. These references cannot be immediate family
            members.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Optional supplementary statements">
          <p>
            Provide any additional explanations for your answers in previous
            sections and additional information about why you are applying.
            These questions are optional.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Review application">
          <p>Review your answers before submitting.</p>
        </va-process-list-item>
      </va-process-list>
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start your Application"
        customLink={StartLink}
        hideUnauthedStartLink
        displayNonVeteranMessaging
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
  startLink: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.elementType,
    PropTypes.func,
  ]),
};

StartLink.propTypes = {
  children: PropTypes.node,
};

export default IntroductionPage;
