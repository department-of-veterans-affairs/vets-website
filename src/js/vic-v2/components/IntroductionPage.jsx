import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { focusElement } from '../../common/utils/helpers';
import FormTitle from '../../common/schemaform/components/FormTitle';
import SaveInProgressIntro, { introActions, introSelector } from '../../common/schemaform/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  goForward = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }

  renderSignInMessage = () => {
    return (
      <div>
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            If you’re signed in to your account, the application process can go more smoothly. Here’s why:
            <br/>
            <ul>
              <li>We can prefill part of your application based on your account details.</li>
              <li>You can save your form in progress, and come back later to finish filling it out.</li>
              <li>You could get your card sooner because we can confirm your Veteran status more quickly.</li>
            </ul>
            <p><button className="va-button-link" onClick={() => this.props.saveInProgressActions.toggleLoginModal(true)}>Sign in to your account.</button></p>
          </div>
        </div>
        <br/>
      </div>
    );
  }

  render() {
    const { user } = this.props.saveInProgress;
    const idProofed = user.profile.services && user.profile.services.some(service => service === 'identity-proofed');
    const signedIn = user.login.currentlyLoggedIn;
    const accountBenefits = (
      <ul>
        <li>We can prefill part of your application based on your account details.</li>
        <li>You can save your form in progress, and come back later to finish filling it out.</li>
        <li>You can get your card sooner because we can confirm your Veteran status more quickly.</li>
      </ul>
    );
    const idProofingReqs = (
      <div>
        <div>To go through the ID.me identity-proofing process, you’ll need:</div>
        <ul>
          <li>A smartphone (or a landline or mobile phone and a computer with an Internet connection)</li>
          <li>Your Social Security number</li>
          <li>Proof of your identity (which could be a driver’s license, passport, or the ability to answer questions based on private and public data (like your credit report))</li>
        </ul>
        <p>Verifying your identity is a one-time process that will take about 5-10 minutes. Once you’ve gone through the identity process, you won’t need to do it again. Signing in next time will be much faster.</p>
      </div>
    );

    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for a Veteran ID Card"/>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          pageList={this.props.route.pageList}
          startText="Start the VIC Application"
          resumeOnly
          renderSignInMessage={this.renderSignInMessage}
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}>
          Please complete the VIC form to apply for a card
        </SaveInProgressIntro>
        <h4>Follow the steps below to apply for a Veteran ID Card.</h4>
        <div className="process schemaform-process schemaform-process-sip">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>When you apply, be sure to have these on hand:</h6></div>
              <ul>
                <li>Your Social Security number</li>
                <li>A digital copy of your DD214, DD256, DD257, or NGB22 that you can upload. This could be a .pdf or other photo file format, like a .jpeg or .png</li>
                <li>A digital color photo of yourself</li>
              </ul>
              <div className="vic-intro-indent">
                <div><h6>The photo has to follow all the standards listed below. It must:</h6></div>
                <ul>
                  <li>Show a full front view of your face and neck, with full visibility of the face and no shadows, <strong>and</strong></li>
                  <li>Be cropped from your shoulders up (much like a passport photo), <strong>and</strong></li>
                  <li>Show you with your eyes open and a neutral expression, <strong>and</strong></li>
                  <li>Be a square size and have a white or plain-color background (with no scenery or other people in the photo), <strong>and</strong></li>
                  <li>Be in a .jpeg, .png, .bmp, or .tiff file format</li>
                </ul>
              </div>
            </li>
            {!signedIn && <li className="process-step list-two">
              <div><h5>Sign In and Verify Your Identity</h5></div>
              <p>You have a choice for how you complete this application.</p>
              <p>Choice 1: Sign In to Vets.gov and Verify Your Identity: We suggest you apply for a Veteran ID Card by first signing in to Vets.gov with either an existing DS Logon (the same one you use for eBenefits or MilConnect) or an ID.me account.</p>
              <p>If you don’t have an account on Vets.gov, you can create one using ID.me, our Veteran-owned, trusted technology partner that provides the strongest identity verification system available.</p>
              <p>When you’re signed in, we can verify your identity to make sure you’re you. This also helps to keep your information safe and prevent fraud and identity theft.</p>
              {accountBenefits}
              <p>Verifying your identity is a one-time process that’ll take about 5-10 minutes. Once you’ve gone through the identity process, you won't need to do it again. To go through the ID.me identity-proofing process, you’ll need:</p>
              <strong>In addition to providing extra security measures, when you’re signed in to your account, your application process can go more smoothly. Here’s why:</strong>
              {idProofingReqs}
              <p>Choice 2: Apply anonymously without signing in.</p>
              <p>You can complete the application without signing in, but it’ll take us longer to verify your identity. This will delay a decision on your application. The fastest way to get your application processed is to sign in with a DS Logon or ID.me account.</p>
            </li>}
            {signedIn && !idProofed && <li className="process-step list-two">
              <div><h5>Verify Your Identity</h5></div>
              <p>Verifying your identity is a security measure that helps us ensure that only you can access your Veteran ID Card. To do this, we use ID.me, our Veteran-owned, trusted technology partner that provides the strongest identity verification system available. ID.me helps people like you easily prove your identity.</p>
              <p>If you use your DS Logon account to sign in, we’ll connect your account to Vets.gov through ID.me.</p>
              {idProofingReqs}
              <p><a className="usa-button usa-button-primary" href="/verify?next=%2Fveteran-id-card%2Fapply">Verify Your Identity</a></p>
              <p><a href="/faq">Get more information about signing in to Vets.gov</a>.</p>
            </li>}
            {signedIn && idProofed && <li className="process-step list-two">
              <div><h5>Sign In</h5></div>
              <p>We’re able to process your application faster since you’re signed in to your account.</p> Other benefits to being signed in include:
              {accountBenefits}
            </li>}
            <li className="process-step list-three">
              <div><h5>Apply</h5></div>
              <p>Complete this Veteran ID Card application.</p>
              <p>After submitting the form, you’ll get a confirmation message. You can print this for your records.</p>
            </li>
            <li className="process-step list-four">
              <div><h5>VA Review</h5></div>
              <p>We process applications in the order we receive them.</p>
              <p>We’ll review your application to verify your eligibility. We may contact you if we have any questions or need more information.</p>
            </li>
            <li className="process-step list-five">
              <div><h5>Decision</h5></div>
              <p>Once we verify your application, you should receive your Veteran ID Card by mail in about 60 days.</p>
            </li>
          </ol>
        </div>
        {!signedIn && <div>
          <p>Sign in or create an account before you apply for a Veteran ID Card.
            <button className="usa-button usa-button-primary" onClick={() => this.props.saveInProgressActions.toggleLoginModal(true)}>Sign In or Create an Account</button>
          </p>
          Begin the Veteran ID Card application without signing in.
        </div>}
        <SaveInProgressIntro
          buttonOnly
          pageList={this.props.route.pageList}
          startText="Start the VIC Application"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}/>
        <p><a href="/faq">Get more information about signing in to Vets.gov</a>.</p>
        <a href="/privacy">Privacy Act Statement</a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    saveInProgress: introSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveInProgressActions: bindActionCreators(introActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroductionPage);

export { IntroductionPage };
