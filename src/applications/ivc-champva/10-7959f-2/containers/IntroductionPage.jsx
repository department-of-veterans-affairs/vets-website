import React from 'react';

// import { focusElement } from 'platform/utilities/ui';
import { connect } from 'react-redux';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = props => {
  const { route } = props;
  const { formConfig, pageList } = route;

  return (
    <article className="schemaform-intro">
      <FormTitle
        title="File a Foreign Medical Program (FMP) Claim"
        subTitle="FMP Claim Cover Sheet (VA Form 10-7959f-2)"
      />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply for health care benefits.
      </h2>
      <va-process-list>
        <li>
          <h3>Prepare</h3>
          <h4>To fill out this application, you’ll need your:</h4>
          <ul>
            <li>Social Security number (required)</li>
          </ul>
          <p>
            <strong>What if I need help filling out my application?</strong> An
            accredited representative, like a Veterans Service Officer (VSO),
            can help you fill out your claim.{' '}
            <a href="/disability-benefits/apply/help/index.html">
              Get help filing your claim
            </a>
          </p>
        </li>
        <li>
          <h3>Apply</h3>
          <p>Complete this health care benefits form.</p>
          <p>
            After submitting the form, you’ll get a confirmation message. You
            can print this for your records.
          </p>
        </li>
        <li>
          <h3>VA Review</h3>
          <p>
            We process claims within a week. If more than a week has passed
            since you submitted your application and you haven’t heard back,
            please don’t apply again. Call us at.
          </p>
        </li>
        <li>
          <h3>Decision</h3>
          <p>
            Once we’ve processed your claim, you’ll get a notice in the mail
            with our decision.
          </p>
        </li>
      </va-process-list>
      <SaveInProgressIntro
        buttonOnly
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the Application"
      />
      <p />
      <va-omb-info
        res-burden={11}
        omb-number="2900-0648"
        exp-date="03/31/2027"
      />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        What if I need help filling out my application?
      </h2>
      <p>
        An accredited representative, like a Veterans Service Officer (VSO), can
        help you fill out your application.
        <a href="https://www.va.gov/COMMUNITYCARE/programs/dependents/champva/CITI.asp">
          Find out if you can get care at a local VA medical center when you’re
          covered under CHAMPVA
        </a>
      </p>
    </article>
  );
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

export default connect(mapStateToProps)(IntroductionPage);
