import React from 'react';
import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from '../content/SaveInProgressIntro';
import { connect } from 'react-redux';

import { getRemainingEntitlement } from '../actions/post-911-gib-status';

export class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
    this.props.getRemainingEntitlement();
  }

  moreThanSixMonths = remaining => {
    const totalDays = remaining?.months * 30 + remaining?.days;
    return totalDays > 180;
  };

  entitlementRemainingAlert() {
    if (this.props.isLoggedIn) {
      if (this.moreThanSixMonths(this.props?.remainingEntitlement)) {
        return (
          <div
            id="entitlement-remaining-alert"
            className="usa-alert usa-alert-warning schemaform-sip-alert"
          >
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">
                It appears you're not eligible
              </h3>
              <div className="usa-alert-text">
                <p>
                  To be eligible for the Rogers STEM Scholarship, you must have
                  less than 6 months of Post-9/11 GI Bill benefits left when you
                  submit your application.
                </p>
                <p>
                  Our entitlement system shows you have the following benefits
                  remaining:{' '}
                  <strong>
                    {this.props?.remainingEntitlement.months} months,{' '}
                    {this.props?.remainingEntitlement.days} days
                  </strong>
                </p>
                <p>
                  If you apply and you’re not eligible, your application will be
                  denied.
                </p>
              </div>
            </div>
          </div>
        );
      }

      return (
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the education application"
        />
      );
    }

    return (
      <SaveInProgressIntro
        prefillEnabled={this.props.route.formConfig.prefillEnabled}
        messages={this.props.route.formConfig.savedFormMessages}
        pageList={this.props.route.pageList}
        startText="Sign in or create an account"
      />
    );
  }

  render() {
    return (
      <div
        className="schemaform-intro"
        itemScope
        itemType="http://schema.org/HowTo"
      >
        <FormTitle title="Apply for the Rogers STEM Scholarship" />
        <p itemProp="description">
          Equal to VA Form 22-10203 (Application for Edith Nourse Rogers STEM
          Scholarship)
        </p>
        {this.entitlementRemainingAlert()}
        <h4>Follow the steps below to apply for this scholarship</h4>
        <div className="process schemaform-process">
          <ol>
            <li
              className="process-step list-one"
              itemProp="steps"
              itemScope
              itemType="http://schema.org/HowToSection"
            >
              <div itemProp="name">
                <h5>Determine eligibility</h5>
              </div>
              <div itemProp="itemListElement">
                <div className="vads-u-font-weight--bold">
                  <p>
                    To be eligible for the{' '}
                    <a href="https://benefits.va.gov/gibill/fgib/stem.asp">
                      Edith Nourse Rogers STEM Scholarship
                    </a>
                    , you must meet all the requirements below.
                  </p>
                </div>
                <ul>
                  <li>
                    <b>Education benefit:</b> You're using or recently used
                    Post-9/11 GI Bill or Fry Scholarship benefits.
                  </li>
                  <li>
                    <b>STEM degree:</b> You're enrolled in a bachelor’s degree
                    program for science, technology, engineering, or math
                    (STEM), <b>or</b> have already earned a STEM bachelor’s
                    degree and are pursuing a teaching certification.{' '}
                    <a href="https://benefits.va.gov/gibill/docs/fgib/STEM_Program_List.pdf">
                      See eligible programs
                    </a>
                  </li>
                  <li>
                    <b>Remaining entitlement:</b> You've used all of your
                    education benefits or are within 6 months of doing so when
                    you submit your application.{' '}
                    <a href="https://www.va.gov/education/gi-bill/post-9-11/ch-33-benefit/">
                      Check your remaining benefits
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li
              className="process-step list-two"
              itemProp="steps"
              itemScope
              itemType="http://schema.org/HowToSection"
            >
              <div itemProp="name">
                <h5>Prepare</h5>
              </div>
              <div itemProp="itemListElement">
                <div>
                  <b>To fill out this application, you’ll need your:</b>
                </div>
                <ul>
                  <li>Social Security number</li>
                  <li>Information about your school and STEM degree</li>
                  <li>Bank account direct deposit information</li>
                </ul>
                <p>
                  <b>What if I need help filling out my application?</b> An
                  accredited individual, like a Veterans Service Officer (VSO)
                  or a Veteran representative at your school, can help you fill
                  out this application.{' '}
                  <a href="/disability/get-help-filing-claim/">
                    Get help filing your claim
                  </a>
                </p>
              </div>
            </li>
            <li className="process-step list-three">
              <div>
                <h5>Apply</h5>
              </div>
              <p>Complete this education benefits form.</p>
              <p>
                After submitting the form, you’ll get a confirmation message.
                You can print this page for your records.
              </p>
            </li>
            <li
              className="process-step list-four"
              itemProp="steps"
              itemScope
              itemType="http://schema.org/HowToSection"
            >
              <div itemProp="name">
                <h5>VA review</h5>
              </div>
              <div itemProp="itemListElement">
                <p>
                  We usually process claims within <b>30 days</b>. We’ll let you
                  know by mail if we need more information.
                </p>
                <p>
                  We offer tools and counseling programs to help you make the
                  most of your educational options.{' '}
                  <a href="/education/about-gi-bill-benefits/how-to-use-benefits/">
                    Learn about career counseling options
                  </a>
                </p>
              </div>
            </li>
            <li className="process-step list-five">
              <div>
                <h5>Decision</h5>
              </div>
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
        />
        <div
          className="omb-info--container"
          style={{ paddingLeft: '0px' }}
          id="omb-info-container"
        >
          <OMBInfo resBurden={15} ombNumber="2900-0878" expDate="06/30/2023" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
    remainingEntitlement: state.post911GIBStatus.remainingEntitlement,
  };
};

const mapDispatchToProps = {
  getRemainingEntitlement,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
