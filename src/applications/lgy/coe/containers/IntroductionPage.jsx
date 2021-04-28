import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for Certificate of Eligibility" />
        <p>Equal to VA Form 26-1880 (Apply for Certificate of Eligibility).</p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
          hideUnauthedStartLink
        >
          Please complete the 26-1880 form to apply for Certificate of
          Eligibility (VA Form 26-1880).
        </SaveInProgressIntro>
        <h4>
          Follow the steps below to apply for a Certificate of Eligibility (VA
          Form 26-1880).
        </h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h5>Prepare</h5>
              <h6>When you apply, be sure to have these on hand:</h6>
              <ul>
                <li>Your Social Security number</li>
                <li>Your date of birth</li>
                <li>
                  Details about your service history, and depending on how and
                  when you served, you may need to submit documentation{' '}
                </li>
                <li>
                  If you have or had a VA-backed loan, we may need the property
                  location and dates of the loan
                </li>
              </ul>
              <p>
                <strong>What if I need help filling out my application?</strong>{' '}
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you fill out your claim.{' '}
                <a href="/housing-assistance/home-loans/how-to-apply/">
                  Get help filing your claim
                </a>
              </p>
            </li>
            <li className="process-step list-two">
              <h5>Apply</h5>
              <p>
                Complete this Certificate of Eligibility (VA Form 26-1880)
                application.
              </p>
              <p>
                After submitting the form, you’ll get a confirmation message.
                You can print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <h5>VA Review</h5>
              <p>
                We process claims within a week. If more than a week has passed
                since you submitted your application and you haven’t heard back,
                please don’t apply again. Call us at.
              </p>
            </li>
            <li className="process-step list-four">
              <h5>Decision</h5>
              <p>
                If you qualify for a Certificate of Eligibility, we'll notify
                you by email and/or letter about how you can get your COE
                document.
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          hideUnauthedStartLink
          buttonOnly
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={30} ombNumber="2900-0086" expDate="11/30/2022" />
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
