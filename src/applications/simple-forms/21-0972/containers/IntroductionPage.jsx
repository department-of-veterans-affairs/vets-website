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
          title="Sign for benefits on behalf of another person"
          subtitle="Equal to VA Form 21-0972 (Sign for benefits on behalf of another person)"
        />
        <h2>When to use this form</h2>
        <p>
          This form is to be completed by the individual signing a benefits
          application form on behalf of the veteran/claimant. For purposes of
          this form, the individual signing the form on behalf of the
          veteran/claimant is referred to as the "alternate signer." Your
          accurate and complete answers to the questions on this form are
          important to help VA complete the veteran/claimant's claim.
        </p>
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the alternate signer application"
        >
          Please complete the 21-0972 form to apply for alternate signer.
        </SaveInProgressIntro>
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow the steps below to complete the alternate signer application
        </h2>
        <va-process-list>
          <li>
            <h3>Prepare</h3>
            <h4>
              To fill out this application you'll need the Veteran's and/or
              Claimant's:
            </h4>
            <ul>
              <li>Social Security number</li>
              <li>Va file number (if they have one)</li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              If you have trouble using this online form, call us at
              800-698-2411 (TTY: 711). We’re here 24/7. If you need help
              gathering your information or filling out your form, contact a
              local Veterans Service Organization (VSO).
              <a href="/vso">Find a local Veterans Service Organization</a>
            </p>
          </li>
          <li>
            <h3>Start your application</h3>
            <p>Complete this form.</p>
            <p>
              After you submit the form, you'll get a confirmation message. You
              can print this page for your records.
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
          res-burden="15"
          omb-number="2900-0849"
          exp-date="02/28/2026"
        />
      </article>
    );
  }
}

export default IntroductionPage;
