import React from 'react';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { connect } from 'react-redux';
import { showEduBenefits1995Wizard } from 'applications/edu-benefits/selectors/educationWizard';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_NOT_STARTED,
} from 'applications/static-pages/wizard';

// export const introPageDescription = (automatedTest = false) => {
//   return isProductionOfTestProdEnv(automatedTest)
//     ? ' Equal to VA Form 22-1995 (Request for Change of Program or Place of Training).'
//     : 'Equal to VA Form 22-1995 (Request for Change of Benefit, Program or Place of Training).';
// };

export class IntroductionPageUpdate extends React.Component {
  state = {
    status: sessionStorage.getItem(WIZARD_STATUS) || WIZARD_STATUS_NOT_STARTED,
  };

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  setWizardStatus = value => {
    sessionStorage.setItem(WIZARD_STATUS, value);
    this.setState({ status: value });
  };

  renderSaveInProgressIntro = buttonOnly => (
    <SaveInProgressIntro
      buttonOnly={buttonOnly}
      prefillEnabled={this.props.route.formConfig.prefillEnabled}
      messages={this.props.route.formConfig.savedFormMessages}
      pageList={this.props.route.pageList}
      startText="Start the education application"
      unauthStartText="Sign in or create an account"
    />
  );

  render() {
    const { showWizard } = this.props;

    if (showWizard === undefined) return null;

    return (
      <div
        className="schemaform-intro"
        itemScope
        itemType="http://schema.org/HowTo"
      >
        <FormTitle title="Change your education benefits" />
        <p itemProp="description">
          Equal to VA Form 22-1995 (Request for Change of Benefit, Program or
          Place of Training).
        </p>

        <p>
          {' '}
          <span className="vads-u-font-weight--bold">Note: </span>
          As of August 7, 2024, VA Form 22-1995 consolidates elements from VA
          Form 22-5495 to better serve Veterans and their families.
        </p>
        <div className="subway-map">
          {this.renderSaveInProgressIntro()}
          <h4>Follow the steps below to apply for education benefits.</h4>
          <div className="process schemaform-process">
            <ol>
              <li
                className="process-step list-one"
                itemProp="steps"
                itemScope
                itemType="http://schema.org/HowToSection"
              >
                <div itemProp="name">
                  <h5>Prepare</h5>
                </div>
                <div itemProp="itemListElement">
                  <div>
                    <h6>To fill out this application, you’ll need your:</h6>
                  </div>
                  <ul>
                    <li>Social Security number (required)</li>
                    <li>
                      Basic information about the school or training facility
                      you want to attend
                    </li>
                    <li>
                      Bank account direct deposit information (if adding or
                      changing an account)
                    </li>
                    <li>Military history</li>
                    <li>
                      Benefit you have most recently used and benefit you want
                      to change to
                    </li>
                    <li>
                      Sponsor information if using or want to use DEA Chapter 35
                      benefit
                    </li>
                    <li>
                      Guardian information if applicant is under the age of 18{' '}
                    </li>
                  </ul>
                  <p>
                    <strong>
                      What if I need help filling out my application?{' '}
                    </strong>
                    An accredited individual, like a Veterans Service Officer
                    (VSO), or a Veteran representative at your school, can help
                    you fill out your claim.{' '}
                    <a href="/disability/get-help-filing-claim/">
                      Get help filing your claim
                    </a>
                  </p>
                  <p>
                    See what benefits you’ll get at the school you want to
                    attend.{' '}
                    <a href="/education/gi-bill-comparison-tool/">
                      Use the GI Bill Comparison Tool
                    </a>
                  </p>
                </div>
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
              <li
                className="process-step list-three"
                itemProp="steps"
                itemScope
                itemType="http://schema.org/HowToSection"
              >
                <div itemProp="name">
                  <h5>VA review</h5>
                </div>
                <div itemProp="itemListElement">
                  <p>
                    We usually process claims within 30 days. We’ll let you know
                    by mail if we need more information.
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
              <li className="process-step list-four">
                <div>
                  <h5>Decision</h5>
                </div>
                <p>
                  If we approve your application, you’ll get a Certificate of
                  Eligibility (COE) in the mail. Bring this COE to the VA
                  certifying official at your school. This person is usually in
                  the Registrar or Financial Aid office at the school.
                </p>
                <p>
                  If your application isn’t approved, you’ll get a denial letter
                  in the mail.
                </p>
              </li>
            </ol>
          </div>
          {this.renderSaveInProgressIntro(true)}
          <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
            <va-omb-info
              res-burden={20}
              omb-number="2900-0074"
              exp-date="08/31/2024"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showWizard: showEduBenefits1995Wizard(state),
});

export default connect(mapStateToProps)(IntroductionPageUpdate);
