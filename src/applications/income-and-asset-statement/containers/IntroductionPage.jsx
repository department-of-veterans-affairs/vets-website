import React from 'react';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import SaveInProgressIntro from '@department-of-veterans-affairs/platform-forms/save-in-progress/SaveInProgressIntro';

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
          title="Income and Asset Statement Form"
          subTitle="VA Form 21P-0969"
        />
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={route.formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Income and Asset Statement application"
        />
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow these steps below to apply for benefits
        </h2>
        <va-process-list>
          <va-process-list-item header="Prepare">
            <h4 className="vads-u-margin-y--1">
              To fill out this application, you’ll need this information:
            </h4>
            <ul>
              <li>
                Your Social Security number or VA file number{' '}
                <span className="vads-u-color--secondary-dark">
                  (*Required)
                </span>
              </li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability-benefits/apply/help/index.html">
                Get help filing your claim
              </a>
            </p>
          </va-process-list-item>
          <va-process-list-item header="Apply">
            <p>Complete and submit the pension benefits application form.</p>
            <p>Complete this benefits form.</p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </va-process-list-item>
          <va-process-list-item header="Review">
            <p>
              We process claims within a week. If more than a week has passed
              since you submitted your application and you haven’t heard back,
              please don’t apply again. Call us at.
            </p>
          </va-process-list-item>
          <va-process-list-item header="Decision">
            <p>
              Once we’ve processed your claim, you’ll get a notice in the mail
              with our decision.
            </p>
          </va-process-list-item>
        </va-process-list>
        <div className="vads-u-margin-top--2">
          <va-omb-info
            res-burden={30}
            omb-number="2900-0829"
            exp-date="11/30/2026"
          />
        </div>
      </article>
    );
  }
}

export default IntroductionPage;
