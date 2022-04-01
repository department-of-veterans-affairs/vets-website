import React from 'react';

import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { focusElement } from 'platform/utilities/ui';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <article className="schemaform-intro">
        <FormTitle
          title="Mock Form"
          subTitle="Equal to VA Form 00-1234 (Mock Form)"
        />
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          verifyRequiredPrefill={false}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
        >
          Please complete the 00-1234 form to apply for Mock form.
        </SaveInProgressIntro>
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Follow the steps below to apply for Mock form.
        </h2>
        <va-process-list>
          <li>
            <h3>Prepare</h3>
            <h4>To fill out this application, you’ll need your:</h4>
            <ul>
              <li>Social Security number (required)</li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability-benefits/apply/help/index.html">
                Get help filing your claim
              </a>
            </p>
          </li>
          <li>
            <h3>Apply</h3>
            <p>Complete this Mock form form.</p>
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
          verifyRequiredPrefill={false}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
        />
        <p />
        <OMBInfo resBurden={10} ombNumber="0000-0000" expDate="12/31/2022" />
      </article>
    );
  }
}

export default IntroductionPage;
