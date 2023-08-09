import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle
          title="Authorize VA to release your information to a third-party source"
          subtitle="Authorization To Disclose Personal Information To a Third Party (VA Form 21-0845)"
        />
        <h2>Here’s how to apply online</h2>
        <p>
          Complete this form. After you submit the form, you’ll get a
          confirmation message. You can print this page for your records.
        </p>
        <p>
          A Veteran may submit an Authorization to Disclose Personal Information
          to a third party on their own. Alternatively, a claimant or witness
          may submit on behalf of a Veteran.
        </p>
        <h2>Who is eligible to use this form?</h2>
        <ul>
          <li>A Veteran or claimant submitting on their own behalf</li>
          <li>
            A non-Veteran beneficiary or claimant submitting on behalf of a
            Veteran
          </li>
        </ul>
        <h2>How do I prepare before starting this form?</h2>
        <p>
          Gather the required information listed below that you’ll need to
          submit this form:
        </p>
        <ul>
          <li>Veteran’s Full Name</li>
          <li>Veteran’s Social Security number</li>
          <li>Veteran's Date of Birth</li>
        </ul>
        <h2>What if I change my mind?</h2>
        <p>
          If you change your mind and do not want VA to give out your personal
          benefit or claim information, you may notify us in writing, or by
          telephone at <va-telephone contact="8008271000" /> or online through{' '}
          <a href="https://ask.va.gov/">Ask VA</a>. Upon notification from you
          VA will no longer give out benefit or claim information (except for
          the information VA has already given out based on your permission).
        </p>
        <SaveInProgressIntro
          headingLevel={2}
          alertTitle="Save time and save your work in progress by signing in"
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
          verifiedPrefillAlert={
            <div>
              <div className="usa-alert usa-alert-info schemaform-sip-alert">
                <div className="usa-alert-body">
                  <strong>Note:</strong> Since you’re signed in to your account,
                  you can save your release authorization in progress and come
                  back later to finish filling it out.
                </div>
              </div>
              <br />
            </div>
          }
          displayNonVeteranMessaging
        >
          Please complete the 21-0845 form to apply for disclosure
          authorization.
        </SaveInProgressIntro>
        <va-omb-info
          res-burden={5}
          omb-number="2900-0736"
          exp-date="02/28/2026"
        />
      </article>
    );
  }
}

export default IntroductionPage;
