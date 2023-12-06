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
          title="Submit an intent to file"
          subTitle="Intent to File a Claim for Compensation and/or Pension, or Survivors Pension and/or DIC (VA Form 21-0966)"
        />
        <p>
          Use this form if you plan to file a disability or pension claim. If
          you notify us of your intent to file, you may be able to get
          retroactive payments (payments for the time between when you submit
          your intent to file and when we approve your claim). An intent to file
          sets a potential start date (or effective date) for your benefits.
        </p>
        <h2>What to know before you fill out this form</h2>
        <p>
          After you submit your intent to file, you have <b>1 year</b> to
          complete and file your claim. After 1 year, the potential effective
          date for your benefits will expire.
        </p>
        <p>
          <va-alert
            background-only
            class="vads-u-margin-bottom--1"
            close-btn-aria-label="Close notification"
            disable-analytics="false"
            full-width="false"
            status="info"
            visible="true"
          >
            <p className="vads-u-margin-y--0">
              This form only tells us that you plan to file a claim. To get
              benefits, you’ll need to complete and file the claim application.
              And then we’ll need to approve it.
            </p>
          </va-alert>
        </p>
        <h2>Claims you can file after filling out this form</h2>
        <p>
          After you complete this form, we’ll direct you to the benefit
          application you need to complete.
        </p>
        <ul>
          <li>
            <a href="https://www.va.gov/disability/file-disability-claim-form-21-526ez/introduction">
              Disability compensation claim (VA Form 21-526EZ)
            </a>
            . If you start your disability claim online now, you don’t need to
            fill out this intent to file form. When you start your disability
            application (or Supplemental Claim) online, it notifies us
            automatically of your intent to file.
          </li>
          <li>
            <a href="https://www.va.gov/find-forms/about-form-21p-527ez/">
              Pension claim (VA Form 21P-527EZ)
            </a>
          </li>
          <li>
            <a href="https://www.va.gov/find-forms/about-form-21p-534ez/">
              Pension claim for survivors (21P-534EZ)
            </a>
          </li>
        </ul>
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the intent to file"
        >
          Please complete the 21-0966 form to apply for benefits claims.
        </SaveInProgressIntro>

        <p />
        <va-omb-info
          res-burden="5"
          omb-number="2900-0858"
          exp-date="07/31/2024"
        />
      </article>
    );
  }
}

export default IntroductionPage;
