/**
 *  NOTE: This is a placeholder. It will be replaced/updated.
 */

import React from 'react';

import { focusElement } from 'platform/utilities/ui';
// import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
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
        <FormTitle title={formConfig.title} />
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
        >
          Please complete the form to apply for benefits.
        </SaveInProgressIntro>
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow the steps below to apply for benefits.
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
            <p>Complete this benefits form.</p>
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
        <va-omb-info exp-date="12/31/2025" omb-number="" res-burden={30}>
          <p>
            <strong>The Paperwork Reduction Act</strong> of 1995 requires us to
            notify you that this information...
          </p>
          <p>
            <strong>Privacy Act information:</strong> VA is asking you to
            provide the information...
          </p>
        </va-omb-info>
      </article>
    );
  }
}

export default IntroductionPage;
