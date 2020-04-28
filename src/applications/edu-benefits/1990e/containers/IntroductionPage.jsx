import React from 'react';
import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

export class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }
  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply to use transferred education benefits" />
        <p>
          Equal to VA Form 22-1990E (Application for Family Member to Use
          Transferred Benefits).
        </p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the education application"
        />
        <h4>Follow the steps below to apply for education benefits.</h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div>
                <h5>Prepare</h5>
              </div>
              <div>
                <h6>To fill out this application, you’ll need your:</h6>
              </div>
              <ul>
                <li>Social Security number (required)</li>
                <li>Sponsor’s Social Security number (required)</li>
                <li>
                  Basic information about the school or training facility you
                  want to attend
                </li>
                <li>Bank account direct deposit information</li>
                <li>Education history</li>
              </ul>
              <p>
                <strong>What if I need help filling out my application?</strong>{' '}
                An accredited representative with a Veterans Service
                Organization (VSO) can help you fill out your claim.{' '}
                <a href="/disability-benefits/apply/help/index.html">
                  Find an accredited representative
                </a>
                .
              </p>
              <h6>Learn about educational programs</h6>
              <p>
                See what benefits you’ll get at the school you want to attend.{' '}
                <a href="/gi-bill-comparison-tool/">
                  Use the GI Bill Comparison Tool
                </a>
                .
              </p>
            </li>
            <li className="process-step list-two">
              <div>
                <h5>Apply</h5>
              </div>
              <p>Complete this education benefits form.</p>
              <p>
                After submitting the form, you’ll get a confirmation message.
                You can print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <div>
                <h5>VA review</h5>
              </div>
              <p>
                We usually process claims within 30 days. We’ll let you know by
                mail if we need more information.
              </p>
              <p>
                We offer tools and counseling programs to help you make the most
                of your educational options.{' '}
                <a href="/education/about-gi-bill-benefits/how-to-use-benefits/">
                  Learn about career counseling options
                </a>
              </p>
            </li>
            <li className="process-step list-four">
              <div>
                <h5>Decision</h5>
              </div>
              <p>
                You’ll get a Certificate of Eligibility (COE), or award letter,
                in the mail if we've approved your application.
              </p>
              <p>
                If your application wasn’t approved, you’ll get a denial letter
                in the mail.
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the education application"
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={15} ombNumber="2900-0154" expDate="12/31/2019" />
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
