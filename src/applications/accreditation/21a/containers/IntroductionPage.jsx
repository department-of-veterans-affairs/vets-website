import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

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
        become a VA accredited representative through our online tool.
      </p>
      <p>
        <strong>Note:</strong> If you are a VSO representative wanting to apply
        for accreditation, contact your organization’s certifying official.
      </p>
      <h2>What to know before you fill out this form</h2>
      <p>
        Please provide the applicable personal and employment data, then read
        each question and provide complete answers to all questions that apply
        to you.
      </p>
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
          <h3>Military history</h3>
          <p>
            If you served in a military branch of service, you will need to
            provide information about your tours.
          </p>
        </li>
        <li>
          <h3>Employment information</h3>
          <p>
            You will need to enter your employment information for the past five
            years. If you aren’t employed you can select another status
            (unemployed, self-employed, student).
          </p>
        </li>
        <li>
          <h3>Education information</h3>
          <p>
            You will need to provide your education institution’s name and
            address starting from high school graduation, undergraduate, to
            post-graduate. You will also need to provide the dates you attended
            and the degree received (or major).
          </p>
        </li>
        <li>
          <h3>Law practice information</h3>
          <p>
            You will need to provide each jurisdiction you are currently a
            member of good standing. Along with the name, you will also need to
            provide the date of admission and your membership or registration
            number.
          </p>
        </li>
        <li>
          <h3>Background questions</h3>
          <p>
            Truthfulness and candor are essential elements of good moral
            character and reputation relevant to practice before the VA. In
            order to evaluate your character and reputation, you will need to
            fill out 12 questions.
          </p>
        </li>
        <li>
          <h3>Character references</h3>
          <p>
            You will need to provide 3 character reference who have personal
            knowledge of your character and qualification to serve as an
            attorney or claims agent. These references cannot be immediate
            family members.
          </p>
        </li>
        <li>
          <h3>Submit required documents</h3>
          <p>
            Last, after you submit your application online, you will need to
            send OGC supporting documentation before they can start to review
            your application and make a decision.
          </p>
        </li>
      </va-process-list>
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start your Application"
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
