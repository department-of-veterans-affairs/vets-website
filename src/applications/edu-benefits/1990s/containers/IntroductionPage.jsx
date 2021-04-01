import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { connect } from 'react-redux';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  loginPrompt() {
    if (this.props.isLoggedIn) {
      return null;
    }

    return (
      <SaveInProgressIntro
        prefillEnabled={this.props.route.formConfig.prefillEnabled}
        messages={this.props.route.formConfig.savedFormMessages}
        pageList={this.props.route.pageList}
        startText="Sign in or create an account"
        unauthStartText="Sign in or create an account"
        hideUnauthedStartLink
      />
    );
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Veteran Rapid Retraining Assistance Program (VRRAP)" />
        {this.loginPrompt()}
        <h4>Follow the steps below to apply for this program</h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h5>Determine your eligibility</h5>
              <h6>
                To be eligible for the Veteran Rapid Retraining Assistance
                Program (VRRAP), you must meet all the requirements below.
              </h6>
              <ul>
                <li>Be between ages 22-66;</li>
                <li>Be unemployed as a result of the COVID-19 pandemic;</li>
                <li>
                  Not be eligible for any federal GI Bill program (if eligible
                  for the Post-9/11 GI Bill, they must have transferred their
                  benefits to family members -- thereby having no GI Bill
                  eligibility for themselves);
                </li>
                <li>
                  Not be VA rated as totally disabled due to unemployability;
                </li>
                <li>
                  Not be enrolled in any other federal or state employment
                  programs; or
                </li>
                <li>
                  Not be in receipt of any unemployment or CARES Act benefits.
                </li>
              </ul>
            </li>
            <li className="process-step list-two">
              <h5>Prepare</h5>
              <h6>To fill out this application, you’ll need your:</h6>
              <ul>
                <li>Social Security number</li>
                <li>Bank account direct deposit information</li>
              </ul>
              <p>
                <strong>What if I need help filling out my application?</strong>{' '}
                An accredited individual, like a Veterans Service Officer (VSO)
                or a Veteran representative at your school, can help you fill
                out this application.{' '}
                <a href="/disability/get-help-filing-claim/">
                  Get help filing your claim
                </a>
              </p>
            </li>
            <li className="process-step list-three">
              <h5>Apply</h5>
              <p>Complete this education benefits form.</p>
              <p>
                After submitting the form, you’ll get a confirmation message.
                You can print this page for your records.
              </p>
            </li>
            <li className="process-step list-four">
              <h5>VA Review</h5>
              <p>
                We usually process claims within 30 days. We’ll let you know by
                mail if we need more information.
              </p>
              <p>
                <a href="/education/after-you-apply/">
                  Learn more about what happens after you apply
                </a>
              </p>
            </li>
            <li className="process-step list-five">
              <h5>Decision</h5>
              <p>
                If we approve your application, you’ll get a Certificate of
                Eligibility (COE), or award letter, in the mail. Bring this COE
                to the VA certifying official at your school. This person is
                usually in the Registrar or Financial Aid office at the school.
              </p>
              <p>
                If your application isn't approved, you’ll get a denial letter
                in the mail.
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly={!this.props.isLoggedIn}
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the education application"
          unauthStartText="Sign in or create an account"
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

export default connect(mapStateToProps)(IntroductionPage);
