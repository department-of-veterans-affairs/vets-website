import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-forms-system/ui';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro'; // '@' import not working
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

const IntroductionPage = props => {
  const { route, isLoggedIn } = props;
  const { formConfig, pageList } = route;

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
    },
    [props],
  );

  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Apply for CHAMPVA benefits"
        subTitle={formConfig.subTitle}
      />

      <p>
        If you’re the spouse or child of a Veteran with disabilities or a
        Veteran who has died, you may be able to get health insurance through
        the Civilian Health and Medical Program of the Department of Veterans
        Affairs (CHAMPVA). Apply online now.
      </p>

      {!isLoggedIn && (
        <VaAlert status="info" visible uswds>
          <h2>Have you applied for VA health care before?</h2>
          <SaveInProgressIntro
            buttonOnly
            headingLevel={2}
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            pageList={pageList}
            unauthStartText="Sign in to check your application status"
            hideUnauthedStartLink
          />
        </VaAlert>
      )}

      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps to apply for CHAMPVA benefits.
      </h2>
      <va-process-list uswds>
        <va-process-list-item header="Check your eligibility">
          <p>
            Make sure you meet our eligibility requirements before you apply
          </p>
          <a href="https://www.va.gov/health-care/family-caregiver-benefits/champva/">
            Find out if you’re eligible for CHAMPVA benefits
          </a>
        </va-process-list-item>
        <va-process-list-item header="Gather your information">
          <p>
            <b>Here’s what you’ll need to apply:</b>
          </p>
          <ul>
            <li>
              <b>Personal information about you</b> and anyone else you’re
              applying for
            </li>
            <li>
              <b>Personal information about your sponsor</b> (the Veteran or
              service member you’re connected to)
            </li>
          </ul>
          This includes dates of birth, Social Security numbers, and contact
          information.
          <br />
          <br />
          You may also need to submit supporting documents, like copies of your
          other health insurance cards or proof of school enrollment.
          {/* Link coming soon: */}
          {/* 
          <br />
          <br />
          <VaLink text="Find out which documents you’ll need to apply for CHAMPVA" />
          */}
        </va-process-list-item>
        <va-process-list-item header="Start your application">
          <p>
            We’ll take you through each step of the process. It should take 10
            minutes.
          </p>
        </va-process-list-item>
        <va-process-list-item header="After you apply">
          <p>
            We’ll contact you if we have questions or need more information.
          </p>
        </va-process-list-item>
      </va-process-list>

      <SaveInProgressIntro
        formId={formConfig.formId}
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the Application"
      />
      <br />

      <va-omb-info
        res-burden={10}
        omb-number="2900-0219"
        exp-date="10/31/2024"
      />
    </article>
  );
};

IntroductionPage.propTypes = {
  isLoggedIn: PropTypes.bool,
  route: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

export default connect(mapStateToProps)(IntroductionPage);
