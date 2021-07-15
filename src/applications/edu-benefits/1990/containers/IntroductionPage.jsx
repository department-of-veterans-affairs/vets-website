import React from 'react';
import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import WizardContainer from '../../wizard/containers/WizardContainer';
import { connect } from 'react-redux';
import { showEduBenefits1990Wizard } from 'applications/edu-benefits/selectors/educationWizard';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';
import HowToApplyPost911GiBill from '../HowToApplyPost911GiBill';

export class IntroductionPage extends React.Component {
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

  render() {
    const { status } = this.state;
    const { showWizard } = this.props;
    const show = showWizard && status !== WIZARD_STATUS_COMPLETE;

    if (showWizard === undefined) return null;
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for VA Education Benefits" />
        <p>Equal to VA Form 22-1990 (Application for VA Education Benefits).</p>

        {show ? (
          <WizardContainer setWizardStatus={this.setWizardStatus} />
        ) : (
          <div className="subway-map">
            <HowToApplyPost911GiBill />
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
                    <h6>To fill out this application, you’ll need:</h6>
                  </div>
                  <ul>
                    <li>Knowledge of your military service history</li>
                    <li>Your current address and contact information</li>
                  </ul>
                  <p>
                    <strong>
                      What if I need help filling out my application?
                    </strong>{' '}
                    An accredited representative, like a Veterans Service
                    Officer (VSO), can help you fill out your claim.{' '}
                    <a href="/disability/get-help-filing-claim/">
                      Find an accredited representative
                    </a>
                    .
                  </p>
                </li>
                <li className="process-step list-two">
                  <div>
                    <h5>Apply</h5>
                  </div>
                  <p>Complete this education benefits form.</p>
                </li>
                <li className="process-step list-three">
                  <div>
                    <h5>VA review</h5>
                  </div>
                  <p>
                    After submitting the application, you may get a decision
                    automatically.
                  </p>
                  <p>
                    Sometimes we may need to take a closer look at your
                    application. This process will usually take 30 days. We’ll
                    let you know by your preferred contact method if we need
                    more information.
                  </p>
                </li>
                <li className="process-step list-four">
                  <div>
                    <h5>Decision</h5>
                  </div>
                  <p>
                    If we've approved your application, you’ll get a link to
                    download your Certificate of Eligibility (COE), or award
                    letter.
                  </p>
                  <p>
                    If your application wasn’t approved, you’ll get a link to
                    download denial letter.
                  </p>
                  <p>We will also send these letters in the mail.</p>
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
              <OMBInfo
                resBurden={15}
                ombNumber="2900-0154"
                expDate="02/28/2023"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showWizard: showEduBenefits1990Wizard(state),
});

export default connect(mapStateToProps)(IntroductionPage);
