import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import { focusElement } from '../../../common/utils/helpers';
import OMBInfo from '../../../common/components/OMBInfo';
import FormTitle from '../../../common/schemaform/components/FormTitle';
import RequiredLoginView from '../../../common/components/RequiredLoginView';
import { introActions, introSelector } from '../../../common/schemaform/save-in-progress/SaveInProgressIntro';
import { submitIntentToFile } from '../../../common/schemaform/actions';

import formConfig from '../config/form';
import SaveInProgressIntro from './SaveInProgressIntro';

class IntroductionPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      verify: false
    };
  }

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  hasSavedForm = () => {
    const { user } = this.props;
    return user.profile && user.profile.savedForms
      .filter(f => moment.unix(f.metadata.expires_at).isAfter())
      .find(f => f.form === this.props.formId);
  }

  handleLoadPrefill = () => {
    // TODO: determine payload
    submitIntentToFile('name/ssn/other', formConfig.intentToFileUrl, formConfig.trackingPrefix);
    // TODO: store confirmation number in formData
  }

  render() {
    const { signingIn, requiredAccountLevel } = this.state;
    const { user, loginUrl, verifyUrl } = this.props;
    const savedForm = this.hasSavedForm();

    return (
      <div className="schemaform-intro">
        <FormTitle title="Disability Claims for Increase"/>
        <p>Equal to VA Form 21-526EZ (Application for Disability Compensation and Related Compensation Benefits).</p>
        {(!signingIn && !sessionStorage.userToken) && <SaveInProgressIntro
          {...this.props}
          disableButton
          toggleAuthLevel={(shouldVerify) => this.setState({ verify: shouldVerify })}
          handleLoadPrefill={this.handleLoadPrefill}/>}
        {(savedForm || sessionStorage.userToken || signingIn) && <RequiredLoginView
          className="login-container"
          verify={this.state.verify}
          authRequired={requiredAccountLevel}
          serviceRequired={['disability-benefits']}
          user={user}
          loginUrl={loginUrl}
          verifyUrl={verifyUrl}>
          <SaveInProgressIntro
            {...this.props}
            toggleAuthLevel={(shouldVerify) => this.setState({ verify: shouldVerify })}
            handleLoadPrefill={this.handleLoadPrefill}/>
          {!savedForm && <p>Clicking this button establishes your Intent to File. This will make today the effective date for any benefits granted. This intent to file will expire one year from now.</p>}
        </RequiredLoginView>}
        <h4>Follow the steps below to apply for increased disability compensation.</h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>When you apply for a disability increase, be sure to have these on hand:</h6></div>
              <ul>
                <li>Your Social Security number</li>
                <li>VA medical and hospital records that show your claimed disability has gotten worse</li>
                <li>Private medical and hospital records that show your claimed disability has gotten worse</li>
              </ul>
              <p>In some situations you may need to turn in additional forms with your claim, for example, if you’re claiming a dependent or benefits for a seriously disabled child. <a href="#">See the list of required forms for these special situations</a>.</p>
              <p><strong>What if I need help filling out my application?</strong></p>
              <p>An accredited representative, like a Veterans Service Officer (VSO), can help you fill out your claim. </p>
              <p><a href="/disability-benefits/apply/help/index.html">Get help filing your claim</a>.</p>
              <div>
                <div className="usa-alert usa-alert-info schemaform-sip-alert">
                  <div className="usa-alert-body">
                    <p><strong>Disability ratings</strong></p>
                    <p>We assign disability ratings with a severity from 0% to 100% for each disability claim. This rating can change if there are changes in your condition. We’ll decide a claim for increase based on the medical evidence and supporting documents you turn in with your claim.</p>
                    <p><a href="/disability-benefits/eligibility/ratings/">Learn how VA assigns disability ratings</a>.</p>
                  </div>
                </div>
                <br/>
              </div>
            </li>
            <li className="process-step list-two">
              <div><h5>Apply</h5></div>
              <p>Complete this disability compensation benefits form.</p>
              <p>After submitting the form, you’ll get a confirmation message. You can print this for your records.</p>
            </li>
            <li className="process-step list-three">
              <div><h5>VA Review</h5></div>
              <p>We process applications in the order we receive them. We may contact you if we have questions or need more information.</p>
            </li>
            <li className="process-step list-four">
              <div><h5>Decision</h5></div>
              <p>Once we’ve processed your claim, you’ll get a notice in the mail with our decision.</p>
            </li>
          </ol>
        </div>
        {(!signingIn && !sessionStorage.userToken) && <SaveInProgressIntro
          {...this.props}
          disableButton
          buttonOnly
          toggleAuthLevel={(shouldVerify) => this.setState({ verify: shouldVerify })}
          handleLoadPrefill={this.handleLoadPrefill}/>}
        {(savedForm || sessionStorage.userToken || signingIn) && <RequiredLoginView
          containerClass="login-container"
          verify={this.state.verify}
          serviceRequired={['disability-benefits']}
          user={user}
          loginUrl={loginUrl}
          verifyUrl={verifyUrl}>
          <SaveInProgressIntro
            {...this.props}
            disableButton
            buttonOnly
            toggleAuthLevel={(shouldVerify) => this.setState({ verify: shouldVerify })}
            handleLoadPrefill={this.handleLoadPrefill}/>
          {!savedForm && <p>Clicking the following button establishes your Intent to File. This will make today the effective date for any benefits granted. This intent to file will expire one year from now.</p>}
        </RequiredLoginView>}
        {/* TODO: Remove inline style after I figure out why .omb-info--container has a left padding */}
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={25} ombNumber="2900-0747" expDate="11/30/2017"/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userState = state.user;
  return {
    saveInProgress: introSelector(state),
    user: userState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveInProgressActions: bindActionCreators(introActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroductionPage);

export { IntroductionPage };
