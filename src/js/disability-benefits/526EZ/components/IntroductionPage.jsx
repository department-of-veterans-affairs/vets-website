import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import { focusElement } from '../../../common/utils/helpers';
import OMBInfo from '../../../common/components/OMBInfo';
import FormTitle from '../../../common/schemaform/components/FormTitle';
import RequiredLoginView from '../../../common/components/RequiredLoginView';
import SaveInProgressIntro, { introActions, introSelector } from '../../../common/schemaform/save-in-progress/SaveInProgressIntro';
import { submitIntentToFile } from '../../../common/schemaform/actions';

import formConfig from '../config/form';

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

  handleLoadPrefill = () => {
    // TODO: determine payload
    submitIntentToFile('name/ssn/other', formConfig.intentToFileUrl, formConfig.trackingPrefix);
    // TODO: store confirmation number in formData
  }

  render() {
    const { signingIn, requiredAccountLevel } = this.state;
    const { user, loginUrl, verifyUrl } = this.props;
    const savedForm = user.profile && user.profile.savedForms
      .filter(f => moment.unix(f.metadata.expires_at).isAfter())
      .find(f => f.form === this.props.formId);

    return (
      <div className="schemaform-intro">
        <FormTitle title="Disability Claims for Increase"/>
        <p>Equal to VA Form 21-526EZ.</p>
        {(!signingIn && !sessionStorage.userToken) && <SaveInProgressIntro
          prefillAvailable={user.profile.accountType === 3}
          hideButton
          toggleAuthLevel={(shouldVerify) => this.setState({ verify: shouldVerify })}
          verifyRequiredPrefill={this.props.route.formConfig.verifyRequiredPrefill}
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          handleLoadPrefill={this.handleLoadPrefill}
          startText="Start the Disability Compensation Application"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}/>}
        {(savedForm || sessionStorage.userToken || signingIn) && <RequiredLoginView
          className="login-container"
          verify={this.state.verify}
          authRequired={requiredAccountLevel}
          serviceRequired={['disability-benefits']}
          user={user}
          loginUrl={loginUrl}
          verifyUrl={verifyUrl}>
          <SaveInProgressIntro
            prefillAvailable={user.profile.accountType === 3}
            toggleAuthLevel={(shouldVerify) => this.setState({ verify: shouldVerify })}
            verifyRequiredPrefill={this.props.route.formConfig.verifyRequiredPrefill}
            prefillEnabled={this.props.route.formConfig.prefillEnabled}
            messages={this.props.route.formConfig.savedFormMessages}
            pageList={this.props.route.pageList}
            handleLoadPrefill={this.handleLoadPrefill}
            startText="Start the Disability Compensation Application"
            {...this.props.saveInProgressActions}
            {...this.props.saveInProgress}/>
          {!savedForm && <p>Clicking the following button establishes your Intent to File. This will make today the effective date for any benefits granted. This intent to file will expire one year from now.</p>}
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
              <p><strong>What if I need help filling out my application?</strong> An accredited representative, like a Veterans Service Officer (VSO), can help you fill out your claim. <a href="/disability-benefits/apply/help/index.html">Get help filing your claim</a>.</p>
              <h6>Learn about educational programs</h6>
              <p>See what benefits you’ll get at the school you want to attend. <a href="/gi-bill-comparison-tool/">Use the GI Bill Comparison Tool</a>.</p>
            </li>
            <li className="process-step list-two">
              <div><h5>Apply</h5></div>
              <p>Complete this education benefits form.</p>
              <p>After submitting the form, you’ll get a confirmation message. You can print this for your records.</p>
            </li>
            <li className="process-step list-three">
              <div><h5>VA Review</h5></div>
              <p>We usually process claims within 30 days. We’ll let you know by mail if we need more information.</p>
              <p>We offer tools and counseling programs to help you make the most of your educational options. <a href="/education/tools-programs/">Learn about career counseling options.</a></p>
            </li>
            <li className="process-step list-four">
              <div><h5>Decision</h5></div>
              <p>You’ll get a Certificate of Eligibility (COE), or award letter, in the mail if we've approved your application. Bring this to the VA certifying official at your school.</p>
              <p>If your application wasn’t approved, you’ll get a denial letter in the mail.</p>
            </li>
          </ol>
        </div>
        {(!signingIn && !sessionStorage.userToken) && <SaveInProgressIntro
          prefillAvailable={user.profile.accountType === 1}
          hideButton
          buttonOnly
          toggleAuthLevel={(shouldVerify) => this.setState({ verify: shouldVerify })}
          verifyRequiredPrefill={this.props.route.formConfig.verifyRequiredPrefill}
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          goToBeginning={this.goToBeginning}
          startText="Start the Disability Compensation Application"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}/>}
        {(savedForm || sessionStorage.userToken || signingIn) && <RequiredLoginView
          containerClass="login-container"
          verify={this.state.verify}
          serviceRequired={['disability-benefits']}
          user={user}
          loginUrl={loginUrl}
          verifyUrl={verifyUrl}>
          <SaveInProgressIntro
            buttonOnly
            prefillAvailable={user.profile.accountType === 3}
            toggleAuthLevel={(shouldVerify) => this.setState({ verify: shouldVerify })}
            verifyRequiredPrefill={this.props.route.formConfig.verifyRequiredPrefill}
            prefillEnabled={this.props.route.formConfig.prefillEnabled}
            messages={this.props.route.formConfig.savedFormMessages}
            pageList={this.props.route.pageList}
            handleLoadPrefill={this.handleLoadPrefill}
            startText="Start the Disability Compensation Application"
            {...this.props.saveInProgressActions}
            {...this.props.saveInProgress}/>
          {!savedForm && <p>Clicking the following button establishes your Intent to File. This will make today the effective date for any benefits granted. This intent to file will expire one year from now.</p>}
        </RequiredLoginView>}
        {/* TODO: Remove inline style after I figure out why .omb-info--container has a left padding */}
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={20} ombNumber="2900-0074" expDate="05/31/2018"/>
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
