import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for Veterans Pension benefits" />
        <p>VA Form 21P-527EZ</p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          pageList={this.props.route.pageList}
          downtime={this.props.route.formConfig.downtime}
          startText="Start the pension application"
          retentionPeriod="one year"
          retentionPeriodStart="when you start"
        />
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow these steps to apply for a Veterans Pension
        </h2>
        <va-process-list uswds>
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
              <li>
                Your military history{' '}
                <span className="vads-u-color--secondary-dark">
                  (*Required)
                </span>
              </li>
              <li>
                Financial information about you and your dependents{' '}
                <span className="vads-u-color--secondary-dark">
                  (*Required)
                </span>
              </li>
              <li>Your marital status and prior marital history</li>
              <li>Information about your spouse’s prior marriage</li>
              <li>Information about your dependent children</li>
              <li>Your employment history</li>
            </ul>
            <h4>
              If you have special circumstances for your medical care, you may
              also need these additional forms:
            </h4>
            <ul>
              <li>
                <strong>Statement of Medical Care:</strong> Care Worksheets at
                the end of this pension benefits form that must be completed by
                an administrator or licensed medical professional
              </li>
              <li>
                Claim for Special Monthly Pension (
                <a
                  href="https://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  VA Form 21-2680
                </a>
                )
              </li>
              <li>
                Claim for Medicare Nursing Home and/por $90.00 Rate Reduction
                Request (
                <a
                  href="https://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  VA Form 21-0779
                </a>
                )
              </li>
              <li>
                Claim for Fiduciary Assistance (
                <a
                  href="https://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  VA Form 21-2680
                </a>
                )
              </li>
            </ul>
          </va-process-list-item>
          <va-process-list-item header="Apply">
            <p>Complete and submit the pension benefits application form.</p>
          </va-process-list-item>
        </va-process-list>
        <SaveInProgressIntro
          buttonOnly
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          pageList={this.props.route.pageList}
          startText="Start the pension application"
          downtime={this.props.route.formConfig.downtime}
        >
          Please complete the 21-527EZ form to apply for pension benefits.
        </SaveInProgressIntro>
        <h3>What if I need help filling out my application?</h3>
        <p>
          An accredited representative, like a Veterans Service Officer (VSO),
          can help you fill out your claim.{' '}
          <a href="/disability-benefits/apply/help/index.html">
            Get help filing your claim
          </a>
        </p>
        <va-omb-info
          res-burden={30}
          omb-number="2900-0002"
          exp-date="08/31/2025"
        />
      </div>
    );
  }
}

export default IntroductionPage;

export { IntroductionPage };
