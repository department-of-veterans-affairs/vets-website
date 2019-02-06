import React from 'react';
import { focusElement } from '../../../../platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'us-forms-system/lib/js/components/FormTitle';

import SaveInProgressIntro from '../../../../platform/forms/save-in-progress/SaveInProgressIntro';

export class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }
  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for the Veteran Employment Through Technology Education Courses (VET TEC) Pilot Program" />
        <p>
          VA Form 22-0994 (Application for Veteran Employment Through Technology
          Education Courses [VET TEC]).
        </p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the VET TEC Application"
        />
        <h4>Follow the steps below to apply for VET TEC.</h4>
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
                <li>Direct deposit information</li>
                <li>Highest level of education</li>
                <li>Previous high-tech industry experience, if applicable</li>
                <li>
                  (Optional) Information about the school or training facility
                  you want to attend
                </li>
              </ul>
              <p>
                You can complete the application to see if you are eligible,
                even if you have not yet selected the specific program you’d
                like to attend.{' '}
                <a href="https://www.benefits.va.gov/gibill/fgib/VetTec_Veteran.asp">
                  Learn more about the types of programs that are covered by VET
                  TEC
                </a>
                .
              </p>
              <p>
                <strong>What if I need help filling out my application?</strong>{' '}
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you fill out your application.{' '}
                <a href="/disability/get-help-filing-claim/">
                  Find an accredited representative.
                </a>
              </p>
            </li>
            <li className="process-step list-two">
              <div>
                <h5>Apply</h5>
              </div>
              <ul>
                <li>Complete this application form.</li>
                <li>
                  Complete VA Form 22-1990, if you haven’t already. You can
                  access it from the confirmation page that appears once you
                  submit this form (VA Form 22-0994).
                </li>
                <li>
                  After submitting the form, you’ll get a confirmation message.
                  You can print this for your records.
                </li>
              </ul>
            </li>
            <li className="process-step list-three">
              <div>
                <h5>VA Review</h5>
              </div>
              <p>
                We usually process applications within 30 days. We’ll let you
                know by mail if we need more information.
              </p>
              <p>
                We offer tools and counseling programs to help you make the most
                of your educational options.{' '}
                <a href="/education/about-gi-bill-benefits/how-to-use-benefits/">
                  Learn about career counseling options.
                </a>
              </p>
            </li>
            <li className="process-step list-four">
              <div>
                <h5>Decision</h5>
              </div>
              <p>
                You’ll get a Certificate of Eligibility (COE), or award letter,
                in the mail if we’ve approved your application.
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
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the VET TEC Application"
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo
            resBurden={'##'}
            ombNumber="####-####"
            expDate="##/##/####"
          />
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
